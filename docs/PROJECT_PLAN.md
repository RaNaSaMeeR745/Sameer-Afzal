# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 13

**Status:** done (docs, monorepo, core, db, auth, sources, scoring, audit)

## Phase 14: Worker and BullMQ pipeline

**Goal:** Queue-backed discover, audit, and score workers.

**Tasks:**
- [x] Queue names and job payloads
- [x] Redis connection helper (REDIS_URL)
- [x] Discover processor with source adapter routing
- [x] Audit and score processors
- [x] Worker entry with graceful shutdown
- [x] bullmq + ioredis dependencies; adapter routing tests
- [x] Update FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none for code. Runtime requires Redis. DB persistence of candidates still pending a later phase.

## Later phases

- Enrich job and page fetch
- Proof report generation
- Messaging drafts
- Billing with Paddle
- Dashboard UI
- Landing pages and SEO content
- Public API
- Exclusivity claims
- Learning from outcomes
- 30-day validation (Phase 35)
