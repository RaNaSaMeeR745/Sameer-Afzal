/**
 * Append-only credit ledger helpers.
 * Never spend the same eventId twice. Balance is derived from the full ledger.
 */

export type CreditEntryKind = "grant" | "spend" | "adjustment" | "refund";

export interface CreditLedgerEntry {
  id: string;
  tenantId: string;
  kind: CreditEntryKind;
  /** Positive for grant/refund; negative for spend. */
  delta: number;
  reason: string;
  /** External idempotency key (Paddle event id, job id, etc.). */
  eventId: string;
  createdAt: string;
}

export function balanceFromLedger(
  entries: readonly CreditLedgerEntry[],
): number {
  return entries.reduce((sum, e) => sum + e.delta, 0);
}

export function hasEvent(
  entries: readonly CreditLedgerEntry[],
  eventId: string,
): boolean {
  return entries.some((e) => e.eventId === eventId);
}

export interface SpendResult {
  ok: boolean;
  reason: string | null;
  entry: CreditLedgerEntry | null;
  balanceAfter: number;
}

/**
 * Attempt to spend one or more credits.
 * Fails if eventId already present or balance would go negative.
 */
export function trySpendCredits(input: {
  entries: readonly CreditLedgerEntry[];
  tenantId: string;
  amount: number;
  reason: string;
  eventId: string;
  id: string;
  now?: string;
}): SpendResult {
  if (input.amount <= 0) {
    return {
      ok: false,
      reason: "amount_must_be_positive",
      entry: null,
      balanceAfter: balanceFromLedger(input.entries),
    };
  }
  if (hasEvent(input.entries, input.eventId)) {
    return {
      ok: false,
      reason: "duplicate_event",
      entry: null,
      balanceAfter: balanceFromLedger(input.entries),
    };
  }
  const balance = balanceFromLedger(input.entries);
  if (balance < input.amount) {
    return {
      ok: false,
      reason: "insufficient_credits",
      entry: null,
      balanceAfter: balance,
    };
  }
  const entry: CreditLedgerEntry = {
    id: input.id,
    tenantId: input.tenantId,
    kind: "spend",
    delta: -input.amount,
    reason: input.reason,
    eventId: input.eventId,
    createdAt: input.now ?? new Date().toISOString(),
  };
  return {
    ok: true,
    reason: null,
    entry,
    balanceAfter: balance - input.amount,
  };
}

export function grantCredits(input: {
  tenantId: string;
  amount: number;
  reason: string;
  eventId: string;
  id: string;
  existing: readonly CreditLedgerEntry[];
  now?: string;
}): { ok: boolean; reason: string | null; entry: CreditLedgerEntry | null } {
  if (input.amount <= 0) {
    return { ok: false, reason: "amount_must_be_positive", entry: null };
  }
  if (hasEvent(input.existing, input.eventId)) {
    return { ok: false, reason: "duplicate_event", entry: null };
  }
  return {
    ok: true,
    reason: null,
    entry: {
      id: input.id,
      tenantId: input.tenantId,
      kind: "grant",
      delta: input.amount,
      reason: input.reason,
      eventId: input.eventId,
      createdAt: input.now ?? new Date().toISOString(),
    },
  };
}
