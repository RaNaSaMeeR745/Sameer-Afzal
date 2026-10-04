import type { Job } from "bullmq";
import { scoreLead, type AuditFinding, type EntitySignal, type EntityContact, type AgencyCredit } from "@scoutline/core";
import type { ScoreJobData } from "../queues.js";

/** Extended score job payload with evidence collected by prior jobs. */
export interface ScoreJobPayload extends ScoreJobData {
  findings?: AuditFinding[];
  signals?: EntitySignal[];
  contacts?: EntityContact[];
  agencyCredits?: AgencyCredit[];
}

export interface ScoreJobResult {
  tenantId: string;
  entityId: string;
  leadId: string;
  score: number;
  rejected: boolean;
  rejectReason: string | null;
  breakdown: ReturnType<typeof scoreLead>["breakdown"];
}

/** Score job processor: explainable scoreLead over findings and signals. */
export async function processScoreJob(
  job: Job<ScoreJobPayload>,
): Promise<ScoreJobResult> {
  const data = job.data;
  await job.updateProgress(20);

  const result = scoreLead({
    findings: data.findings ?? [],
    signals: data.signals ?? [],
    contacts: data.contacts ?? [],
    agencyCredits: data.agencyCredits ?? [],
    freshnessClass: data.freshnessClass,
    entityCountry: data.entityCountry,
    entityCategory: data.entityCategory,
  });

  await job.updateProgress(100);

  return {
    tenantId: data.tenantId,
    entityId: data.entityId,
    leadId: data.leadId,
    score: result.score,
    rejected: result.rejected,
    rejectReason: result.rejectReason,
    breakdown: result.breakdown,
  };
}
