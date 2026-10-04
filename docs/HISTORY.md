# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | create AGENTS.md and fixed documentation set

Goal: Bootstrap agent rules and product documentation.

Achieved: Full fixed doc set on main.

Next: Phase 1.

## 2026-10-04 | phase-1 | monorepo skeleton and tooling

Goal: pnpm workspaces, Turborepo, TypeScript, CI, banned-pattern check.

Achieved: Monorepo structure matches ARCHITECTURE.md.

Next: Phase 2.

## 2026-10-04 | phase-2 | core domain types and service catalog

Goal: Types, modes, services in packages/core.

Achieved: @scoutline/core exports modes, services, Zod schemas, unit tests.

Next: Phase 3.

## 2026-10-04 | phase-3 | database schema and Drizzle setup

Goal: PostgreSQL schema, RLS, client helper.

Achieved: Global and tenant tables, createDb, setTenantContext, RLS SQL.

Next: Phase 4.

## 2026-10-04 | phase-4 | auth foundation with Better Auth

Goal: Email/password + OAuth + TOTP skeleton in apps/web.

Done:
- packages/db/src/schema/auth.ts: user, session, account, verification, two_factor tables
- apps/web/src/lib/auth.ts: betterAuth with drizzleAdapter, emailAndPassword, conditional Google/GitHub, twoFactor plugin, nextCookies
- apps/web/src/lib/auth-client.ts: createAuthClient with twoFactorClient (twoFactorPage /two-factor)
- apps/web/src/app/api/auth/[...all]/route.ts: toNextJsHandler
- Pages: /sign-in, /sign-up, /two-factor, /dashboard (session-gated)
- apps/web depends on better-auth and @scoutline/db
- Config verified against better-auth.com installation, Drizzle adapter, and 2FA plugin docs on 2026-10-04

Achieved: Auth foundation is in place. Email sign-up/sign-in, OAuth when credentials are set, TOTP challenge path, and a protected dashboard.

Problems: Not run end-to-end against a live Postgres instance in the agent environment. Auth tables must be migrated before first use. Email verification is intentionally off until a mail provider is configured.

Next: Phase 5 (first data source adapters).
