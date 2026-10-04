# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 18

**Status:** done (docs through Paddle billing core)

## Phase 19: Dashboard UI

**Goal:** Authenticated workspace shell for leads, searches, and billing.

**Tasks:**
- [x] Dashboard layout with session gate and nav
- [x] Overview with stats and onboarding steps
- [x] Leads table empty state (binds when persistence lands)
- [x] Searches page listing modes and service catalog from @scoutline/core
- [x] Billing page rendering PLANS from @scoutline/billing
- [x] Update FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none for UI shell. Live lead rows need DB write path from worker jobs.

## Later phases

- Landing pages and SEO content
- Public API
- Exclusivity claims
- Learning from outcomes
- 30-day validation (Phase 35)
