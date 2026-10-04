# FILEMAP.md - Complete File Inventory for Scoutline

## Repository Tree (high level)

```
.
├── AGENTS.md, README.md, package.json, pnpm-workspace.yaml, turbo.json, tsconfig.base.json
├── .env.example, .gitignore, .github/workflows/ci.yml
├── apps/web, apps/worker
├── packages/
│   ├── core/ (modes, services, types + tests)
│   ├── db/
│   │   ├── drizzle.config.ts
│   │   ├── drizzle/0001_rls_policies.sql
│   │   └── src/
│   │       ├── index.ts, client.ts
│   │       └── schema/ (global.ts, tenant.ts, index.ts)
│   ├── sources, enrich, audit, ai, billing
├── docs/ (full fixed set)
└── scripts/check-banned.ts
```

## File Table (Phase 3 additions and key paths)

| Path | Purpose | Module | Created (phase) | Last changed (phase) |
|------|---------|--------|-----------------|----------------------|
| packages/db/src/schema/global.ts | Global shared tables: entities, signals, contacts, audits, agency_credits | db | 3 | 3 |
| packages/db/src/schema/tenant.ts | All tenant-scoped tables with tenant_id | db | 3 | 3 |
| packages/db/src/schema/index.ts | Schema barrel export | db | 3 | 3 |
| packages/db/src/client.ts | createDb and setTenantContext for RLS | db | 3 | 3 |
| packages/db/src/index.ts | Package public exports | db | 1 | 3 |
| packages/db/drizzle.config.ts | Drizzle Kit configuration | db | 3 | 3 |
| packages/db/drizzle/0001_rls_policies.sql | RLS enable + isolation policies | db | 3 | 3 |
| packages/db/package.json | db package metadata, postgres, drizzle scripts | db | 1 | 3 |
| packages/core/src/modes.ts | B2B/B2C mode definitions | core | 2 | 2 |
| packages/core/src/services.ts | Service catalog | core | 2 | 2 |
| packages/core/src/types.ts | Domain types and Zod schemas | core | 2 | 2 |
| docs/HISTORY.md | Commit log | docs | 0 | 3 |
| docs/FILEMAP.md | File inventory | docs | 0 | 3 |
| docs/PROJECT_PLAN.md | Phased plan | docs | 0 | 3 |

Earlier Phase 0 and Phase 1 files remain as previously registered (AGENTS.md, README, all docs, monorepo root, apps, other packages).
