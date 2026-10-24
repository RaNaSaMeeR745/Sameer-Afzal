# PROJECT_PLAN.md - Full Development Plan for Scoutline

Phases are sized for 15 to 20 minutes of focused work. Status values: not started, in progress, done, blocked.

## Phase 0 through Phase 28

**Status:** done (docs through proof share tokens and full pipeline chain)

## Phase 35: 30-day validation plan

**Goal:** Define measurable success criteria and a day-by-day operating plan to prove Scoutline works in production before broad marketing spend.

**Status:** done (plan written). Execution is an operator activity, not a code phase.

### Scope

One workspace (single tenant) running real discovery against implemented sources only. No fake leads. No paid ads until week 3 metrics clear the thresholds below.

### Environment prerequisites (day 0)

- [ ] Postgres with migrations 0001 and 0002 applied
- [ ] Redis reachable for BullMQ
- [ ] `DATABASE_URL`, `REDIS_URL`, `SCOUTLINE_API_KEYS` set
- [ ] At least one source key as needed: Companies House, Adzuna, Meta, Brave (Overpass, EDGAR, crt.sh, HN need no key)
- [ ] Worker process running (`@scoutline/worker`)
- [ ] Web app deployed with health check green
- [ ] One trial tenant with 25 or more credits granted via ledger

### Success metrics (must hit by day 30)

| Metric | Target | How measured |
|--------|--------|--------------|
| Pipeline completion rate | >= 70% of candidates with a domain reach score or explicit reject | Job logs + tenant_leads rows |
| Median time discover to scored lead | <= 10 minutes under normal load | BullMQ timestamps |
| Fresh leads share | >= 60% of scored leads classed `fresh` | tenant_leads.freshness_class |
| Evidence present | 100% of delivered leads have score_breakdown notes or findings | sample audit of 50 leads |
| Credit integrity | Zero double-spend on same event_id | credits_ledger unique event_id |
| Proof open rate | >= 20% of share tokens viewed at least once | proof_assets.view_count |
| Outreach reply rate (manual send) | >= 5% of messages actually sent | outcomes table |
| Source error budget | < 10% of discover jobs fail after retries | worker failed job counts |
| Cost per delivered lead | Recorded; target under $0.50 infra+LLM | STRATEGY.md cost log |

### Week 1: reliability

**Days 1-2:** Run discover for one geography (e.g. UK bbox or Companies House `incorporatedSince` last 30 days). Confirm enrich, audit, score, prove, message complete without manual intervention.

**Days 3-4:** Exercise each implemented adapter once. Log rate-limit hits in HISTORY. Pause any source that returns 429 more than three times in an hour.

**Days 5-7:** Spot-check 20 scored leads by hand. Confirm domain resolves, findings match the live page, score breakdown is explainable. File root-cause fixes in the existing modules (no parallel implementations).

### Week 2: quality and exclusivity

**Days 8-10:** Create claims on five entities. Confirm second tenant (or second API key tenant id) receives contested freshness and 409 on overlapping claim.

**Days 11-12:** Record at least 10 outcomes (mix of replied, lost). Confirm learning stays off until 30 samples; after seeding 30 synthetic-valid samples in staging only, confirm weights stay within 0.5-1.5 multipliers.

**Days 13-14:** Paddle webhook dry-run in sandbox: grant credits with `custom_data.tenant_id` and `plan_key`. Confirm idempotent replay of the same event_id does not double grant.

### Week 3: operator workflow

**Days 15-18:** Agency operator sends 30 real emails using drafted messages (human review required; no bulk spam). Log unsubscribes in suppressions. Measure opens on proof links.

**Days 19-21:** Dashboard smoke: list leads, filter freshness, open proof URL, record outcome from UI or API.

### Week 4: go / no-go

**Days 22-28:** Aggregate metrics table. Fix only blockers that prevent targets.

**Days 29-30:** Write results into HISTORY.md and STRATEGY.md cost-per-lead section. Decision:

- **Go:** all mandatory metrics met, no open security blockers, sources still terms-compliant.
- **Conditional go:** metrics within 20% of target and a dated fix plan.
- **No-go:** credit double-spend, cross-tenant leakage, or systematic evidence failures.

### Explicit non-goals for the 30 days

- Public marketing campaigns and affiliate spend
- New source adapters beyond the implemented set
- LinkedIn or other forbidden channels
- Auto-send without human review of the first 100 messages

### Unfinished engineering (not blocking the plan write-up)

- Object storage for proof HTML instead of text column (acceptable for MVP)
- Rate limits on public API routes
- GET /api/v1/leads/:id and POST /api/v1/searches
- Secret scanning and dependency audit CI jobs if not yet green

**Blockers for execution:** production credentials and a real Postgres/Redis environment (operator-supplied). Code path exists end to end as of Phase 28.

## Later engineering (optional, after validation)

- Rate limiting on API
- Lead detail endpoint and saved searches
- Object storage for proof assets
- Penetration test before public launch (SECURITY.md)
