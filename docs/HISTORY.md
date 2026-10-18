# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 through 2026-10-18 | phase-1 through phase-26

Pipeline libraries through score-and-persist.

## 2026-10-18 | phase-27 | pipeline queue workers

Goal: Full BullMQ chain from discovery to scored leads.

Done:
- packages/worker/src/adapters.ts: registry for all source adapters
- jobs: discover, enrich, audit, prove, message
- startWorkers: discover enqueues enrich; enrich enqueues audit; audit builds score payload and enqueues score
- prove and message workers ready for explicit enqueue

Achieved: Operator can enqueue a discover job and get scored tenant leads when Redis and DATABASE_URL are set.

Next: 30-day validation plan, or auto-enqueue prove/message after score.
