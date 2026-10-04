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

Goal: Hiring signals for hiring_company mode.

Done:
- HN Algolia: public `hn.algolia.com/api/v1/search`, no key. HnAlgoliaAdapter extracts companies from hiring story titles.
- Adzuna: verified ToS limits (25/min, 250/day, 2500/month) and commercial licence caution after 14-day trial for commercial orgs. AdzunaAdapter requires app id/key.
- Unit tests for both adapters.
- ADZUNA_APP_ID and ADZUNA_APP_KEY in .env.example.
- DATA_SOURCES updated.

Achieved: Six free or freemium sources implemented.

Problems: Adzuna commercial production use may need a written licence; flag before scaling.

Next: Phase 9 (Meta Ad Library, verify terms first).
