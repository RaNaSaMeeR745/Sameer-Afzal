# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 20

**Status:** done (docs through landing SEO)

## Phase 21: Public API

**Goal:** Authenticated leads list, health, Paddle webhook route.

**Tasks:**
- [x] API key hash + Bearer resolve helpers
- [x] GET /api/health
- [x] GET /api/v1/leads (empty page until DB writes)
- [x] POST /api/webhooks/paddle with signature verify
- [x] Update API.md, FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none for routes. Lead rows and credit ledger persistence still pending.

## Later phases

- Exclusivity claims
- Learning from outcomes
- 30-day validation (Phase 35)
