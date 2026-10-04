# FILEMAP.md - Complete File Inventory for Scoutline

## Repository Tree (high level)

```
.
├── AGENTS.md, README.md, package.json, pnpm-workspace.yaml, turbo.json, tsconfig.base.json
├── .env.example, .gitignore, .github/workflows/ci.yml
├── apps/web/
│   ├── package.json
│   └── src/
│       ├── lib/auth.ts, auth-client.ts
│       └── app/
│           ├── api/auth/[...all]/route.ts
│           ├── sign-in, sign-up, two-factor, dashboard
│           ├── layout.tsx, page.tsx
├── apps/worker/
├── packages/
│   ├── core/ (modes, services, types + tests)
│   ├── db/
│   │   ├── drizzle.config.ts, drizzle/0001_rls_policies.sql
│   │   └── src/schema/ (global, tenant, auth, index), client.ts
│   ├── sources, enrich, audit, ai, billing
├── docs/
└── scripts/check-banned.ts
```

## Phase 4 file table

| Path | Purpose | Module | Created (phase) | Last changed (phase) |
|------|---------|--------|-----------------|----------------------|
| packages/db/src/schema/auth.ts | Better Auth user, session, account, verification, two_factor | db | 4 | 4 |
| packages/db/src/schema/index.ts | Schema barrel including auth tables | db | 3 | 4 |
| apps/web/src/lib/auth.ts | Better Auth server (email, OAuth, TOTP) | web | 4 | 4 |
| apps/web/src/lib/auth-client.ts | React auth client with twoFactorClient | web | 4 | 4 |
| apps/web/src/app/api/auth/[...all]/route.ts | Auth API catch-all handler | web | 4 | 4 |
| apps/web/src/app/sign-in/page.tsx | Sign-in form (email + social) | web | 4 | 4 |
| apps/web/src/app/sign-up/page.tsx | Sign-up form | web | 4 | 4 |
| apps/web/src/app/two-factor/page.tsx | TOTP verification | web | 4 | 4 |
| apps/web/src/app/dashboard/page.tsx | Session-gated dashboard shell | web | 4 | 4 |
| apps/web/package.json | Web deps including better-auth | web | 1 | 4 |
| docs/HISTORY.md | Commit log | docs | 0 | 4 |
| docs/FILEMAP.md | File inventory | docs | 0 | 4 |
| docs/PROJECT_PLAN.md | Phased plan | docs | 0 | 4 |

Earlier phases: packages/core domain types, packages/db global/tenant schema and RLS, monorepo tooling, fixed documentation set.
