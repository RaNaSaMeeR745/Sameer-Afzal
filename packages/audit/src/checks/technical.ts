import type { AuditFinding } from "@scoutline/core";
import type { PageSnapshot } from "../run.js";
import { hasViewport, isHttpsUrl, robotsMetaContent } from "../html.js";

export function runTechnicalChecks(page: PageSnapshot): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const evidence = page.url;

  if (!isHttpsUrl(page.url)) {
    findings.push({
      code: "tech_no_https",
      severity: "critical",
      title: "Page is not served over HTTPS",
      detail: "The URL does not use HTTPS. Browsers mark HTTP as not secure and ranking systems prefer HTTPS.",
      evidenceUrl: evidence,
      serviceKeys: ["technical_seo", "web_development"],
    });
  }

  if (page.statusCode !== undefined && page.statusCode >= 400) {
    findings.push({
      code: "tech_http_error",
      severity: page.statusCode >= 500 ? "critical" : "high",
      title: `HTTP status ${page.statusCode}`,
      detail: `The page returned HTTP ${page.statusCode}. Broken or error pages cannot convert or rank well.`,
      evidenceUrl: evidence,
      serviceKeys: ["web_development", "technical_seo"],
    });
  }

  if (!hasViewport(page.html)) {
    findings.push({
      code: "tech_missing_viewport",
      severity: "high",
      title: "Missing viewport meta tag",
      detail: "No viewport meta tag found. Mobile layout is likely broken or not optimized.",
      evidenceUrl: evidence,
      serviceKeys: ["web_design", "web_development", "conversion_rate_optimization"],
    });
  }

  const robots = robotsMetaContent(page.html);
  if (robots && /noindex/i.test(robots)) {
    findings.push({
      code: "tech_noindex",
      severity: "high",
      title: "Page is marked noindex",
      detail: `robots meta contains noindex ("${robots}"). Search engines are instructed not to index this page.`,
      evidenceUrl: evidence,
      serviceKeys: ["seo", "technical_seo"],
    });
  }

  return findings;
}
