# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 through 2026-10-18 | phase-1 through phase-28

Pipeline through proof share tokens.

## 2026-10-24 | phase-35 | 30-day validation plan

Operator metrics and weekly schedule documented.

## 2026-10-24 | phase-36 | API rate limits and lead detail

Goal: Enforce request budgets and expose single-lead reads.

Done:
- apps/web/src/lib/rate-limit.ts: 60 requests per minute per tenant
- Rate limit on leads list, leads/:id, claims, outcomes
- getTenantLeadById + GET /api/v1/leads/:id
- API.md documents headers and 429 behavior

Achieved: Public API is harder to abuse and operators can fetch one lead by id.

Next: POST /api/v1/searches, or operator day-0 validation checklist.
