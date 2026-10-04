import type { AuditFinding } from "@scoutline/core";
import type { PageSnapshot } from "../run.js";
import { hasFaqSchema, hasJsonLd } from "../html.js";

export function runAeoChecks(page: PageSnapshot): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const evidence = page.url;

  if (!hasJsonLd(page.html)) {
    findings.push({
      code: "aeo_missing_jsonld",
      severity: "medium",
      title: "No JSON-LD structured data",
      detail: "No application/ld+json script found. Structured data helps search and AI systems understand the page.",
      evidenceUrl: evidence,
      serviceKeys: ["aeo_geo", "seo", "technical_seo"],
    });
  }

  if (!hasFaqSchema(page.html)) {
    findings.push({
      code: "aeo_missing_faq_schema",
      severity: "low",
      title: "No FAQPage schema",
      detail: "No FAQPage JSON-LD detected. FAQ blocks improve eligibility for rich results and AI answer extraction.",
      evidenceUrl: evidence,
      serviceKeys: ["aeo_geo", "seo", "content_marketing"],
    });
  }

  return findings;
}
