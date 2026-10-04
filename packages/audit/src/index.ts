export const PACKAGE_NAME = "@scoutline/audit" as const;

export { runAudit, type PageSnapshot, type AuditOptions, type AuditResult } from "./run.js";

export {
  extractTitle,
  extractMetaContent,
  hasCanonical,
  hasViewport,
  extractH1Texts,
  hasJsonLd,
  hasFaqSchema,
  robotsMetaContent,
  isHttpsUrl,
} from "./html.js";
