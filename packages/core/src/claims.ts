/**
 * Exclusivity claims: a tenant can claim an entity (optionally scoped by niche
 * and geography) for a time window so other tenants see it as contested or held.
 */

/** Default exclusivity window: 14 days. */
export const DEFAULT_CLAIM_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export interface ExclusivityClaim {
  id: string;
  tenantId: string;
  entityId: string;
  /** Optional service or niche scope (null = whole entity). */
  niche: string | null;
  /** Optional geography scope (null = any). */
  geography: string | null;
  createdAt: string;
  expiresAt: string;
}

export interface ClaimRequest {
  id: string;
  tenantId: string;
  entityId: string;
  niche?: string | null;
  geography?: string | null;
  /** ISO timestamp; defaults to now. */
  now?: string;
  /** TTL in ms; defaults to DEFAULT_CLAIM_TTL_MS. */
  ttlMs?: number;
}

export type ClaimDecision =
  | { ok: true; claim: ExclusivityClaim }
  | { ok: false; reason: "already_claimed_by_other" | "already_claimed_by_self" | "invalid_ttl" };

function parseTime(iso: string): number {
  return Date.parse(iso);
}

/** True if claim is still active at `nowIso`. */
export function isClaimActive(
  claim: ExclusivityClaim,
  nowIso: string,
): boolean {
  const now = parseTime(nowIso);
  const exp = parseTime(claim.expiresAt);
  return Number.isFinite(now) && Number.isFinite(exp) && now < exp;
}

/**
 * Two claims overlap if they target the same entity and their niche/geography
 * scopes are compatible (null matches any; equal strings match).
 */
export function claimsOverlap(
  a: Pick<ExclusivityClaim, "entityId" | "niche" | "geography">,
  b: Pick<ExclusivityClaim, "entityId" | "niche" | "geography">,
): boolean {
  if (a.entityId !== b.entityId) {
    return false;
  }
  const nicheOk =
    a.niche === null ||
    b.niche === null ||
    a.niche.toLowerCase() === b.niche.toLowerCase();
  const geoOk =
    a.geography === null ||
    b.geography === null ||
    a.geography.toLowerCase() === b.geography.toLowerCase();
  return nicheOk && geoOk;
}

/**
 * Attempt to create a claim given existing active claims for the entity.
 * Rejects if another tenant already holds an overlapping active claim.
 */
export function tryCreateClaim(
  request: ClaimRequest,
  existing: readonly ExclusivityClaim[],
): ClaimDecision {
  const ttl = request.ttlMs ?? DEFAULT_CLAIM_TTL_MS;
  if (ttl <= 0) {
    return { ok: false, reason: "invalid_ttl" };
  }

  const nowIso = request.now ?? new Date().toISOString();
  const nowMs = parseTime(nowIso);
  if (!Number.isFinite(nowMs)) {
    return { ok: false, reason: "invalid_ttl" };
  }

  const candidate: ExclusivityClaim = {
    id: request.id,
    tenantId: request.tenantId,
    entityId: request.entityId,
    niche: request.niche ?? null,
    geography: request.geography ?? null,
    createdAt: nowIso,
    expiresAt: new Date(nowMs + ttl).toISOString(),
  };

  for (const claim of existing) {
    if (!isClaimActive(claim, nowIso)) {
      continue;
    }
    if (!claimsOverlap(candidate, claim)) {
      continue;
    }
    if (claim.tenantId === request.tenantId) {
      return { ok: false, reason: "already_claimed_by_self" };
    }
    return { ok: false, reason: "already_claimed_by_other" };
  }

  return { ok: true, claim: candidate };
}

/**
 * Adjust freshness when another tenant holds an active overlapping claim.
 * - fresh + foreign claim → contested
 * - already contested/served unchanged by claims alone
 */
export function applyClaimsToFreshness(
  base: "fresh" | "contested" | "served",
  entityId: string,
  viewerTenantId: string,
  claims: readonly ExclusivityClaim[],
  nowIso: string,
  niche?: string | null,
  geography?: string | null,
): "fresh" | "contested" | "served" {
  if (base === "served") {
    return "served";
  }
  const probe = {
    entityId,
    niche: niche ?? null,
    geography: geography ?? null,
  };
  const foreignActive = claims.some(
    (c) =>
      isClaimActive(c, nowIso) &&
      claimsOverlap(probe, c) &&
      c.tenantId !== viewerTenantId,
  );
  if (foreignActive) {
    return "contested";
  }
  return base;
}

/** List active claims for an entity at a point in time. */
export function activeClaimsForEntity(
  entityId: string,
  claims: readonly ExclusivityClaim[],
  nowIso: string,
): ExclusivityClaim[] {
  return claims.filter(
    (c) => c.entityId === entityId && isClaimActive(c, nowIso),
  );
}
