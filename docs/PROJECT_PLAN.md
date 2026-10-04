# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 17

**Status:** done (docs through messaging drafts)

## Phase 18: Billing with Paddle

**Goal:** Plan catalog, idempotent credits, Paddle webhook signature verification.

**Tasks:**
- [x] PLANS matching STRATEGY (trial/starter/growth/agency)
- [x] Credit ledger grant/spend with duplicate event protection
- [x] verifyPaddleSignature (ts + raw body HMAC-SHA256)
- [x] parsePaddleEvent
- [x] Unit tests; update FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none for library code. HTTP webhook route and Paddle price ids wire in dashboard/API phase.

## Later phases

- Dashboard UI
- Landing pages and SEO content
- Public API
- Exclusivity claims
- Learning from outcomes
- 30-day validation (Phase 35)
