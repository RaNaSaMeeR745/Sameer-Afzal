# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 27

**Status:** done (docs through pipeline workers)

## Phase 28: Proof share tokens and auto-enqueue

**Goal:** After score, generate proof, store share token, draft message.

**Tasks:**
- [x] insertProofAsset / getProofByShareToken / incrementProofViewCount
- [x] runProve persists HTML + share token
- [x] score worker enqueues prove on success
- [x] prove worker enqueues message with share URL
- [x] GET /api/v1/proof/[shareToken] public HTML
- [x] Update API.md, FILEMAP, HISTORY, PROJECT_PLAN

**Status:** done

**Blockers:** none. Large HTML stored in html_ref text column is fine for MVP; object storage can replace later.

## Later phases

- 30-day validation (Phase 35)
