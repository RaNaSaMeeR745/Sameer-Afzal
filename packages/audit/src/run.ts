import type { AuditFinding, ServiceKey } from "@scoutline/core";
import { runSeoChecks } from "./checks/seo.js";
import { runTechnicalChecks } from "./checks/technical.js";
import { runAeoChecks } from "./checks/aeo.js";

export interface PageSnapshot {
  /** Final URL after redirects. */
  url: string;
  /** HTML document body (may be partial). */
  html: string;
  /** Optional HTTP status from the fetch. */
  statusCode?: number;
  /** Optional response headers (lowercase keys). */
  headers?: Record<string, string>;
}

export interface AuditOptions {
  /** Limit findings to those relevant to these services when set. */
  serviceKeys?: readonly ServiceKey[];
}

export interface AuditResult {
  url: string;
  findings: AuditFinding[];
  checkedAt: string;
}

/**
 * Run deterministic page audits against a fetched HTML snapshot.
 * Does not perform network I/O. Callers (worker/enrich) fetch the page first.
 * Findings include evidence URLs and serviceKeys for scoring and proof reports.
 */
export function runAudit(
  page: PageSnapshot,
  options: AuditOptions = {},
): AuditResult {
  const findings: AuditFinding[] = [
    ...runTechnicalChecks(page),
    ...runSeoChecks(page),
    ...runAeoChecks(page),
  ];

  const filtered = options.serviceKeys?.length
    ? findings.filter(
        (f) =>
          f.serviceKeys.length === 0 ||
          f.serviceKeys.some((k) => options.serviceKeys!.includes(k)),
      )
    : findings;

  return {
    url: page.url,
    findings: filtered,
    checkedAt: new Date().toISOString(),
  };
}
