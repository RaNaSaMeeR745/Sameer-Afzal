# FILEMAP.md - Complete File Inventory for Scoutline

## packages/sources adapters

| Path | Purpose | Phase |
|------|---------|-------|
| packages/sources/src/types.ts | Shared adapter types | 5 |
| packages/sources/src/overpass.ts | Local business Overpass | 5 |
| packages/sources/src/osm-agency.ts | Agency office Overpass | 10 |
| packages/sources/src/companies-house.ts | UK Companies House | 6 |
| packages/sources/src/edgar.ts | SEC EDGAR | 6 |
| packages/sources/src/crtsh.ts | Certificate Transparency | 7 |
| packages/sources/src/hn-algolia.ts | Hacker News hiring | 8 |
| packages/sources/src/adzuna.ts | Adzuna jobs | 8 |
| packages/sources/src/meta-ad-library.ts | Meta Ad Library | 9 |
| packages/sources/src/brave-search.ts | Brave Search BYOK | 10 |
| packages/sources/src/*.test.ts | Unit tests | 5-10 |
| packages/sources/src/index.ts | Exports | 1-10 |

## Other modules

- packages/core: modes, services, domain types (Phase 2)
- packages/db: schema + RLS (Phases 3-4)
- apps/web: Better Auth + pages (Phase 4)
- docs/: fixed documentation set (Phase 0+)
