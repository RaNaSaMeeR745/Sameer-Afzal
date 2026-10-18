import { eq } from "drizzle-orm";
import {
  balanceFromLedger,
  trySpendCredits,
  grantCredits,
  type CreditLedgerEntry,
} from "@scoutline/billing";
import type { Db } from "../client.js";
import { creditsLedger } from "../schema/tenant.js";

function rowToEntry(row: typeof creditsLedger.$inferSelect): CreditLedgerEntry {
  return {
    id: row.id,
    tenantId: row.tenantId,
    kind: row.kind as CreditLedgerEntry["kind"],
    delta: row.delta,
    reason: row.reason,
    eventId: row.eventId,
    createdAt: row.createdAt.toISOString(),
  };
}

/** Load full ledger for a tenant (append-only history). */
export async function listCreditEntries(
  db: Db,
  tenantId: string,
): Promise<CreditLedgerEntry[]> {
  const rows = await db
    .select()
    .from(creditsLedger)
    .where(eq(creditsLedger.tenantId, tenantId))
    .orderBy(creditsLedger.createdAt);
  return rows.map(rowToEntry);
}

export async function getCreditBalance(db: Db, tenantId: string): Promise<number> {
  const entries = await listCreditEntries(db, tenantId);
  return balanceFromLedger(entries);
}

/**
 * Append a grant if eventId is new. Returns duplicate_event without inserting twice.
 */
export async function persistGrant(
  db: Db,
  input: {
    tenantId: string;
    amount: number;
    reason: string;
    eventId: string;
  },
) {
  const existing = await listCreditEntries(db, input.tenantId);
  const decision = grantCredits({
    tenantId: input.tenantId,
    amount: input.amount,
    reason: input.reason,
    eventId: input.eventId,
    id: crypto.randomUUID(),
    existing,
  });
  if (!decision.ok || !decision.entry) {
    return { ok: false as const, reason: decision.reason, entry: null, balanceAfter: balanceFromLedger(existing) };
  }
  const [row] = await db
    .insert(creditsLedger)
    .values({
      id: decision.entry.id,
      tenantId: decision.entry.tenantId,
      kind: decision.entry.kind,
      delta: decision.entry.delta,
      reason: decision.entry.reason,
      eventId: decision.entry.eventId,
    })
    .returning();
  return {
    ok: true as const,
    reason: null,
    entry: rowToEntry(row),
    balanceAfter: balanceFromLedger([...existing, rowToEntry(row)]),
  };
}

/**
 * Append a spend if eventId is new and balance allows it.
 */
export async function persistSpend(
  db: Db,
  input: {
    tenantId: string;
    amount: number;
    reason: string;
    eventId: string;
    referenceId?: string | null;
  },
) {
  const existing = await listCreditEntries(db, input.tenantId);
  const decision = trySpendCredits({
    entries: existing,
    tenantId: input.tenantId,
    amount: input.amount,
    reason: input.reason,
    eventId: input.eventId,
    id: crypto.randomUUID(),
  });
  if (!decision.ok || !decision.entry) {
    return {
      ok: false as const,
      reason: decision.reason,
      entry: null,
      balanceAfter: decision.balanceAfter,
    };
  }
  const [row] = await db
    .insert(creditsLedger)
    .values({
      id: decision.entry.id,
      tenantId: decision.entry.tenantId,
      kind: decision.entry.kind,
      delta: decision.entry.delta,
      reason: decision.entry.reason,
      eventId: decision.entry.eventId,
      referenceId: input.referenceId ?? null,
    })
    .returning();
  return {
    ok: true as const,
    reason: null,
    entry: rowToEntry(row),
    balanceAfter: decision.balanceAfter,
  };
}
