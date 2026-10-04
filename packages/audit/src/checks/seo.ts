import type { AuditFinding } from "@scoutline/core";
import type { PageSnapshot } from "../run.js";
import {
  extractH1Texts,
  extractMetaContent,
  extractTitle,
  hasCanonical,
} from "../html.js";

export function runSeoChecks(page: PageSnapshot): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const evidence = page.url;

  const title = extractTitle(page.html);
  if (!title) {
    findings.push({
      code: "seo_missing_title",
      severity: "high",
      title: "Missing document title",
      detail: "The page has no <title> element. Search engines and AI crawlers rely on titles for relevance.",
      evidenceUrl: evidence,
      serviceKeys: ["seo", "content_marketing", "copywriting"],
    });
  } else if (title.length < 10) {
    findings.push({
      code: "seo_title_too_short",
      severity: "medium",
      title: "Document title is too short",
      detail: `Title is only ${title.length} characters: "${title}". Aim for a descriptive title around 30 to 60 characters.`,
      evidenceUrl: evidence,
      serviceKeys: ["seo", "copywriting"],
    });
  } else if (title.length > 70) {
    findings.push({
      code: "seo_title_too_long",
      severity: "low",
      title: "Document title is very long",
      detail: `Title is ${title.length} characters and may be truncated in search results.`,
      evidenceUrl: evidence,
      serviceKeys: ["seo"],
    });
  }

  const description = extractMetaContent(page.html, "description");
  if (!description) {
    findings.push({
      code: "seo_missing_meta_description",
      severity: "medium",
      title: "Missing meta description",
      detail: "No meta name=description found. Snippets in search results may be uncontrolled.",
      evidenceUrl: evidence,
      serviceKeys: ["seo", "copywriting"],
    });
  } else if (description.length < 50) {
    findings.push({
      code: "seo_meta_description_short",
      severity: "low",
      title: "Meta description is short",
      detail: `Meta description is only ${description.length} characters.`,
      evidenceUrl: evidence,
      serviceKeys: ["seo"],
    });
  }

  if (!hasCanonical(page.html)) {
    findings.push({
      code: "seo_missing_canonical",
      severity: "medium",
      title: "Missing canonical link",
      detail: "No rel=canonical link found. Duplicate URL variants may dilute ranking signals.",
      evidenceUrl: evidence,
      serviceKeys: ["seo", "technical_seo"],
    });
  }

  const h1s = extractH1Texts(page.html);
  if (h1s.length === 0) {
    findings.push({
      code: "seo_missing_h1",
      severity: "medium",
      title: "Missing H1 heading",
      detail: "No H1 element found. Pages should have a clear primary heading.",
      evidenceUrl: evidence,
      serviceKeys: ["seo", "web_design", "copywriting"],
    });
  } else if (h1s.length > 1) {
    findings.push({
      code: "seo_multiple_h1",
      severity: "low",
      title: "Multiple H1 headings",
      detail: `Found ${h1s.length} H1 elements. Prefer a single primary H1 per page.`,
      evidenceUrl: evidence,
      serviceKeys: ["seo"],
    });
  }

  return findings;
}
