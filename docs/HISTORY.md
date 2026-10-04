# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 | phase-1 through phase-13 | monorepo through audit engine

Achieved: Sources, scoring, audit, auth, db.

## 2026-10-04 | phase-14 | worker and BullMQ pipeline

Goal: Queue-backed lead pipeline workers.

Done:
- apps/worker/src/queues.ts: queue names (discover, enrich, audit, score, prove, message) and job payloads
- apps/worker/src/redis.ts: ioredis connection from REDIS_URL
- apps/worker/src/jobs/discover.ts: routes all nine source adapters; requires env keys where needed
- apps/worker/src/jobs/audit.ts and score.ts: call runAudit and scoreLead
- apps/worker/src/index.ts: Workers with retries, progress, graceful SIGINT/SIGTERM shutdown
- Unit tests for createAdapter routing

Achieved: Worker process can run discover, audit, and score jobs when Redis is available.

Problems: Candidate persistence to Postgres not yet wired. Enrich/prove/message workers are named but not implemented.

Next: Enrich job (page fetch) or proof report generation.
