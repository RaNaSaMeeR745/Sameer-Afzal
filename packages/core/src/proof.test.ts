import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildProofReport } from "./proof.js";

describe("buildProofReport", () => {
  it("renders entity name, score, and findings", () => {
    const report = buildProofReport({
      entityName: "Acme Dental <script>",
      entityDomain: "acme.example",
      entityUrl: "https://acme.example",
      serviceLabel: "SEO",
      freshnessClass: "fresh",
      score: 72,
      breakdown: {
        need: 30,
        timing: 20,
        budget: 10,
        reach: 7,
        fit: 5,
        evidenceLinks: ["https://acme.example"],
        notes: ["Need: 2 findings"],
      },
      findings: [
        {
          code: "seo_missing_title",
          severity: "high",
          title: "Missing document title",
          detail: "No title element.",
          evidenceUrl: "https://acme.example",
          serviceKeys: ["seo"],
        },
      ],
      preparedBy: "Scoutline",
    });

    assert.equal(report.score, 72);
    assert.equal(report.findingCount, 1);
    assert.match(report.html, /Acme Dental <script>/);
    assert.match(report.html, /Missing document title/);
    assert.match(report.html, /Need/);
    assert.ok(!report.html.includes("<script>"));
  });
});
