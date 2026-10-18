import { Queue, Worker, type Job } from "bullmq";
import IORedis from "ioredis";
import { QUEUE_NAMES } from "./queues.js";
import { runDiscover, type DiscoverJobPayload } from "./jobs/discover.js";
import { runEnrich, type EnrichJobPayload } from "./jobs/enrich.js";
import { runAuditJob, type AuditJobPayload } from "./jobs/audit.js";
import {
  runScoreAndPersist,
  type ScoreAndPersistPayload,
} from "./jobs/score-and-persist.js";
import { runProve, type ProveJobPayload } from "./jobs/prove.js";
import { runMessage, type MessageJobPayload } from "./jobs/message.js";
import type { EntityContact, EntitySignal } from "@scoutline/core";

export { QUEUE_NAMES } from "./queues.js";
export { getSourceAdapter, SOURCE_ADAPTER_IDS } from "./adapters.js";
export { runDiscover } from "./jobs/discover.js";
export { runEnrich } from "./jobs/enrich.js";
export { runAuditJob } from "./jobs/audit.js";
export { runScoreAndPersist } from "./jobs/score-and-persist.js";
export { runProve } from "./jobs/prove.js";
export { runMessage } from "./jobs/message.js";

function connectionFromEnv(): IORedis {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL is required to start workers");
  }
  return new IORedis(redisUrl, { maxRetriesPerRequest: null });
}

/**
 * Start BullMQ workers for the full pipeline.
 * discover → enrich → audit → score → prove → message.
 */
