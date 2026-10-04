import type { Job } from "bullmq";
import { buildProofReport, type AuditFinding, type ServiceKey } from "@scoutline/core";
import type { ProveJobData } from "../queues.js";

export interface ProveJobResult {
  tenantId: string;
  entityId: string;
  leadId: string;
  title: string;
  findingCount: number;
  score: number;
  html: string;
  generatedAt: string;
}

/** Prove job processor: builds a self-contained HTML proof report. */
export async function processProveJob(
  job: Job<ProveJobData>,
): Promise<ProveJobResult> {
  const data = job.data;
  await job.updateProgress(20);

  const findings: AuditFinding[] = data.findings.map((f) => ({
    code: f.code,
    severity: f.severity,
    title: f.title,
    detail: f.detail,
    evidenceUrl: f.evidenceUrl,
    serviceKeys: f.serviceKeys as ServiceKey[],
  }));

  const report = buildProofReport({
    entityName: data.entityName,
    entityDomain: data.entityDomain,
    entityUrl: data.entityUrl,
    serviceLabel: data.serviceLabel,
    freshnessClass: data.freshnessClass,
    score: data.score,
    breakdown: data.breakdown,
    findings,
    preparedBy: data.preparedBy ?? "Scoutline",
  });

  await job.updateProgress(100);

  return {
    tenantId: data.tenantId,
    entityId: data.entityId,
    leadId: data.leadId,
    title: report.title,
    findingCount: report.findingCount,
    score: report.score,
    html: report.html,
    generatedAt: report.generatedAt,
  };
}
