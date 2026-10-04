# FILEMAP.md - Complete File Inventory for Scoutline

## Repository Tree (high level)

```
.
├── apps/web (auth, sign-in/up, dashboard), apps/worker
├── packages/
│   ├── core/, db/
│   ├── sources/
│   │   └── src/
│   │       ├── types.ts
│   │       ├── overpass.ts, overpass.test.ts
│   │       ├── companies-house.ts, companies-house.test.ts
│   │       ├── edgar.ts, edgar.test.ts
│   │       └── index.ts
│   ├── enrich, audit, ai, billing
├── docs/, scripts/
```

## Phase 6 file table

| Path | Purpose | Module | Created (phase) | Last changed (phase) |
|------|---------|--------|-----------------|----------------------|
| packages/sources/src/companies-house.ts | UK Companies House adapter | sources | 6 | 6 |
| packages/sources/src/companies-house.test.ts | Unit tests | sources | 6 | 6 |
| packages/sources/src/edgar.ts | SEC EDGAR full-text search adapter | sources | 6 | 6 |
| packages/sources/src/edgar.test.ts | Unit tests | sources | 6 | 6 |
| packages/sources/src/types.ts | DiscoverInput supports registry search | sources | 5 | 6 |
| packages/sources/src/overpass.ts | bbox required check after types change | sources | 5 | 6 |
| packages/sources/src/index.ts | Export CH and EDGAR adapters | sources | 1 | 6 |
| .env.example | COMPANIES_HOUSE_API_KEY name | root | 1 | 6 |
| docs/DATA_SOURCES.md | CH and EDGAR implemented | docs | 0 | 6 |
| docs/HISTORY.md | Commit log | docs | 0 | 6 |
| docs/FILEMAP.md | File inventory | docs | 0 | 6 |
| docs/PROJECT_PLAN.md | Phased plan | docs | 0 | 6 |

Earlier phases: Overpass, auth, db schema, core types, monorepo, documentation set.
