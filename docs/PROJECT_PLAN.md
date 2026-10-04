# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0: Documentation bootstrap

**Status:** done

## Phase 1: Monorepo skeleton and tooling

**Status:** done

## Phase 2: Core domain types and service catalog

**Status:** done

## Phase 3: Database schema and Drizzle setup

**Status:** done

## Phase 4: Auth foundation (Better Auth)

**Status:** done

## Phase 5: OpenStreetMap Overpass source adapter

**Status:** done

## Phase 6: UK Companies House and SEC EDGAR adapters

**Status:** done

## Phase 7: Certificate Transparency (crt.sh) adapter

**Goal:** Verify crt.sh public CT search and implement domain discovery from new certificates.

**Tasks:**
- [x] Verify crt.sh access model and rate guidance (~60 req/min historical)
- [x] CrtShAdapter with output=json, not_before filter, hostname mapping
- [x] Unit tests (mapCrtShRow, mocked fetch)
- [x] Update DATA_SOURCES, FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none

## Phase 8: Hiring signal adapters (HN Algolia and/or Adzuna)

**Status:** not started

## Phase 9: Meta Ad Library adapter (verify terms first)

**Status:** not started

## Phase 10-11: Remaining verified sources

**Status:** not started

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
