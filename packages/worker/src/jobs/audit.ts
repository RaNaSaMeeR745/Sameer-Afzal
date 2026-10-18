import { runAudit, type AuditResult } from "@scoutline/audit";
import type { ServiceKey } from "@scoutline/core";
import type { EnrichResult } from "@scoutline/enrich";
import type { SourceCandidate } from "@scoutline/sources";

export interface AuditJobPayload {
  tenantId: string;
  candidate: SourceCandidate;
  enrich: EnrichResult;
  serviceKey?: string | null;
  modeKeys?: string[];
}

export interface AuditJobResult {
  tenantId: string;
  candidate: SourceCandidate;
  enrich: EnrichResult;
  audit: AuditResult;
  serviceKey: string | null;
  modeKeys: string[];
}

/** Run pure HTML audits against an enriched page snapshot. */
export function runAuditJob(payload: AuditJobPayload): AuditJobResult {
  const serviceKeys = payload.serviceKey
    ? ([payload.serviceKey] as ServiceKey[])
    : undefined;

  const audit = runAudit(
    {
      url: payload.enrich.page.finalUrl ?? payload.enrich.page.url,
      html: payload.enrich.page.html,
      statusCode: payload.enrich.page.statusCode,
      headers: payload.enrich.page.headers,
    },
    { serviceKeys },
  );

  return {
    tenantId: payload.tenantId,
    candidate: payload.candidate,
    enrich: payload.enrich,
    audit,
    serviceKey: payload.serviceKey ?? null,
    modeKeys: payload.modeKeys ?? [],
  };
}
