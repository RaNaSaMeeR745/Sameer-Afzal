import type { AuditFinding, ScoreBreakdown } from "./types.js";
import { totalScore } from "./types.js";

export interface ProofReportInput {
  entityName: string;
  entityDomain: string | null;
  entityUrl: string | null;
  serviceLabel: string | null;
  freshnessClass: "fresh" | "contested" | "served";
  score: number;
  breakdown: ScoreBreakdown;
  findings: readonly AuditFinding[];
  generatedAt?: string;
  /** Agency or product name shown in the footer. */
  preparedBy?: string;
}

export interface ProofReport {
  html: string;
  title: string;
  findingCount: number;
  score: number;
  generatedAt: string;
}

/**
 * Build a self-contained HTML proof report from audit findings and score.
 * Safe for email attach or share-link rendering. Escapes all user-derived text.
 */
export function buildProofReport(input: ProofReportInput): ProofReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const title = `Proof report: ${input.entityName}`;
  const sorted = [...input.findings].sort(
    (a, b) => severityRank(b.severity) - severityRank(a.severity),
  );

  const findingsHtml =
    sorted.length === 0
      ? `<p class="muted">No audit findings were recorded for this lead.</p>`
      : `<ol class="findings">${sorted
          .map(
            (f) => `
    <li class="finding severity-${escapeAttr(f.severity)}">
      <div class="finding-title"><span class="badge">${escapeHtml(f.severity)}</span> ${escapeHtml(f.title)}</div>
      <p class="detail">${escapeHtml(f.detail)}</p>
      ${f.evidenceUrl ? `<p class="evidence"><a href="${escapeAttr(f.evidenceUrl)}">${escapeHtml(f.evidenceUrl)}</a></p>` : ""}
      ${f.serviceKeys.length ? `<p class="services">Services: ${escapeHtml(f.serviceKeys.join(", "))}</p>` : ""}
    </li>`,
          )
          .join("")}</ol>`;

  const notesHtml =
    input.breakdown.notes.length === 0
      ? ""
      : `<ul class="notes">${input.breakdown.notes.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light; --bg: #f8fafc; --card: #fff; --text: #0f172a; --muted: #64748b; --border: #e2e8f0; --accent: #0ea5e9; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; }
    main { max-width: 720px; margin: 0 auto; padding: 2rem 1.25rem 3rem; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; }
    h1 { font-size: 1.5rem; margin: 0 0 0.25rem; }
    h2 { font-size: 1.1rem; margin: 0 0 0.75rem; }
    .muted { color: var(--muted); font-size: 0.9rem; }
    .score { font-size: 2rem; font-weight: 700; color: var(--accent); }
    .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; text-align: center; }
    .grid div { background: var(--bg); border-radius: 8px; padding: 0.5rem; }
    .grid span { display: block; font-size: 0.7rem; color: var(--muted); text-transform: uppercase; }
    .badge { display: inline-block; font-size: 0.7rem; text-transform: uppercase; padding: 0.1rem 0.4rem; border-radius: 4px; background: #e2e8f0; margin-right: 0.35rem; }
    .severity-critical .badge { background: #fecaca; }
    .severity-high .badge { background: #fed7aa; }
    .severity-medium .badge { background: #fde68a; }
    .severity-low .badge { background: #e2e8f0; }
    .findings { padding-left: 1.1rem; }
    .finding { margin-bottom: 0.85rem; }
    .finding-title { font-weight: 600; }
    .detail, .evidence, .services { margin: 0.25rem 0; font-size: 0.92rem; }
    a { color: var(--accent); }
    footer { margin-top: 1.5rem; font-size: 0.8rem; color: var(--muted); }
  </style>
</head>
<body>
  <main>
    <header class="card">
      <h1>${escapeHtml(input.entityName)}</h1>
      <p class="muted">
        ${input.entityDomain ? escapeHtml(input.entityDomain) : "No domain"}
        ${input.entityUrl ? ` · <a href="${escapeAttr(input.entityUrl)}">Open site</a>` : ""}
        ${input.serviceLabel ? ` · Service focus: ${escapeHtml(input.serviceLabel)}` : ""}
        · Freshness: ${escapeHtml(input.freshnessClass)}
      </p>
      <p class="score">${Math.round(input.score)} <span class="muted" style="font-size:0.9rem;font-weight:500">/ 100</span></p>
    </header>

    <section class="card">
      <h2>Score breakdown</h2>
      <div class="grid">
        <div><strong>${input.breakdown.need}</strong><span>Need</span></div>
        <div><strong>${input.breakdown.timing}</strong><span>Timing</span></div>
        <div><strong>${input.breakdown.budget}</strong><span>Budget</span></div>
        <div><strong>${input.breakdown.reach}</strong><span>Reach</span></div>
        <div><strong>${input.breakdown.fit}</strong><span>Fit</span></div>
      </div>
      ${notesHtml}
      <p class="muted" style="margin-top:0.75rem">Total components: ${totalScore(input.breakdown)}</p>
    </section>

    <section class="card">
      <h2>Verified findings (${sorted.length})</h2>
      ${findingsHtml}
    </section>

    <footer>
      Generated ${escapeHtml(generatedAt)}
      ${input.preparedBy ? ` · Prepared with ${escapeHtml(input.preparedBy)}` : ""}.
      Evidence links point at public sources. Scores are explainable and reproducible from the findings above.
    </footer>
  </main>
</body>
</html>`;

  return {
    html,
    title,
    findingCount: sorted.length,
    score: input.score,
    generatedAt,
  };
}

function severityRank(
  severity: AuditFinding["severity"],
): number {
  switch (severity) {
    case "critical":
      return 5;
    case "high":
      return 4;
    case "medium":
      return 3;
    case "low":
      return 2;
    default:
      return 1;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, """);
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
