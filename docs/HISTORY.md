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

Achieved: email/password, OAuth, TOTP, sign-in/up pages, dashboard.

## 2026-10-04 | phase-5 | OpenStreetMap Overpass source adapter

Achieved: OverpassAdapter.

## 2026-10-04 | phase-6 | UK Companies House and SEC EDGAR adapters

Achieved: CompaniesHouseAdapter and EdgarAdapter.

## 2026-10-04 | phase-7 | Certificate Transparency crt.sh adapter

Achieved: CrtShAdapter.

## 2026-10-04 | phase-8 | hiring signal adapters (HN Algolia and Adzuna)

Achieved: HnAlgoliaAdapter and AdzunaAdapter.

## 2026-10-04 | phase-9 | Meta Ad Library adapter

Goal: Official advertising-signal source without scraping.

Done:
- Verified Graph API ads_archive (developers.facebook.com, 2026-10-04): requires access token and identity confirmation; ad_reached_countries and search_terms required; commercial coverage strongest in EU/UK; rate limit Graph error 613.
- packages/sources/src/meta-ad-library.ts: MetaAdLibraryAdapter maps page_name advertisers to candidates with snapshot evidence URLs.
- Unit tests including 613 handling and page dedupe.
- META_AD_LIBRARY_ACCESS_TOKEN in .env.example.
- DATA_SOURCES.md updated; scraping of Ad Library UI explicitly rejected in notes.

Achieved: Seven source adapters implemented.

Problems: Live Meta calls need a human-verified token. Non-EU commercial coverage via API is limited.

Next: Phase 10-11 remaining sources, or Phase 12 scoring engine.
