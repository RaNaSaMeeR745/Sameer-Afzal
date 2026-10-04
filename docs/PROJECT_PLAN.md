# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 14

**Status:** done (docs through worker queues for discover, audit, score)

## Phase 15: Enrich job and page fetch

**Goal:** Polite public-page fetch, contact extraction, tech fingerprint, enrich worker.

**Tasks:**
- [x] fetchPage with User-Agent, robots.txt, timeout, size cap, private-host SSRF guard
- [x] extractContacts (mailto, tel, text emails)
- [x] fingerprintTech (CMS and analytics hints)
- [x] enrichEntity orchestrator
- [x] processEnrichJob + register enrich worker
- [x] Unit tests; update FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none

## Later phases

- Proof report generation
- Messaging drafts
- Billing with Paddle
- Dashboard UI
- Landing pages and SEO content
- Public API
- Exclusivity claims
- Learning from outcomes
- 30-day validation (Phase 35)
