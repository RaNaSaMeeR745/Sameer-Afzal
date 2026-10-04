# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 9

**Status:** done (docs, monorepo, core types, db, auth, Overpass, Companies House, EDGAR, crt.sh, HN, Adzuna, Meta Ad Library)

## Phase 10-11: Remaining verified sources (BYOK search, OSM agency)

**Goal:** Agency discovery without scraping forbidden directories.

**Tasks:**
- [x] Verify OSM office=advertising_agency and related tags
- [x] OsmAgencyAdapter + unit tests
- [x] Verify Brave Search API terms, pricing, storage limits
- [x] BraveSearchAdapter (BYOK) + unit tests
- [x] Reject Clutch/Sortlist/DesignRush automated access in DATA_SOURCES
- [x] Update DATA_SOURCES, .env.example, FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none (Brave requires tenant or platform API key at runtime)

## Phase 12: Scoring engine

**Status:** not started

## Phase 13: Audit engine integration

**Status:** not started

## Later phases

- Worker and BullMQ pipeline
- Proof report generation
- Messaging drafts
- Billing with Paddle
- Dashboard UI
- Landing pages and SEO content
- Public API
- Exclusivity claims
- Learning from outcomes
- 30-day validation (Phase 35)
