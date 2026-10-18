# API.md - Public REST API and Webhooks Reference for Scoutline

API version prefix: `/api/v1`. Breaking changes require a new major version.

## Authentication

```
Authorization: Bearer <api_key>
```

Keys: SHA-256 hashed (`apps/web/src/lib/api-auth.ts`). Bootstrap via
`SCOUTLINE_API_KEYS=tenantId:label:rawKey` (comma-separated).

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
Response items include `id`, `entityId`, `score`, `freshnessClass`, `status`, `serviceKey`.

### POST /api/v1/claims

Create exclusivity claim. Body: `entityId`, optional `niche`, `geography`, `ttlMs`.
Overlap checked against active DB claims when available.

### POST /api/v1/outcomes

Record outcomes and/or compute learning.

Single: `{ "leadId", "result", "reason?", "breakdown?" }`
Batch: `{ "samples": [{ "leadId?", "breakdown?", "result" }] }`

Persists rows when `leadId` and DATABASE_URL are present. Learning uses
stored samples plus the request payload. Response includes `persistedIds`
and `learning`.

### POST /api/webhooks/paddle

Requires `Paddle-Signature` and `PADDLE_WEBHOOK_SECRET`.
Credit grant requires `custom_data.tenant_id` and `custom_data.plan_key`
(`starter` | `growth` | `agency`). Uses event id as ledger `eventId`.

## Planned

- GET /api/v1/leads/:id
- POST /api/v1/searches
- GET /api/v1/proof/:shareToken
- Outbound webhooks: lead.ready, lead.replied, credit.low, claim.expired

## Rate limits

Not enforced yet.
