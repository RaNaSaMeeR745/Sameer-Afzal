# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 21

**Status:** done (docs through public API)

## Phase 22: Exclusivity claims

**Goal:** Claim logic so tenants can hold leads exclusively for a window.

**Tasks:**
- [x] tryCreateClaim with overlap rules (entity + niche + geography)
- [x] DEFAULT_CLAIM_TTL_MS (14 days)
- [x] applyClaimsToFreshness (foreign claim → contested)
- [x] Unit tests
- [x] POST /api/v1/claims
- [x] Update FILEMAP, HISTORY, PROJECT_PLAN, API.md

**Status:** done

**Blockers:** none for pure logic. Shared claims table persistence pending.

## Later phases

- Learning from outcomes
- 30-day validation (Phase 35)
