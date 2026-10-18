# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 26

**Status:** done (docs through worker score-and-persist)

## Phase 27: Pipeline queue workers

**Goal:** discover → enrich → audit → score chain with prove and message workers.

**Tasks:**
- [x] Adapter registry with canonical ids and aliases
- [x] runDiscover, runEnrich, runAuditJob, runProve, runMessage
- [x] BullMQ workers chaining discover→enrich→audit→score
- [x] Worker package deps on sources, enrich, audit, ai
- [x] Update FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none for queue processors. Prove/message are started but not auto-enqueued from score yet (callers add jobs when share tokens exist).

## Later phases

- 30-day validation (Phase 35)
- Auto-enqueue prove/message after successful score with share token persistence
