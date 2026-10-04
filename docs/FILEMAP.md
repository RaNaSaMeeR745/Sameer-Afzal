# FILEMAP.md - Complete File Inventory for Scoutline

## packages/core

| Path | Purpose | Phase |
|------|---------|-------|
| packages/core/src/modes.ts | Lead modes | 2 |
| packages/core/src/services.ts | Service catalog | 2 |
| packages/core/src/types.ts | Domain schemas including ScoreBreakdown | 2 |
| packages/core/src/scoring.ts | scoreLead and weight learning | 12 |
| packages/core/src/scoring.test.ts | Scoring unit tests | 12 |
| packages/core/src/index.ts | Package exports | 2-12 |

## packages/sources

Nine adapters: Overpass, OSM agency, Companies House, EDGAR, crt.sh, HN Algolia, Adzuna, Meta Ad Library, Brave Search (Phases 5-10).

## Other

- packages/db: schema + RLS (Phases 3-4)
- apps/web: Better Auth + pages (Phase 4)
- docs/: fixed documentation set
