# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 | phase-1 through phase-17 | monorepo through messaging

Achieved: Lead pipeline Discover through Message.

## 2026-10-04 | phase-18 | billing with Paddle

Goal: Workspace plans and safe credit accounting.

Done:
- packages/billing/src/plans.ts: trial 25, starter 300/$39, growth 1500/$99, agency 6000/$249
- packages/billing/src/credits.ts: append-only grant/spend, duplicate eventId rejected, no negative balance
- packages/billing/src/paddle.ts: verifyPaddleSignature per Paddle Billing docs (HMAC over ts:rawBody), parsePaddleEvent
- Unit tests for signature accept/reject and ledger idempotency

Achieved: Billing core is pure and testable; webhook HTTP route remains for API/dashboard phase.

Next: Dashboard UI.
