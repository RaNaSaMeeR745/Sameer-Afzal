# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 11

**Status:** done (docs, monorepo, core, db, auth, all primary source adapters)

## Phase 12: Scoring engine

**Goal:** Explainable 0-100 score with Need, Timing, Budget, Reach, Fit and evidence notes.

**Tasks:**
- [x] scoreLead pure function with caps matching ScoreBreakdownSchema
- [x] Missing evidence rejects (not delivered)
- [x] Served and contested penalties
- [x] deriveWeightsFromOutcomes (requires 30+ samples, weights bounded 0.5-1.5)
- [x] Unit tests
- [x] Export from @scoutline/core; update FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none

## Phase 13: Audit engine integration

**Status:** not started

## Later phases

- Worker and BullMQ pipeline
- Proof report generation
- Messaging drafts
- Billing with Paddle
- Dashboard UI
- Landing pages and SEO content
- Public API
- Exclusivity claims
- Learning from outcomes
- 30-day validation (Phase 35)
