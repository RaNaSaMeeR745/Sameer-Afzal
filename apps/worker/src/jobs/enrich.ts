import type { Job } from "bullmq";
import { enrichEntity } from "@scoutline/enrich";
import type { EnrichJobData } from "../queues.js";

export interface EnrichJobResult {
  tenantId: string;
  entityId: string;
  finalUrl: string;
  statusCode: number;
  contactCount: number;
  contacts: ReturnType<typeof enrichEntity> extends Promise<infer R>
    ? R["contacts"]
    : never;
  tech: ReturnType<typeof enrichEntity> extends Promise<infer R>
    ? R["tech"]
    : never;
  html: string;
}

/**
 * Enrich job processor: polite fetch of domain or evidence URL,
 * then contact extraction and tech fingerprint.
 */
export async function processEnrichJob(
  job: Job<EnrichJobData>,
): Promise<EnrichJobResult> {
  const data = job.data;
  const target = data.evidenceUrl || data.domain;
  if (!target) {
    throw new Error("Enrich job requires domain or evidenceUrl");
  }

  await job.updateProgress(15);
  const result = await enrichEntity({ domainOrUrl: target });
  await job.updateProgress(100);

  return {
    tenantId: data.tenantId,
    entityId: data.entityId,
    finalUrl: result.page.finalUrl,
    statusCode: result.page.statusCode,
    contactCount: result.contacts.length,
    contacts: result.contacts,
    tech: result.tech,
    html: result.page.html,
  };
}
