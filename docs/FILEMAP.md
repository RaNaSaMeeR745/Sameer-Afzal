# FILEMAP.md - Complete File Inventory for Scoutline

## Repository Tree (high level)

```
.
├── apps/web, apps/worker
├── packages/
│   ├── core/, db/
│   ├── sources/
│   │   └── src/
│   │       ├── types.ts
│   │       ├── overpass.ts (+ test)
│   │       ├── companies-house.ts (+ test)
│   │       ├── edgar.ts (+ test)
│   │       ├── crtsh.ts (+ test)
│   │       └── index.ts
│   ├── enrich, audit, ai, billing
├── docs/, scripts/
```

## Phase 7 file table

| Path | Purpose | Module | Created (phase) | Last changed (phase) |
|------|---------|--------|-----------------|----------------------|
| packages/sources/src/crtsh.ts | Certificate Transparency crt.sh adapter | sources | 7 | 7 |
| packages/sources/src/crtsh.test.ts | Unit tests | sources | 7 | 7 |
| packages/sources/src/index.ts | Export CrtShAdapter | sources | 1 | 7 |
| docs/DATA_SOURCES.md | crt.sh implemented | docs | 0 | 7 |
| docs/HISTORY.md | Commit log | docs | 0 | 7 |
| docs/FILEMAP.md | File inventory | docs | 0 | 7 |
| docs/PROJECT_PLAN.md | Phased plan | docs | 0 | 7 |

Earlier phases: registry adapters, Overpass, auth, db, core, monorepo, docs.
