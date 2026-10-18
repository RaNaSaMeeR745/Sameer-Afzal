import type { DiscoverInput, DiscoverResult, SourceCandidate } from "@scoutline/sources";
import { getSourceAdapter } from "../adapters.js";

export interface DiscoverJobPayload {
  tenantId: string;
  adapterId: string;
  input: DiscoverInput;
  serviceKey?: string | null;
  modeKeys?: string[];
  /** When true, caller should enqueue enrich jobs for each candidate with a domain. */
  enqueueEnrich?: boolean;
}

export interface DiscoverJobResult {
  tenantId: string;
  adapterId: string;
  candidates: SourceCandidate[];
  queryMeta: DiscoverResult["queryMeta"];
  serviceKey: string | null;
  modeKeys: string[];
}

/** Run a single source adapter discover call. */
export async function runDiscover(
  payload: DiscoverJobPayload,
): Promise<DiscoverJobResult> {
  const adapter = getSourceAdapter(payload.adapterId);
  const result = await adapter.discover(payload.input);
  return {
    tenantId: payload.tenantId,
    adapterId: payload.adapterId,
    candidates: result.candidates,
    queryMeta: result.queryMeta,
    serviceKey: payload.serviceKey ?? null,
    modeKeys: payload.modeKeys ?? [],
  };
}
