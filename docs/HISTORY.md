# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 | phase-1 through phase-12 | monorepo through scoring

Achieved: Sources, auth, db, scoring engine.

## 2026-10-04 | phase-13 | audit engine

Goal: Deterministic SEO, technical, and AEO findings from HTML snapshots.

Done:
- packages/audit/src/html.ts: title, meta, H1, canonical, viewport, JSON-LD, FAQPage helpers
- packages/audit/src/checks/seo.ts, technical.ts, aeo.ts
- packages/audit/src/run.ts: runAudit with optional serviceKeys filter
- Unit tests: bare HTTP page fails key checks; complete HTTPS page does not flag missing title/H1/FAQ
- Findings carry evidenceUrl and serviceKeys for scoreLead and proof reports

Achieved: Audit engine is pure (no network). Worker/enrich will fetch pages and pass snapshots in later phases.

Next: Worker and BullMQ pipeline, or proof report generation.
