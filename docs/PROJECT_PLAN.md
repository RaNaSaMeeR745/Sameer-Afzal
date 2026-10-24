# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 28

**Status:** done (docs through proof share tokens and full pipeline chain)

## Phase 35: 30-day validation plan

**Status:** done (plan written). Execution is an operator activity.

## Phase 36: API rate limits and lead detail

**Goal:** Protect authenticated API routes and expose a single-lead read.

**Tasks:**
- [x] Fixed-window rate limiter (60/min per tenant)
- [x] Apply to leads list, lead detail, claims, outcomes
- [x] getTenantLeadById repository
- [x] GET /api/v1/leads/:id
- [x] Update API.md, FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none. Limiter is per-process; Redis-shared counters remain optional later.

## Later engineering

- POST /api/v1/searches (saved discovery configs)
- Object storage for proof assets
- Redis-backed rate limits for multi-instance web
- Penetration test before public launch (SECURITY.md)
