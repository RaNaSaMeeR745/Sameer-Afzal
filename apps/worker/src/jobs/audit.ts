import type { Job } from "bullmq";
import { runAudit } from "@scoutline/audit";
import type { ServiceKey } from "@scoutline/core";
import type { AuditJobData } from "../queues.js";

export interface AuditJobResult {
  tenantId: string;
  entityId: string;
  url: string;
  findingCount: number;
  findings: ReturnType<typeof runAudit>["findings"];
  checkedAt: string;
}

/** Audit job processor: runs pure runAudit on a page snapshot. */
export async function processAuditJob(
  job: Job<AuditJobData>,
): Promise<AuditJobResult> {
  const data = job.data;
  await job.updateProgress(20);

  const result = runAudit(
    {
      url: data.url,
      html: data.html,
      statusCode: data.statusCode,
    },
    {
      serviceKeys: data.serviceKeys as ServiceKey[] | undefined,
    },
  );

  await job.updateProgress(100);

  return {
    tenantId: data.tenantId,
    entityId: data.entityId,
    url: result.url,
    findingCount: result.findings.length,
    findings: result.findings,
    checkedAt: result.checkedAt,
  };
}
