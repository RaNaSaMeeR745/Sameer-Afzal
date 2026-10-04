# FILEMAP.md - Complete File Inventory for Scoutline

## packages/sources adapters

| Path | Purpose | Phase |
|------|---------|-------|
| packages/sources/src/types.ts | SourceAdapter, DiscoverInput, SourceCandidate | 5 |
| packages/sources/src/overpass.ts | OSM Overpass | 5 |
| packages/sources/src/companies-house.ts | UK Companies House | 6 |
| packages/sources/src/edgar.ts | SEC EDGAR | 6 |
| packages/sources/src/crtsh.ts | Certificate Transparency | 7 |
| packages/sources/src/hn-algolia.ts | Hacker News Algolia | 8 |
| packages/sources/src/adzuna.ts | Adzuna Jobs | 8 |
| packages/sources/src/meta-ad-library.ts | Meta Ad Library ads_archive | 9 |
| packages/sources/src/*.test.ts | Unit tests | 5-9 |
| packages/sources/src/index.ts | Exports | 1-9 |

## Other modules

- packages/core: modes, services, domain types (Phase 2)
- packages/db: schema + RLS (Phases 3-4)
- apps/web: Better Auth + pages (Phase 4)
- docs/: fixed documentation set (Phase 0+)
