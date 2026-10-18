# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 through 2026-10-18 | phase-1 through phase-25

Pipeline libraries, API, marketing, DB repos, API wiring.

## 2026-10-18 | phase-26 | worker score-and-persist

Goal: Write scored leads to Postgres from the worker.

Done:
- packages/db/src/repos/entities.ts: ensureEntity by domain
- packages/worker: QUEUE_NAMES, runScoreAndPersist, BullMQ score consumer
- Flow: ensure entity → apply claims to freshness → scoreLead → upsertTenantLead → optional persistSpend

Achieved: Deliverable leads can be persisted and billed one credit with idempotent event ids.

Next: 30-day validation plan, or remaining pipeline queue workers.
