import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ScoreBreakdownSchema,
  totalScore,
  EntitySchema,
  SearchConfigSchema,
} from "./types.js";

describe("types and scoring helpers", () => {
  it("totalScore sums the five components", () => {
    const breakdown = ScoreBreakdownSchema.parse({
      need: 30,
      timing: 20,
      budget: 10,
      reach: 8,
      fit: 7,
      evidenceLinks: [],
      notes: [],
    });
    assert.equal(totalScore(breakdown), 75);
  });

  it("ScoreBreakdownSchema rejects need above 40", () => {
    const result = ScoreBreakdownSchema.safeParse({
      need: 41,
      timing: 0,
      budget: 0,
      reach: 0,
      fit: 0,
    });
    assert.equal(result.success, false);
  });

  it("EntitySchema requires canonicalName", () => {
    const result = EntitySchema.safeParse({
      id: "00000000-0000-4000-8000-000000000001",
      canonicalName: "",
      domain: null,
      country: null,
      city: null,
      category: null,
      registryIds: {},
      createdAt: "2026-10-04T12:00:00.000Z",
      updatedAt: "2026-10-04T12:00:00.000Z",
    });
    assert.equal(result.success, false);
  });

  it("SearchConfigSchema accepts a valid search config", () => {
    const result = SearchConfigSchema.safeParse({
      id: "00000000-0000-4000-8000-000000000002",
      tenantId: "00000000-0000-4000-8000-000000000003",
      name: "UK clinics local SEO",
      leadType: "B2C",
      modes: ["local_business"],
      geography: "GB",
      niche: "clinics",
      serviceKey: "local_seo",
      createdAt: "2026-10-04T12:00:00.000Z",
    });
    assert.equal(result.success, true);
  });
});
