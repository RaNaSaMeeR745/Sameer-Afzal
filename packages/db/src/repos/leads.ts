import { and, desc, eq, sql } from "drizzle-orm";
import type { Db } from "../client.js";
import { tenantLeads } from "../schema/tenant.js";

export interface UpsertLeadInput {
  tenantId: string;
  entityId: string;
  score: number;
  scoreBreakdown: Record<string, unknown>;
  freshnessClass: "fresh" | "contested" | "served";
  status?: string;
  serviceKey?: string | null;
  modeKeys?: string[];
  notes?: string | null;
}

/** Insert or update a tenant lead keyed by (tenantId, entityId). */
export async function upsertTenantLead(db: Db, input: UpsertLeadInput) {
  const now = new Date();
  const [row] = await db
    .insert(tenantLeads)
    .values({
      tenantId: input.tenantId,
      entityId: input.entityId,
      score: input.score,
      scoreBreakdown: input.scoreBreakdown,
      freshnessClass: input.freshnessClass,
      status: input.status ?? "scored",
      serviceKey: input.serviceKey ?? null,
      modeKeys: input.modeKeys ?? [],
      notes: input.notes ?? null,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [tenantLeads.tenantId, tenantLeads.entityId],
      set: {
        score: input.score,
        scoreBreakdown: input.scoreBreakdown,
        freshnessClass: input.freshnessClass,
        status: input.status ?? "scored",
        serviceKey: input.serviceKey ?? null,
        modeKeys: input.modeKeys ?? [],
        notes: input.notes ?? null,
        updatedAt: now,
      },
    })
    .returning();
  return row;
}

export interface ListLeadsOptions {
  tenantId: string;
  page?: number;
  pageSize?: number;
  freshness?: "fresh" | "contested" | "served";
}

/** Paginated list of tenant leads, newest first. */
export async function listTenantLeads(db: Db, options: ListLeadsOptions) {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 20));
  const offset = (page - 1) * pageSize;

  const conditions = [eq(tenantLeads.tenantId, options.tenantId)];
  if (options.freshness) {
    conditions.push(eq(tenantLeads.freshnessClass, options.freshness));
  }

  const where = and(...conditions);

  const rows = await db
    .select()
    .from(tenantLeads)
    .where(where)
    .orderBy(desc(tenantLeads.score), desc(tenantLeads.updatedAt))
    .limit(pageSize)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(tenantLeads)
    .where(where);

  const total = countResult[0]?.count ?? 0;

  return {
    data: rows,
    pagination: { page, pageSize, total },
  };
}

/** Fetch one tenant lead by id. Returns null if missing or wrong tenant. */
export async function getTenantLeadById(
  db: Db,
  tenantId: string,
  leadId: string,
) {
  const rows = await db
    .select()
    .from(tenantLeads)
    .where(and(eq(tenantLeads.tenantId, tenantId), eq(tenantLeads.id, leadId)))
    .limit(1);
  return rows[0] ?? null;
}
