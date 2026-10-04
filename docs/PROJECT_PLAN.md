# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0: Documentation bootstrap

**Goal:** Create the fixed documentation set required by the constitution so every later phase has a source of truth.

**Tasks:**
- [x] Write AGENTS.md with the complete non-negotiable rules
- [x] Create docs/HISTORY.md and record the first commits
- [x] Create docs/FILEMAP.md and register every file
- [x] Create README.md with full product description
- [x] Create docs/ARCHITECTURE.md (stack, data model, pipeline)
- [x] Create docs/SECURITY.md (threat model outline)
- [x] Create docs/DATA_SOURCES.md (registry of sources, status pending verification)
- [x] Create docs/API.md (placeholder for future public API)
- [x] Create docs/STRATEGY.md (competitor analysis, positioning, pricing logic, keyword map)
- [x] Create docs/SEO_AEO.md (initial SEO/AEO specification)
- [x] Create docs/BACKLINKS.md (empty tracker ready for assets)
- [x] Create docs/DECISIONS.md (record stack and pricing decisions)
- [x] Update FILEMAP and HISTORY for every file
- [x] Tag phase-0-done when complete

**Acceptance criteria:** All fixed docs exist, FILEMAP lists them, HISTORY has an entry for each commit, no em dashes, no placeholders that violate the banned list.

**Status:** done

**Blockers:** none

## Phase 1: Monorepo skeleton and tooling

**Goal:** Establish pnpm workspaces + Turborepo + strict TypeScript baseline, CI lint/typecheck skeleton, and banned-pattern check.

**Tasks:**
- [x] Root package.json, pnpm-workspace.yaml, turbo.json
- [x] packages/core, packages/db, packages/sources, packages/enrich, packages/audit, packages/ai, packages/billing placeholders with package.json only (no stubs)
- [x] apps/web and apps/worker package.json
- [x] Strict tsconfig base and per-package configs
- [x] scripts/check-banned.ts (grep for TODO, FIXME, em dash, lorem, etc.)
- [x] GitHub Actions workflow for lint, typecheck, banned check
- [x] .env.example with variable names only
- [x] Update all docs

**Acceptance criteria:** Monorepo installs with pnpm, check-banned runs, typecheck paths exist, CI workflow present, FILEMAP and HISTORY updated. Hosting provider choice remains pending (recorded in DECISIONS).

**Status:** done

**Blockers:** none (hosting decision deferred to a short follow-up once pricing pages are re-read; does not block Phase 2)

## Phase 2: Core domain types and service catalog

**Goal:** Define TypeScript types and the service catalog in packages/core.

**Tasks:**
- [ ] packages/core/src/types.ts (Entity, Signal, Contact, Lead, ScoreBreakdown, etc.)
- [ ] packages/core/src/services.ts (full service catalog from the product spec)
- [ ] packages/core/src/modes.ts (B2B/B2C modes)
- [ ] Zod schemas for validation
- [ ] Unit tests for pure helpers

**Status:** in progress

**Blockers:** none

## Phase 3: Database schema and Drizzle setup

**Goal:** packages/db with PostgreSQL 16 schema, RLS policies skeleton, migrations.

**Status:** not started

## Phase 4: Auth foundation (Better Auth)

**Goal:** Email/password + OAuth + TOTP skeleton in apps/web.

**Status:** not started

## Phase 5-11: Data source adapters (one or two per phase)

**Goal:** Implement and verify each free source adapter, record findings in DATA_SOURCES.md.

**Status:** not started

## Phase 12: Scoring engine

**Goal:** Explainable scoring config and pure functions in packages/core.

**Status:** not started

## Phase 13: Audit engine integration

**Goal:** Integrate existing AEO/SEO report engine into packages/audit (request code from owner).

**Status:** not started

## Later phases (to be expanded as prior phases complete)

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

**Note:** Exact sub-phase splits will be written when the preceding phase is done, keeping each under 20 minutes.
