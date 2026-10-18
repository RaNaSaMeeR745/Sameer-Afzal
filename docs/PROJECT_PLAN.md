# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 23

**Status:** done (docs through outcome learning)

## Phase 24: DB persistence for pipeline writes

**Goal:** Repository layer for leads, claims, outcomes, and credit ledger.

**Tasks:**
- [x] credits_ledger: kind + unique event_id for idempotency
- [x] outcomes: score_breakdown snapshot column
- [x] upsertTenantLead / listTenantLeads
- [x] insertClaim / listActiveClaimsForEntity
- [x] insertOutcome / listOutcomeSamplesForTenant
- [x] persistGrant / persistSpend using @scoutline/billing pure logic
- [x] SQL migration 0002; export repos from package entry
- [x] Update FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none for repositories. API routes still need DATABASE_URL wiring to call these helpers in production requests.

## Later phases

- Wire API routes to repositories (leads list, claims, outcomes, paddle grants)
- 30-day validation (Phase 35)
