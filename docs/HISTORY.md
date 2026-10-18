# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 through 2026-10-05 | phase-1 through phase-23

Pipeline through outcome learning.

## 2026-10-18 | phase-24 | DB persistence repositories

## 2026-10-18 | phase-25 | wire API to repositories

Goal: API routes read and write Postgres when DATABASE_URL is set.

Done:
- apps/web/src/lib/db.ts: getDb / requireDb
- GET /api/v1/leads uses listTenantLeads
- POST /api/v1/claims loads active claims, inserts on success
- POST /api/v1/outcomes persists with leadId and learns from stored samples
- Paddle webhook calls persistGrant when custom_data has tenant_id and plan_key

Achieved: End-to-end API persistence path for leads, claims, outcomes, credits.

Next: 30-day validation plan, or worker lead write path.
