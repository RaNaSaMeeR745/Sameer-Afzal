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

Goal: New-business and filing signal sources with verified terms.

Done:
- Companies House: verified 600 req/5min, free API key, Basic auth (developer.company-information.service.gov.uk, 2026-10-04). Adapter supports search and advanced incorporated_from.
- EDGAR: verified User-Agent + 10 req/s fair access, no key (efts.sec.gov, 2026-10-04). Adapter searches filings and dedupes by CIK.
- DiscoverInput extended with optional query, incorporatedSince, limit; bbox optional for registry sources.
- Unit tests with mocked fetch for both adapters.
- COMPANIES_HOUSE_API_KEY added to .env.example (name only).
- DATA_SOURCES.md statuses set to implemented with verification notes.

Achieved: Three free sources implemented (Overpass, Companies House, EDGAR).

Problems: Live API calls not run in agent environment. Companies House needs a registered key before production use.

Next: Phase 7 (Certificate Transparency crt.sh).
