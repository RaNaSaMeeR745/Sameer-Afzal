# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 25

**Status:** done (docs through API DB wiring)

## Phase 26: Worker score-and-persist

**Goal:** Persist scored leads from the worker pipeline.

**Tasks:**
- [x] ensureEntity (domain match or insert)
- [x] runScoreAndPersist: score, claims freshness, upsertTenantLead, optional credit spend
- [x] packages/worker with BullMQ score queue consumer
- [x] QUEUE_NAMES for full pipeline
- [x] Update FILEMAP, HISTORY, PROJECT_PLAN, ARCHITECTURE note

**Status:** done

**Blockers:** none for score path. Discover/enrich/audit queue processors remain to be attached.

## Later phases

- 30-day validation (Phase 35)
- Remaining queue workers (discover, enrich, audit, prove, message)
