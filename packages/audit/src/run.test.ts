import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runAudit } from "./run.js";

describe("runAudit", () => {
  it("flags missing title, description, h1, https, and schema on a bare page",
    () => {
      const result = runAudit({
        url: "http://example.com/",
        html: "<html><body><p>Hello</p></body></html>",
        statusCode: 200,
      });

      const codes = result.findings.map((f) => f.code);
      assert.ok(codes.includes("seo_missing_title"));
      assert.ok(codes.includes("seo_missing_meta_description"));
      assert.ok(codes.includes("seo_missing_h1"));
      assert.ok(codes.includes("tech_no_https"));
      assert.ok(codes.includes("aeo_missing_jsonld"));
    },
  );

  it("does not flag title when present and reasonable",
    () => {
      const result = runAudit({
        url: "https://example.com/",
        html: `<!doctype html><html><head>
          <title>Acme Dental Clinic in Austin TX</title>
          <meta name="description" content="Family dental care in Austin with same-day appointments and transparent pricing for new patients.">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <link rel="canonical" href="https://example.com/">
          <script type="application/ld+json">{"@type":"FAQPage"}</script>
        </head><body><h1>Acme Dental</h1></body></html>`,
        statusCode: 200,
      });

      const codes = result.findings.map((f) => f.code);
      assert.ok(!codes.includes("seo_missing_title"));
      assert.ok(!codes.includes("tech_no_https"));
      assert.ok(!codes.includes("seo_missing_h1"));
      assert.ok(!codes.includes("aeo_missing_faq_schema"));
    },
  );

  it("filters findings by serviceKeys when requested",
    () => {
      const result = runAudit(
        {
          url: "http://example.com/",
          html: "<html><body></body></html>",
        },
        { serviceKeys: ["technical_seo"] },
      );
      assert.ok(result.findings.every((f) =>
        f.serviceKeys.length === 0 || f.serviceKeys.includes("technical_seo"),
      ));
    },
  );
});
