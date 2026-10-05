import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyClaimsToFreshness,
  tryCreateClaim,
  type ExclusivityClaim,
} from "./claims.js";

const now = "2026-10-05T12:00:00.000Z";

describe("tryCreateClaim", () => {
  it("creates a claim when none exist", () => {
    const result = tryCreateClaim(
      {
        id: "c1",
        tenantId: "t1",
        entityId: "e1",
        now,
      },
      [],
    );
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.claim.tenantId, "t1");
      assert.ok(result.claim.expiresAt > now);
    }
  });

  it("rejects overlapping claim by another tenant", () => {
    const existing: ExclusivityClaim[] = [
      {
        id: "c0",
        tenantId: "t0",
        entityId: "e1",
        niche: null,
        geography: null,
        createdAt: now,
        expiresAt: "2026-10-20T12:00:00.000Z",
      },
    ];
    const result = tryCreateClaim(
      { id: "c1", tenantId: "t1", entityId: "e1", now },
      existing,
    );
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.reason, "already_claimed_by_other");
    }
  });

  it("allows non-overlapping niche scope", () => {
    const existing: ExclusivityClaim[] = [
      {
        id: "c0",
        tenantId: "t0",
        entityId: "e1",
        niche: "seo",
        geography: null,
        createdAt: now,
        expiresAt: "2026-10-20T12:00:00.000Z",
      },
    ];
    const result = tryCreateClaim(
      {
        id: "c1",
        tenantId: "t1",
        entityId: "e1",
        niche: "ppc",
        now,
      },
      existing,
    );
    assert.equal(result.ok, true);
  });
});

describe("applyClaimsToFreshness", () => {
  it("marks fresh as contested when foreign claim is active", () => {
    const claims: ExclusivityClaim[] = [
      {
        id: "c0",
        tenantId: "other",
        entityId: "e1",
        niche: null,
        geography: null,
        createdAt: now,
        expiresAt: "2026-10-20T12:00:00.000Z",
      },
    ];
    const freshness = applyClaimsToFreshness(
      "fresh",
      "e1",
      "viewer",
      claims,
      now,
    );
    assert.equal(freshness, "contested");
  });

  it("leaves served unchanged", () => {
    const freshness = applyClaimsToFreshness("served", "e1", "viewer", [], now);
    assert.equal(freshness, "served");
  });
});
