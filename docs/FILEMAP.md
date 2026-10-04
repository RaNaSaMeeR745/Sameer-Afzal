# FILEMAP.md - Complete File Inventory for Scoutline

## apps/worker (Phase 14)

| Path | Purpose |
|------|---------|
| apps/worker/src/queues.ts | Queue names and job payloads |
| apps/worker/src/redis.ts | Redis connection |
| apps/worker/src/jobs/discover.ts | Discover processor + adapter factory |
| apps/worker/src/jobs/audit.ts | Audit processor |
| apps/worker/src/jobs/score.ts | Score processor |
| apps/worker/src/jobs/discover.test.ts | Adapter routing tests |
| apps/worker/src/index.ts | Worker entrypoint |

## packages

- core: modes, services, types, scoring
- sources: nine adapters
- audit: runAudit checks
- db: schema + RLS
- apps/web: Better Auth
