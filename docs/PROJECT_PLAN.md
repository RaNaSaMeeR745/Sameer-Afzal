# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 15

**Status:** done (docs through enrich page fetch)

## Phase 16: Proof report generation

**Goal:** Self-contained HTML proof asset from findings and score.

**Tasks:**
- [x] buildProofReport with escaped HTML, score grid, sorted findings
- [x] Unit tests (XSS escape)
- [x] ProveJobData + processProveJob + prove worker
- [x] Update FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none (S3 upload of HTML/PDF can follow when object storage is wired)

## Later phases

- Messaging drafts
- Billing with Paddle
- Dashboard UI
- Landing pages and SEO content
- Public API
- Exclusivity claims
- Learning from outcomes
- 30-day validation (Phase 35)
