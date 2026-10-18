import { enrichEntity, type EnrichResult } from "@scoutline/enrich";
import type { SourceCandidate } from "@scoutline/sources";

export interface EnrichJobPayload {
  tenantId: string;
  candidate: SourceCandidate;
  serviceKey?: string | null;
  modeKeys?: string[];
}

export interface EnrichJobResult {
  tenantId: string;
  candidate: SourceCandidate;
  enrich: EnrichResult | null;
  skippedReason: string | null;
  serviceKey: string | null;
  modeKeys: string[];
}

/** Fetch public site and extract contacts + tech for a candidate with a domain. */
export async function runEnrich(
  payload: EnrichJobPayload,
): Promise<EnrichJobResult> {
  const domain = payload.candidate.domain;
  if (!domain) {
    return {
      tenantId: payload.tenantId,
      candidate: payload.candidate,
      enrich: null,
      skippedReason: "missing_domain",
      serviceKey: payload.serviceKey ?? null,
      modeKeys: payload.modeKeys ?? [],
    };
  }

  const enrich = await enrichEntity({ domainOrUrl: domain });
  return {
    tenantId: payload.tenantId,
    candidate: payload.candidate,
    enrich,
    skippedReason: null,
    serviceKey: payload.serviceKey ?? null,
    modeKeys: payload.modeKeys ?? [],
  };
}
