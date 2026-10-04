# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | a4994a5 | create AGENTS.md with non-negotiable agent rules

Goal: Bootstrap the agent rules document required by the project constitution.

Done: Wrote AGENTS.md containing the complete Part 1 rules (1.1 through 1.12) plus the phase start checklist.

Achieved: Mandatory rules file exists on main.

Files changed: AGENTS.md (added)

Next: Remaining documentation set.

## 2026-10-04 | phase-1 | multiple | monorepo skeleton and tooling

Goal: Establish pnpm workspaces + Turborepo + strict TypeScript baseline, CI, and banned-pattern check.

Done: Root package.json, pnpm-workspace, turbo, tsconfig.base, packages and apps skeletons, check-banned.ts, CI workflow, .env.example.

Achieved: Monorepo structure matches ARCHITECTURE.md.

Problems: Local install not fully verified (no lockfile yet).

Next: Phase 2.

## 2026-10-04 | phase-2 | multiple | core domain types and service catalog

Goal: Define TypeScript types and the service catalog in packages/core.

Done:
- packages/core/src/modes.ts: five modes with Zod enums and helpers
- packages/core/src/services.ts: full service catalog (33 services)
- packages/core/src/types.ts: Entity, Signal, Contact, ScoreBreakdown, TenantLead, and related Zod schemas
- Unit tests via node:test and tsx

Achieved: @scoutline/core exports validated domain types matching the product constitution.

Problems: Local pnpm install hit intermittent registry 502; tests not executed in agent environment.

Next: Phase 3.

## 2026-10-04 | phase-3 | multiple | database schema and Drizzle setup

Goal: packages/db with PostgreSQL 16 schema, RLS policies skeleton, migrations.

Done:
- packages/db/src/schema/global.ts: entities, entity_signals, entity_contacts, entity_audits, agency_credits
- packages/db/src/schema/tenant.ts: tenants, memberships, invitations, offer_profiles, searches, tenant_leads, proof_assets, messages, outcomes, claims, suppressions, credits_ledger, api_keys, webhooks, integrations, audit_log, subscriptions, billing_events
- packages/db/src/client.ts: createDb(connectionString), setTenantContext for RLS
- packages/db/drizzle.config.ts
- packages/db/drizzle/0001_rls_policies.sql: ENABLE ROW LEVEL SECURITY and isolation policies on every tenant table using app.current_tenant_id
- package.json: postgres dependency, db:generate, db:migrate, db:studio scripts

Achieved: Full data model from ARCHITECTURE.md is expressed in Drizzle. Tenant isolation is defined in SQL. Global business tables remain shared by design.

Problems: drizzle-kit generate was not run against a live DATABASE_URL in this environment. First migrate requires a real Postgres instance.

Next: Phase 4 (Auth foundation with Better Auth).
