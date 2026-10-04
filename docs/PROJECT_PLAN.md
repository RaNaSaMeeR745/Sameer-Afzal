# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 12

**Status:** done (docs, monorepo, core, db, auth, sources, scoring)

## Phase 13: Audit engine integration

**Goal:** Deterministic page audits producing AuditFindings with evidence and serviceKeys.

**Tasks:**
- [x] HTML helpers (title, meta, H1, canonical, viewport, JSON-LD, FAQ schema)
- [x] Technical, SEO, and AEO check suites
- [x] runAudit orchestrator with optional serviceKey filter
- [x] Unit tests on bare and complete pages
- [x] Export from @scoutline/audit; update FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none (network fetch lives in enrich/worker later; audit is pure on snapshots)

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
