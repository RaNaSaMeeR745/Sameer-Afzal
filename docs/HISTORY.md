# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 through 2026-10-05 | phase-1 through phase-23

Pipeline through outcome learning.

## 2026-10-18 | phase-24 | DB persistence repositories

Goal: Durable writes for leads, claims, outcomes, and credits.

Done:
- Schema: credits_ledger.kind, credits_ledger.event_id (unique), outcomes.score_breakdown
- packages/db/src/repos/leads.ts: upsertTenantLead, listTenantLeads
- packages/db/src/repos/claims.ts: insertClaim, listActiveClaimsForEntity
- packages/db/src/repos/outcomes.ts: insertOutcome, listOutcomeSamplesForTenant
- packages/db/src/repos/credits.ts: listCreditEntries, persistGrant, persistSpend (idempotent via eventId)
- drizzle/0002_credits_outcomes_columns.sql migration

Achieved: Worker and API can persist pipeline results when DATABASE_URL is configured.

Next: Wire API routes to repositories, or document 30-day validation plan.
