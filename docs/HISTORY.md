# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 | phase-1 through phase-19 | monorepo through dashboard

## 2026-10-05 | phase-20 | landing pages and SEO

## 2026-10-05 | phase-21 | public API

Goal: First authenticated API surface and billing webhook.

Done:
- apps/web/src/lib/api-auth.ts: SHA-256 key hash, Bearer resolve, SCOUTLINE_API_KEYS loader
- GET /api/health
- GET /api/v1/leads with pagination query and freshness filter validation
- POST /api/webhooks/paddle with verifyPaddleSignature and credit grant preview
- docs/API.md updated to match implementation

Achieved: External clients can authenticate and call leads; Paddle can notify.

Next: Exclusivity claims, or outcome learning, or DB persistence for leads.
