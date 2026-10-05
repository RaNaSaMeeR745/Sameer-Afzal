# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 22

**Status:** done (docs through exclusivity claims)

## Phase 23: Learning from outcomes

**Goal:** Per-tenant score weight learning after 30+ outcomes, explained in UI terms.

**Tasks:**
- [x] learnWeightsFromOutcomes wrapper with readiness and explanation
- [x] explainWeightDeltas for dashboard copy
- [x] Unit tests (below threshold / mixed wins-losses)
- [x] POST /api/v1/outcomes
- [x] Update FILEMAP, HISTORY, PROJECT_PLAN, API.md

**Status:** done

**Blockers:** none for pure learning. Durable outcome storage still pending.

## Later phases

- 30-day validation (Phase 35)
- DB persistence of leads, claims, outcomes, and credit ledger
