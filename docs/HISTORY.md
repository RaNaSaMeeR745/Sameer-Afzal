# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 through 2026-10-05 | phase-1 through phase-21

Pipeline, billing, dashboard, marketing, public API.

## 2026-10-05 | phase-22 | exclusivity claims

Goal: Tenants can claim entities so others see them as contested.

Done:
- packages/core/src/claims.ts: tryCreateClaim, claimsOverlap, applyClaimsToFreshness, 14-day default TTL
- Unit tests for foreign overlap, niche non-overlap, freshness downgrade
- POST /api/v1/claims with API key auth

Achieved: Claim decision logic is pure and testable; HTTP create endpoint exists.

Next: Learning from outcomes (per-tenant score weight updates).
