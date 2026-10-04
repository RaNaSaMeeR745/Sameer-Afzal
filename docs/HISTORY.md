# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 | phase-1 | monorepo skeleton and tooling

## 2026-10-04 | phase-2 | core domain types and service catalog

## 2026-10-04 | phase-3 | database schema and Drizzle setup

## 2026-10-04 | phase-4 | auth foundation with Better Auth

## 2026-10-04 | phase-5 | OpenStreetMap Overpass source adapter

## 2026-10-04 | phase-6 | UK Companies House and SEC EDGAR adapters

## 2026-10-04 | phase-7 | Certificate Transparency crt.sh adapter

## 2026-10-04 | phase-8 | hiring signal adapters (HN Algolia and Adzuna)

## 2026-10-04 | phase-9 | Meta Ad Library adapter

## 2026-10-04 | phase-10 | OSM agency and Brave Search BYOK adapters

Goal: Agency discovery without scraping Clutch-class directories.

Done:
- OsmAgencyAdapter: Overpass query for office=advertising_agency, graphic_design, marketing, consulting (OSM wiki verified 2026-10-04)
- BraveSearchAdapter: BYOK web search via api.search.brave.com with X-Subscription-Token; metered pricing and storage-rights caution recorded
- Clutch / Sortlist / DesignRush marked rejected for automated access
- Unit tests for both adapters
- BRAVE_SEARCH_API_KEY in .env.example

Achieved: Nine source adapters. Core free and BYOK discovery surface for local, registry, CT, hiring, ads, and agencies.

Next: Phase 12 scoring engine.
