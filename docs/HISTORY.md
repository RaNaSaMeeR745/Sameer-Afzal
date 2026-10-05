# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 through 2026-10-05 | phase-1 through phase-22

Pipeline through exclusivity claims.

## 2026-10-05 | phase-23 | learning from outcomes

Goal: Bounded, reversible, explained score weight learning.

Done:
- packages/core/src/learning.ts: learnWeightsFromOutcomes (min 30 samples), explainWeightDeltas
- Unit tests for not-ready and mixed win/loss derivation
- POST /api/v1/outcomes returns learning result for a submitted batch

Achieved: Tenants can drive scoring weights from outcomes once volume exists.

Next: 30-day validation plan or DB persistence for pipeline writes.
