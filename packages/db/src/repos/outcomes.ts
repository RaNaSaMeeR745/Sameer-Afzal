import { desc, eq } from "drizzle-orm";
import type { Db } from "../client.js";
import { outcomes, tenantLeads } from "../schema/tenant.js";

export interface InsertOutcomeInput {
  tenantId: string;
  leadId: string;
  result: "replied" | "call_booked" | "won" | "lost";
  reason?: string | null;
  scoreBreakdown?: Record<string, unknown>;
}

/** Append an outcome row for learning. */
export async function insertOutcome(db: Db, input: InsertOutcomeInput) {
  const [row] = await db
    .insert(outcomes)
    .values({
      tenantId: input.tenantId,
      leadId: input.leadId,
      result: input.result,
      reason: input.reason ?? null,
      scoreBreakdown: input.scoreBreakdown ?? {},
    })
    .returning();
  return row;
}

/**
 * Load outcome samples for weight learning.
 * Joins lead score breakdown when outcome snapshot is empty.
 */
export async function listOutcomeSamplesForTenant(
  db: Db,
  tenantId: string,
  limit = 500,
) {
  const rows = await db
    .select({
      result: outcomes.result,
      outcomeBreakdown: outcomes.scoreBreakdown,
      leadBreakdown: tenantLeads.scoreBreakdown,
    })
    .from(outcomes)
    .innerJoin(tenantLeads, eq(outcomes.leadId, tenantLeads.id))
    .where(eq(outcomes.tenantId, tenantId))
    .orderBy(desc(outcomes.recordedAt))
    .limit(limit);

  return rows.map((r) => {
    const fromOutcome =
      r.outcomeBreakdown && Object.keys(r.outcomeBreakdown).length > 0
        ? r.outcomeBreakdown
        : r.leadBreakdown;
    return {
      result: r.result as "replied" | "call_booked" | "won" | "lost",
      breakdown: fromOutcome as Record<string, unknown>,
    };
  });
}
