# API.md - Public REST API and Webhooks Reference for Scoutline

API version prefix: `/api/v1`. Breaking changes require a new major version.

## Authentication

```
Authorization: Bearer <api_key>
```

Keys: SHA-256 hashed (`apps/web/src/lib/api-auth.ts`). Bootstrap via
`SCOUTLINE_API_KEYS=tenantId:label:rawKey` (comma-separated).

## Rate limits

Authenticated `/api/v1/*` routes (except public proof) use a fixed window of
**60 requests per minute per tenant** (`apps/web/src/lib/rate-limit.ts`).

Response headers:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `Retry-After` (only when limited)

Exceeded limit returns HTTP `429` with `{ "error": "rate_limited" }`.

Counters are in-process. Multi-instance deployments do not share counts until a
Redis-backed limiter is added.

## Database

When `DATABASE_URL` is set, routes use `@scoutline/db` repositories.
Without it, GET leads returns an empty page; claims still decide in memory
but do not persist; outcomes learn from the request body only; Paddle
acknowledges without writing the ledger.

## Implemented endpoints

### GET /api/health

Liveness probe. No auth.

### GET /api/v1/leads

List tenant leads. Query: `page`, `pageSize`, `freshness`.

### GET /api/v1/leads/:id

Single lead for the authenticated tenant. Includes `scoreBreakdown`, `modeKeys`,
`notes`, timestamps. Errors: `400 invalid_id`, `404 not_found`,
`503 database_not_configured`.

### POST /api/v1/claims

Create exclusivity claim. Body: `entityId`, optional `niche`, `geography`, `ttlMs`.

### POST /api/v1/outcomes

Record outcomes and/or compute learning.

### GET /api/v1/proof/:shareToken

Public proof report. No auth. Not rate-limited by tenant key (token is the gate).

### POST /api/webhooks/paddle

Requires `Paddle-Signature` and `PADDLE_WEBHOOK_SECRET`.
Credit grant requires `custom_data.tenant_id` and `custom_data.plan_key`.

## Pipeline (worker)

Discover → enrich → audit → score → prove → message.
Proof jobs write `proof_assets.share_token` and store HTML in `html_ref`.

## Planned

- POST /api/v1/searches
- Outbound webhooks: lead.ready, lead.replied, credit.low, claim.expired
- Shared Redis rate-limit counters for multi-instance web
