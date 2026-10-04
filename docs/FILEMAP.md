# FILEMAP.md - Complete File Inventory for Scoutline

## Repository Tree (high level)

```
.
├── AGENTS.md, README.md, package.json, pnpm-workspace.yaml, turbo.json
├── apps/web (auth, sign-in/up, dashboard), apps/worker
├── packages/
│   ├── core/ (modes, services, types)
│   ├── db/ (schema global/tenant/auth, client, RLS)
│   ├── sources/
│   │   └── src/ types.ts, overpass.ts, overpass.test.ts, index.ts
│   ├── enrich, audit, ai, billing
├── docs/
└── scripts/check-banned.ts
```

## Phase 5 file table

| Path | Purpose | Module | Created (phase) | Last changed (phase) |
|------|---------|--------|-----------------|----------------------|
| packages/sources/src/types.ts | SourceAdapter interface and SourceCandidate schema | sources | 5 | 5 |
| packages/sources/src/overpass.ts | OpenStreetMap Overpass adapter | sources | 5 | 5 |
| packages/sources/src/overpass.test.ts | Unit tests for Overpass | sources | 5 | 5 |
| packages/sources/src/index.ts | Package exports | sources | 1 | 5 |
| packages/sources/package.json | zod, tsx test script | sources | 1 | 5 |
| docs/DATA_SOURCES.md | Source registry with Overpass implemented | docs | 0 | 5 |
| docs/HISTORY.md | Commit log | docs | 0 | 5 |
| docs/FILEMAP.md | File inventory | docs | 0 | 5 |
| docs/PROJECT_PLAN.md | Phased plan | docs | 0 | 5 |

Earlier phases: auth foundation, db schema, core domain types, monorepo, documentation set.
