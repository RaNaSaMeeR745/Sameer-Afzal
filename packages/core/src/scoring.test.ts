import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  deriveWeightsFromOutcomes,
  scoreLead,
  SCORE_CAPS,
} from "./scoring.js";
import type { AuditFinding, EntitySignal, ScoreBreakdown } from "./types.js";

const finding = (
  severity: AuditFinding["severity"],
  code = "seo_title",
): AuditFinding => ({
  code,
  severity,
  title: "Finding",
  detail: "Detail",
  evidenceUrl: "https://example.com/evidence",
  serviceKeys: [],
});

const signal = (type: string, daysAgo: number): EntitySignal => ({
  id: "00000000-0000-4000-8000-000000000001",
  entityId: "00000000-0000-4000-8000-000000000002",
  signalType: type,
  source: "test",
  evidenceUrl: "https://example.com/signal",
  observedAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  expiresAt: null,
  rawPayloadRef: null,
});

describe("scoreLead", () => {
  it("rejects when there is no evidence", () => {
    const result = scoreLead({
      findings: [],
      signals: [],
      contacts: [],
      agencyCredits: [],
      freshnessClass: "fresh",
    });
    assert.equal(result.rejected, true);
    assert.equal(result.rejectReason, "missing_evidence");
    assert.equal(result.score, 0);
  });

  it("scores need from finding severity", () => {
    const result = scoreLead({
      findings: [finding("critical"), finding("high")],
      signals: [signal("osm_local_business", 1)],
      contacts: [],
      agencyCredits: [],
      freshnessClass: "fresh",
    });
    assert.equal(result.rejected, false);
    assert.ok(result.breakdown.need <= SCORE_CAPS.need);
    assert.ok(result.breakdown.need >= 28);
    assert.ok(result.score > 0);
  });

  it("applies served penalty", () => {
    const base = scoreLead({
      findings: [finding("high")],
      signals: [signal("meta_active_ad", 1)],
      contacts: [],
      agencyCredits: [],
      freshnessClass: "fresh",
    });
    const served = scoreLead({
      findings: [finding("high")],
      signals: [signal("meta_active_ad", 1)],
      contacts: [],
      agencyCredits: [],
      freshnessClass: "served",
    });
    assert.ok(served.score < base.score);
    assert.ok(
      served.breakdown.notes.some((n) => n.toLowerCase().includes("served")),
    );
  });

  it("rewards verified reach", () => {
    const result = scoreLead({
      findings: [finding("medium")],
      signals: [signal("osm_local_business", 2)],
      contacts: [
        {
          id: "00000000-0000-4000-8000-000000000003",
          entityId: "00000000-0000-4000-8000-000000000002",
          email: "owner@example.com",
          phone: null,
          role: "owner",
          socials: {},
          verificationStatus: "verified",
          source: "site",
        },
      ],
      agencyCredits: [],
      freshnessClass: "fresh",
    });
    assert.equal(result.breakdown.reach, 10);
  });

  it("scores fit from ICP country match", () => {
    const result = scoreLead({
      findings: [finding("low")],
      signals: [signal("uk_new_or_existing_company", 5)],
      contacts: [],
      agencyCredits: [],
      freshnessClass: "fresh",
      entityCountry: "GB",
      icp: { countries: ["GB", "IE"] },
    });
    assert.ok(result.breakdown.fit >= 4);
  });
});

describe("deriveWeightsFromOutcomes", () => {
  it("returns null under 30 samples", () => {
    assert.equal(deriveWeightsFromOutcomes([]), null);
  });

  it("returns bounded weights with 30 samples", () => {
    const breakdown = (need: number): ScoreBreakdown => ({
      need,
      timing: 10,
      budget: 5,
      reach: 5,
      fit: 5,
      evidenceLinks: [],
      notes: [],
    });
    const samples = [
      ...Array.from({ length: 15 }, () => ({
        breakdown: breakdown(30),
        result: "won" as const,
      })),
      ...Array.from({ length: 15 }, () => ({
        breakdown: breakdown(5),
        result: "lost" as const,
      })),
    ];
    const weights = deriveWeightsFromOutcomes(samples);
    assert.ok(weights);
    assert.ok(weights.need >= 0.5 && weights.need <= 1.5);
  });
});
