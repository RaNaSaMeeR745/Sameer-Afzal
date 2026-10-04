# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0: Documentation bootstrap

**Status:** done

## Phase 1: Monorepo skeleton and tooling

**Status:** done

## Phase 2: Core domain types and service catalog

**Status:** done

## Phase 3: Database schema and Drizzle setup

**Goal:** packages/db with PostgreSQL 16 schema, RLS policies skeleton, migrations.

**Tasks:**
- [x] Drizzle schema for global tables (entities, signals, contacts, audits, agency_credits)
- [x] Drizzle schema for tenant tables (tenants, memberships, searches, tenant_leads, and related)
- [x] drizzle.config.ts and client helper
- [x] SQL migration for RLS policies on tenant tables
- [x] package.json scripts for generate/migrate
- [x] Update FILEMAP, HISTORY, PROJECT_PLAN

**Acceptance criteria:** All tables from ARCHITECTURE.md are defined in Drizzle. Every tenant table has tenant_id. RLS SQL enables isolation via app.current_tenant_id. createDb and setTenantContext are exported.

**Status:** done

**Blockers:** none (drizzle-kit generate against a live DATABASE_URL not run in agent environment; schema source is the source of truth until first migrate)

## Phase 4: Auth foundation (Better Auth)

**Status:** not started

## Phase 5-11: Data source adapters (one or two per phase)

**Status:** not started

## Phase 12: Scoring engine

**Status:** not started

## Phase 13: Audit engine integration

**Status:** not started

## Later phases

- Worker and BullMQ pipeline
- Proof report generation
- Messaging drafts
- Billing with Paddle
- Dashboard UI
- Landing pages and SEO content
- Public API
- Exclusivity claims
- Learning from outcomes
- 30-day validation (Phase 35)
