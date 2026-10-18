# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 24

**Status:** done (docs through DB repositories)

## Phase 25: Wire API routes to repositories

**Goal:** Production paths use DATABASE_URL when configured.

**Tasks:**
- [x] apps/web/src/lib/db.ts getDb helper
- [x] GET /api/v1/leads → listTenantLeads
- [x] POST /api/v1/claims → listActiveClaimsForEntity + insertClaim
- [x] POST /api/v1/outcomes → insertOutcome + listOutcomeSamplesForTenant
- [x] POST /api/webhooks/paddle → persistGrant (custom_data.tenant_id + plan_key)
- [x] Document SCOUTLINE_API_KEYS in .env.example
- [x] Update API.md, FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none. Without DATABASE_URL, routes degrade safely (empty list or in-memory decision only).

## Later phases

- 30-day validation (Phase 35)
- Worker job that writes leads via upsertTenantLead
