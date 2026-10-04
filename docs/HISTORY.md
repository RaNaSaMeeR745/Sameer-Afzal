# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 | phase-1 through phase-11 | monorepo, domain, db, auth, sources

Achieved: Nine source adapters, Better Auth, Drizzle schema, core types.

## 2026-10-04 | phase-12 | scoring engine

Goal: Explainable lead score (Need 0-40, Timing 0-25, Budget 0-15, Reach 0-10, Fit 0-10).

Done:
- packages/core/src/scoring.ts: scoreLead, SCORE_CAPS, DEFAULT_WEIGHTS, deriveWeightsFromOutcomes
- Need from audit finding severity; Timing exponential decay by signal type; Budget from spend-like signals; Reach from contact verification; Fit from ICP country/niche/service
- Rejects missing_evidence; penalties for served and contested freshness
- Per-tenant weight learning after 30 outcomes, multipliers clamped to [0.5, 1.5]
- Unit tests for reject, need, served penalty, reach, fit, and weight derivation

Achieved: Scoring is pure, testable, and explainable via breakdown.notes and evidenceLinks.

Next: Phase 13 audit engine integration.
