import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  balanceFromLedger,
  grantCredits,
  trySpendCredits,
  type CreditLedgerEntry,
} from "./credits.js";

describe("credit ledger", () => {
  it("grants and spends idempotently", () => {
    const grant = grantCredits({
      tenantId: "t1",
      amount: 25,
      reason: "trial",
      eventId: "grant_1",
      id: "e1",
      existing: [],
    });
    assert.ok(grant.ok && grant.entry);

    const entries: CreditLedgerEntry[] = [grant.entry];
    assert.equal(balanceFromLedger(entries), 25);

    const spend = trySpendCredits({
      entries,
      tenantId: "t1",
      amount: 1,
      reason: "lead",
      eventId: "spend_1",
      id: "e2",
    });
    assert.ok(spend.ok && spend.entry);
    assert.equal(spend.balanceAfter, 24);

    const dup = trySpendCredits({
      entries: [...entries, spend.entry!],
      tenantId: "t1",
      amount: 1,
      reason: "lead",
      eventId: "spend_1",
      id: "e3",
    });
    assert.equal(dup.ok, false);
    assert.equal(dup.reason, "duplicate_event");
  });

  it("rejects overspend", () => {
    const result = trySpendCredits({
      entries: [],
      tenantId: "t1",
      amount: 1,
      reason: "lead",
      eventId: "s1",
      id: "e1",
    });
    assert.equal(result.ok, false);
    assert.equal(result.reason, "insufficient_credits");
  });
});
