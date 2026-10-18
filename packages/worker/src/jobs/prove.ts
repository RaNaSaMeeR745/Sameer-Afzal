import {
  buildProofReport,
  type AuditFinding,
  type ProofReport,
  type ScoreBreakdown,
} from "@scoutline/core";

export interface ProveJobPayload {
  tenantId: string;
  leadId: string;
  entityName: string;
  entityDomain: string | null;
  entityUrl: string | null;
  serviceLabel: string | null;
  freshnessClass: "fresh" | "contested" | "served";
  score: number;
  breakdown: ScoreBreakdown;
  findings: AuditFinding[];
  preparedBy?: string;
}

export interface ProveJobResult {
  tenantId: string;
  leadId: string;
  report: ProofReport;
}

/** Build an HTML proof report for a scored lead. */
export function runProve(payload: ProveJobPayload): ProveJobResult {
  const report = buildProofReport({
    entityName: payload.entityName,
    entityDomain: payload.entityDomain,
    entityUrl: payload.entityUrl,
    serviceLabel: payload.serviceLabel,
    freshnessClass: payload.freshnessClass,
    score: payload.score,
    breakdown: payload.breakdown,
    findings: payload.findings,
    preparedBy: payload.preparedBy ?? "Scoutline",
  });

  return {
    tenantId: payload.tenantId,
    leadId: payload.leadId,
    report,
  };
}
