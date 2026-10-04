# FILEMAP.md - Complete File Inventory for Scoutline

## packages/sources (Phase 5-8)

| Path | Purpose | Created (phase) |
|------|---------|-----------------|
| packages/sources/src/types.ts | SourceAdapter, DiscoverInput, SourceCandidate | 5 |
| packages/sources/src/overpass.ts | OSM Overpass | 5 |
| packages/sources/src/companies-house.ts | UK Companies House | 6 |
| packages/sources/src/edgar.ts | SEC EDGAR | 6 |
| packages/sources/src/crtsh.ts | Certificate Transparency | 7 |
| packages/sources/src/hn-algolia.ts | Hacker News Algolia hiring | 8 |
| packages/sources/src/adzuna.ts | Adzuna Jobs API | 8 |
| packages/sources/src/*.test.ts | Unit tests per adapter | 5-8 |
| packages/sources/src/index.ts | Package exports | 1-8 |

## Other modules

- packages/core: modes, services, domain types (Phase 2)
- packages/db: global, tenant, auth schemas, RLS (Phases 3-4)
- apps/web: Better Auth, sign-in/up, dashboard (Phase 4)
- docs/: fixed documentation set (Phase 0+)
