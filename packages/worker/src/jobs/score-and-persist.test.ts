import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ScoreAndPersistPayload } from "./score-and-persist.js";

describe("score-and-persist payload shape", () => {
  it("accepts a minimal valid payload object", () => {
    const payload: ScoreAndPersistPayload = {
      tenantId: "00000000-0000-0000-0000-000000000001",
      entity: { canonicalName: "Acme Cafe", domain: "acme.example" },
      findings: [],
      signals: [
        {
          id: "s1",
          entityId: "e1",
          signalType: "osm_local_business",
          source: "overpass",
          evidenceUrl: "https://example.com",
          observedAt: new Date().toISOString(),
          expiresAt: null,
          rawPayloadRef: null,
        },
      ],
      contacts: [],
      agencyCredits: [],
      baseFreshness: "fresh",
      serviceKey: "seo",
      modeKeys: ["local_business"],
      spendCredit: false,
    };
    assert.equal(payload.entity.canonicalName, "Acme Cafe");
    assert.equal(payload.baseFreshness, "fresh");
  });
});
