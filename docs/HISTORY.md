# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | documentation bootstrap

## 2026-10-04 | phase-1 through phase-18 | monorepo through billing

Achieved: Full pipeline libraries and Paddle billing core.

## 2026-10-04 | phase-19 | dashboard UI

Goal: Authenticated workspace shell.

Done:
- apps/web/src/app/dashboard/layout.tsx: session gate, nav (Overview, Leads, Searches, Billing)
- Overview stats and get-started steps
- Leads table empty state using real mode/service counts
- Searches page: MODES and SERVICES from @scoutline/core
- Billing page: PLANS from @scoutline/billing

Achieved: Operators can sign in and navigate the product surface.

Next: Landing pages and SEO content, or public API webhook routes.
