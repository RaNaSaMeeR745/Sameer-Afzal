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

Achieved: OverpassAdapter with verified fair-use handling.

## 2026-10-04 | phase-6 | UK Companies House and SEC EDGAR adapters

Achieved: CompaniesHouseAdapter and EdgarAdapter with verified limits.

## 2026-10-04 | phase-7 | Certificate Transparency crt.sh adapter

Goal: Discover domains from public CT logs as a new-site signal.

Done:
- Verified crt.sh public JSON search (`/?q=&output=json`), no API key. Historical operator rate guidance ~60 requests per IP per minute; service may return 50x under load.
- packages/sources/src/crtsh.ts: CrtShAdapter, mapCrtShRow (skips wildcards, dedupes hostnames, filters not_before via incorporatedSince)
- packages/sources/src/crtsh.test.ts: unit tests with mocked fetch
- DATA_SOURCES.md: crt.sh status implemented with verification notes

Achieved: Four free sources implemented (Overpass, Companies House, EDGAR, crt.sh).

Problems: Live crt.sh not called in agent environment.

Next: Phase 8 (hiring signal adapters).
