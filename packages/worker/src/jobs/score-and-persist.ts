import {
  applyClaimsToFreshness,
  scoreLead,
  type AgencyCredit,
  type AuditFinding,
  type EntityContact,
  type EntitySignal,
  type ExclusivityClaim,
  type FreshnessClass,
  type IcpProfile,
  type ScoringWeights,
} from "@scoutline/core";
import {
  createDb,
  ensureEntity,
  listActiveClaimsForEntity,
  persistSpend,
  upsertTenantLead,
  type Db,
} from "@scoutline/db";

export interface ScoreAndPersistPayload {
  tenantId: string;
  entity: {
    canonicalName: string;
    domain?: string | null;
    country?: string | null;
    city?: string | null;
    category?: string | null;
    registryIds?: Record<string, string>;
  };
  findings: AuditFinding[];
  signals: EntitySignal[];
  contacts: EntityContact[];
  agencyCredits: AgencyCredit[];
  baseFreshness: FreshnessClass;
  serviceKey?: string | null;
  modeKeys?: string[];
  icp?: IcpProfile;
  weights?: ScoringWeights;
  /** When true, spend 1 credit on successful non-rejected deliverable lead. */
  spendCredit?: boolean;
  /** Idempotency key for credit spend (defaults to tenant+entity domain). */
  creditEventId?: string;
}

export interface ScoreAndPersistResult {
  rejected: boolean;
  rejectReason: string | null;
  score: number;
  freshnessClass: FreshnessClass;
  leadId: string | null;
  entityId: string | null;
  creditSpent: boolean;
  creditReason: string | null;
}

function getDbFromEnv(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required for score-and-persist jobs");
  }
  return createDb(url);
}

/**
 * Score a candidate, apply exclusivity claims to freshness, upsert tenant_leads,
 * and optionally spend one credit for a deliverable lead.
 */
export async function runScoreAndPersist(
  payload: ScoreAndPersistPayload,
  db: Db = getDbFromEnv(),
): Promise<ScoreAndPersistResult> {
  const entityRow = await ensureEntity(db, payload.entity);

  const claimRows = await listActiveClaimsForEntity(db, entityRow.id);
  const claims: ExclusivityClaim[] = claimRows.map((r) => ({
    id: r.id,
    tenantId: r.tenantId,
    entityId: r.entityId,
    niche: r.niche,
    geography: r.geography,
    createdAt: r.createdAt.toISOString(),
    expiresAt: r.expiresAt.toISOString(),
  }));

  const nowIso = new Date().toISOString();
  const freshnessClass = applyClaimsToFreshness(
    payload.baseFreshness,
    entityRow.id,
    payload.tenantId,
    claims,
    nowIso,
    payload.serviceKey ?? null,
    null,
  );

  const scored = scoreLead({
    findings: payload.findings,
    signals: payload.signals,
    contacts: payload.contacts,
    agencyCredits: payload.agencyCredits,
    freshnessClass,
    entityCountry: payload.entity.country,
    entityCategory: payload.entity.category,
    icp: payload.icp,
    weights: payload.weights,
  });

  if (scored.rejected) {
    return {
      rejected: true,
      rejectReason: scored.rejectReason,
      score: scored.score,
      freshnessClass,
      leadId: null,
      entityId: entityRow.id,
      creditSpent: false,
      creditReason: null,
    };
  }

  const lead = await upsertTenantLead(db, {
    tenantId: payload.tenantId,
    entityId: entityRow.id,
    score: scored.score,
    scoreBreakdown: scored.breakdown as unknown as Record<string, unknown>,
    freshnessClass,
    status: "scored",
    serviceKey: payload.serviceKey ?? null,
    modeKeys: payload.modeKeys ?? [],
  });

  let creditSpent = false;
  let creditReason: string | null = null;

  if (payload.spendCredit) {
    const eventId =
      payload.creditEventId ??
      `lead-deliver:${payload.tenantId}:${entityRow.id}`;
    const spend = await persistSpend(db, {
      tenantId: payload.tenantId,
      amount: 1,
      reason: `deliver_lead:${lead.id}`,
      eventId,
      referenceId: lead.id,
    });
    creditSpent = spend.ok;
    creditReason = spend.reason;
  }

  return {
    rejected: false,
    rejectReason: null,
    score: scored.score,
    freshnessClass,
    leadId: lead.id,
    entityId: entityRow.id,
    creditSpent,
    creditReason,
  };
}
