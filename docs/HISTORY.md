# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 | phase-1 through phase-14 | monorepo through BullMQ workers

Achieved: Sources, scoring, audit, discover/audit/score workers.

## 2026-10-04 | phase-15 | enrich page fetch

Goal: Polite enrichment of entity domains.

Done:
- packages/enrich/src/fetch.ts: User-Agent, robots.txt evaluation, timeout, max body size, private host/IP refusal
- packages/enrich/src/contacts.ts: mailto, tel, and text email extraction with role local-parts
- packages/enrich/src/tech.ts: WordPress/Shopify/Wix/etc and GA/GTM/Meta pixel hints
- packages/enrich/src/enrich.ts: enrichEntity orchestrator
- apps/worker enrich job and worker registration
- Unit tests for robots rules, SSRF refusal, mock fetch, and contacts

Achieved: Discover → Enrich → Audit → Score path is implementable end to end in the worker.

Next: Proof report generation or messaging drafts.