export function startWorkers(): Worker[] {
  const connection = connectionFromEnv();
  const workers: Worker[] = [];

  const enrichQueue = new Queue(QUEUE_NAMES.enrich, { connection });
  const auditQueue = new Queue(QUEUE_NAMES.audit, { connection });
  const scoreQueue = new Queue(QUEUE_NAMES.score, { connection });
  const proveQueue = new Queue(QUEUE_NAMES.prove, { connection });
  const messageQueue = new Queue(QUEUE_NAMES.message, { connection });

  const discoverWorker = new Worker(
    QUEUE_NAMES.discover,
    async (job: Job<DiscoverJobPayload>) => {
      const result = await runDiscover(job.data);
      if (job.data.enqueueEnrich !== false) {
        for (const candidate of result.candidates) {
          if (!candidate.domain) {
            continue;
          }
          await enrichQueue.add(
            "enrich",
            {
              tenantId: result.tenantId,
              candidate,
              serviceKey: result.serviceKey,
              modeKeys: result.modeKeys,
            } satisfies EnrichJobPayload,
            { removeOnComplete: 100, removeOnFail: 50 },
          );
        }
      }
      return result;
    },
    { connection },
  );
  workers.push(discoverWorker);

  const enrichWorker = new Worker(
    QUEUE_NAMES.enrich,
    async (job: Job<EnrichJobPayload>) => {
      const result = await runEnrich(job.data);
      if (result.enrich) {
        await auditQueue.add(
          "audit",
          {
            tenantId: result.tenantId,
            candidate: result.candidate,
            enrich: result.enrich,
            serviceKey: result.serviceKey,
            modeKeys: result.modeKeys,
          } satisfies AuditJobPayload,
          { removeOnComplete: 100, removeOnFail: 50 },
        );
      }
      return result;
    },
    { connection },
  );
  workers.push(enrichWorker);

  const auditWorker = new Worker(
    QUEUE_NAMES.audit,
    async (job: Job<AuditJobPayload>) => {
      const result = runAuditJob(job.data);
      const signal: EntitySignal = {
        id: crypto.randomUUID(),
        entityId: "00000000-0000-0000-0000-000000000000",
        signalType: result.candidate.signalType,
        source: result.candidate.source,
        evidenceUrl: result.candidate.evidenceUrl,
        observedAt: new Date().toISOString(),
        expiresAt: null,
        rawPayloadRef: null,
      };

      const contacts: EntityContact[] = result.enrich.contacts.map((c) => ({
        id: crypto.randomUUID(),
        entityId: "00000000-0000-0000-0000-000000000000",
        email: c.email,
        phone: c.phone,
        role: null,
        socials: {},
        verificationStatus: c.email ? "syntax_ok" : "unverified",
        source: "site_enrich",
      }));

      const scorePayload: ScoreAndPersistPayload = {
        tenantId: result.tenantId,
        entity: {
          canonicalName: result.candidate.canonicalName,
          domain: result.candidate.domain,
          country: result.candidate.country,
          city: result.candidate.city,
          category: result.candidate.category,
          registryIds: result.candidate.registryIds,
        },
        findings: result.audit.findings,
        signals: [signal],
        contacts,
        agencyCredits: [],
        baseFreshness: "fresh",
        serviceKey: result.serviceKey,
        modeKeys: result.modeKeys,
        spendCredit: true,
        enqueueProve: true,
      };

      await scoreQueue.add("score", scorePayload, {
        removeOnComplete: 100,
        removeOnFail: 50,
      });
      return result;
    },
    { connection },
  );
  workers.push(auditWorker);

  const scoreWorker = new Worker(
    QUEUE_NAMES.score,
    async (job: Job<ScoreAndPersistPayload>) => {
      const result = await runScoreAndPersist(job.data);
      if (
        !result.rejected &&
        result.leadId &&
        result.breakdown &&
        result.enqueueProve
      ) {
        const entityUrl = result.entityDomain
          ? `https://${result.entityDomain}`
          : null;
        await proveQueue.add(
          "prove",
          {
            tenantId: job.data.tenantId,
            leadId: result.leadId,
            entityName: result.entityName,
            entityDomain: result.entityDomain,
            entityUrl,
            serviceLabel: result.serviceLabel,
            freshnessClass: result.freshnessClass,
            score: result.score,
            breakdown: result.breakdown,
            findings: result.findings,
            preparedBy: result.preparedBy,
            enqueueMessage: true,
            senderName: "Agency team",
            senderAgency: result.preparedBy,
            channel: "email",
          } satisfies ProveJobPayload,
          { removeOnComplete: 100, removeOnFail: 50 },
        );
      }
      return result;
    },
    { connection },
  );
  workers.push(scoreWorker);

  const proveWorker = new Worker(
    QUEUE_NAMES.prove,
    async (job: Job<ProveJobPayload>) => {
      const result = await runProve(job.data);
      if (job.data.enqueueMessage) {
        const baseUrl = process.env.BETTER_AUTH_URL ?? process.env.APP_URL ?? "";
        const proofShareUrl = baseUrl
          ? `${baseUrl.replace(/\/$/, "")}${result.sharePath}`
          : result.sharePath;

        await messageQueue.add(
          "message",
          {
            tenantId: result.tenantId,
            leadId: result.leadId,
            entityName: job.data.entityName,
            entityDomain: job.data.entityDomain,
            contactName: job.data.contactName ?? null,
            serviceLabel: job.data.serviceLabel ?? "marketing services",
            senderName: job.data.senderName ?? "Agency team",
            senderAgency: job.data.senderAgency ?? "Scoutline",
            findings: job.data.findings,
            proofShareUrl,
            channel: job.data.channel ?? "email",
          } satisfies MessageJobPayload,
          { removeOnComplete: 100, removeOnFail: 50 },
        );
      }
      return result;
    },
    { connection },
  );
  workers.push(proveWorker);

  const messageWorker = new Worker(
    QUEUE_NAMES.message,
    async (job: Job<MessageJobPayload>) => {
      return runMessage(job.data);
    },
    { connection },
  );
  workers.push(messageWorker);

  for (const w of workers) {
    w.on("failed", (job, err) => {
      console.error(`[${w.name}] job ${job?.id ?? "unknown"} failed:`, err.message);
    });
  }

  return workers;
}

const isMain =
  process.argv[1]?.endsWith("index.js") ||
  process.argv[1]?.endsWith("index.ts");

if (isMain) {
  const workers = startWorkers();
  console.log(
    `Scoutline worker started: ${workers.map((w) => w.name).join(", ")}`,
  );
}
