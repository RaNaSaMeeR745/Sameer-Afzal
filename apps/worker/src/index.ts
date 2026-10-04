import { Queue, Worker } from "bullmq";
import { createRedisConnection } from "./redis.js";
import {
  DEFAULT_JOB_OPTIONS,
  QUEUE_NAMES,
  type DiscoverJobData,
  type AuditJobData,
  type EnrichJobData,
  type ProveJobData,
} from "./queues.js";
import { processDiscoverJob } from "./jobs/discover.js";
import { processAuditJob } from "./jobs/audit.js";
import { processScoreJob, type ScoreJobPayload } from "./jobs/score.js";
import { processEnrichJob } from "./jobs/enrich.js";
import { processProveJob } from "./jobs/prove.js";

export const APP_NAME = "@scoutline/worker" as const;

async function main(): Promise<void> {
  const connection = createRedisConnection();

  const discoverQueue = new Queue(QUEUE_NAMES.discover, {
    connection,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  });
  const enrichQueue = new Queue(QUEUE_NAMES.enrich, {
    connection,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  });
  const auditQueue = new Queue(QUEUE_NAMES.audit, {
    connection,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  });
  const scoreQueue = new Queue(QUEUE_NAMES.score, {
    connection,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  });
  const proveQueue = new Queue(QUEUE_NAMES.prove, {
    connection,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  });

  const discoverWorker = new Worker(
    QUEUE_NAMES.discover,
    async (job) => processDiscoverJob(job),
    { connection, concurrency: 2 },
  );

  const enrichWorker = new Worker(
    QUEUE_NAMES.enrich,
    async (job) => processEnrichJob(job),
    { connection, concurrency: 2 },
  );

  const auditWorker = new Worker(
    QUEUE_NAMES.audit,
    async (job) => processAuditJob(job),
    { connection, concurrency: 4 },
  );

  const scoreWorker = new Worker(
    QUEUE_NAMES.score,
    async (job) => processScoreJob(job),
    { connection, concurrency: 4 },
  );

  const proveWorker = new Worker(
    QUEUE_NAMES.prove,
    async (job) => processProveJob(job),
    { connection, concurrency: 4 },
  );

  const onFailed =
    (queueLabel: string) => (job: { id?: string } | undefined, err: Error) => {
      console.error(
        `[${queueLabel}] job ${job?.id ?? "unknown"} failed:`,
        err.message,
      );
    };

  discoverWorker.on("failed", onFailed("discover"));
  enrichWorker.on("failed", onFailed("enrich"));
  auditWorker.on("failed", onFailed("audit"));
  scoreWorker.on("failed", onFailed("score"));
  proveWorker.on("failed", onFailed("prove"));

  discoverWorker.on("completed", (job) => {
    console.log(
      `[discover] job ${job.id} completed (${job.returnvalue?.candidateCount ?? 0} candidates)`,
    );
  });
  enrichWorker.on("completed", (job) => {
    console.log(
      `[enrich] job ${job.id} completed (${job.returnvalue?.contactCount ?? 0} contacts)`,
    );
  });
  auditWorker.on("completed", (job) => {
    console.log(
      `[audit] job ${job.id} completed (${job.returnvalue?.findingCount ?? 0} findings)`,
    );
  });
  scoreWorker.on("completed", (job) => {
    console.log(
      `[score] job ${job.id} completed (score=${job.returnvalue?.score ?? "n/a"})`,
    );
  });
  proveWorker.on("completed", (job) => {
    console.log(
      `[prove] job ${job.id} completed (${job.returnvalue?.findingCount ?? 0} findings in report)`,
    );
  });

  console.log(
    `${APP_NAME} listening on queues: discover, enrich, audit, score, prove`,
  );

  const shutdown = async () => {
    console.log(`${APP_NAME} shutting down`);
    await Promise.all([
      discoverWorker.close(),
      enrichWorker.close(),
      auditWorker.close(),
      scoreWorker.close(),
      proveWorker.close(),
      discoverQueue.close(),
      enrichQueue.close(),
      auditQueue.close(),
      scoreQueue.close(),
      proveQueue.close(),
      connection.quit(),
    ]);
    process.exit(0);
  };

  process.on("SIGINT", () => {
    void shutdown();
  });
  process.on("SIGTERM", () => {
    void shutdown();
  });
}

main().catch((err: unknown) => {
  console.error(`${APP_NAME} failed to start:`, err);
  process.exit(1);
});

export type {
  DiscoverJobData,
  AuditJobData,
  EnrichJobData,
  ProveJobData,
  ScoreJobPayload,
};
