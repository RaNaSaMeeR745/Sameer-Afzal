# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0: Documentation bootstrap

**Status:** done

## Phase 1: Monorepo skeleton and tooling

**Status:** done

## Phase 2: Core domain types and service catalog

**Status:** done

## Phase 3: Database schema and Drizzle setup

**Status:** done

## Phase 4: Auth foundation (Better Auth)

**Goal:** Email/password + OAuth + TOTP skeleton in apps/web.

**Tasks:**
- [x] Auth server config (email/password, Google, GitHub, twoFactor plugin)
- [x] Drizzle adapter wiring to packages/db
- [x] Auth table schema for Better Auth core + twoFactor
- [x] Next.js API route /api/auth/[...all]
- [x] Auth client (better-auth/react)
- [x] Minimal sign-in, sign-up, two-factor, and dashboard pages
- [x] Update package.json, FILEMAP, HISTORY, PROJECT_PLAN

**Acceptance criteria:** Auth server exports email/password and conditional OAuth. TOTP plugin registered. API route mounted. Sign-in and sign-up work against the handler when DATABASE_URL and secrets are set. Dashboard requires a session.

**Status:** done

**Blockers:** none (runtime requires DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL; OAuth requires provider credentials; auth tables must be migrated before first sign-up)

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
