# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

Achieved: Fixed documentation set on main.

## 2026-10-04 | phase-1 | monorepo skeleton and tooling

Achieved: pnpm workspaces, Turborepo, CI, check-banned.

## 2026-10-04 | phase-2 | core domain types and service catalog

Achieved: modes, services, Zod types in packages/core.

## 2026-10-04 | phase-3 | database schema and Drizzle setup

Achieved: global and tenant tables, RLS SQL, createDb.

## 2026-10-04 | phase-4 | auth foundation with Better Auth

Achieved: email/password, OAuth, TOTP, sign-in/up pages, session-gated dashboard.

## 2026-10-04 | phase-5 | OpenStreetMap Overpass source adapter

Goal: First free local-business data source with verified terms.

Done:
- Verified Overpass policy from wiki.openstreetmap.org (2026-10-04): User-Agent required, fair-use ~10k queries/1GB day for one-off (divide by 100 for regular apps), pause 30s on 429/406, commercial regular use should prefer self-hosted or paid instances
- packages/sources/src/types.ts: SourceAdapter, SourceCandidate, BBox, DiscoverInput/Result
- packages/sources/src/overpass.ts: buildOverpassQuery, OverpassAdapter (POST interpreter, maps named amenities/shops, domain extraction, OSM evidence URLs)
- packages/sources/src/overpass.test.ts: query builder and mocked fetch tests
- DATA_SOURCES.md: Overpass status set to implemented with verification notes

Achieved: @scoutline/sources can discover local businesses from OSM within a bbox without scraping forbidden sources.

Problems: Live Overpass call not exercised in agent environment. Unit tests use injected fetch.

Next: Phase 6 (UK Companies House and/or SEC EDGAR).
