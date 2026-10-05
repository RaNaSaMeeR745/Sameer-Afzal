# API.md - Public REST API and Webhooks Reference for Scoutline

API version prefix: `/api/v1`. Breaking changes require a new major version.

## Authentication

Public lead endpoints require:

```
Authorization: Bearer <api_key>
```

Keys are hashed with SHA-256 before comparison (`apps/web/src/lib/api-auth.ts`).
Bootstrap keys can be supplied via `SCOUTLINE_API_KEYS` as
`tenantId:label:rawKey` (comma-separated). Production keys will live in the
`api_keys` table.

## Implemented endpoints

### GET /api/health

Liveness probe. No auth.

```json
{ "ok": true, "service": "scoutline-web", "time": "ISO-8601" }
```

### GET /api/v1/leads

List leads for the authenticated tenant.

Query parameters:

| Name | Description |
|------|-------------|
| page | 1-based page (default 1) |
| pageSize | 1-100 (default 20) |
| freshness | optional: fresh, contested, served |

Response:

```json
{
  "data": [],
  "pagination": { "page": 1, "pageSize": 20, "total": 0 },
  "tenantId": "..."
}
```

Empty `data` is expected until worker jobs persist tenant_leads.

Errors: `401 unauthorized`, `400 invalid_freshness`.

### POST /api/webhooks/paddle

Paddle Billing notifications. Requires header `Paddle-Signature` and env
`PADDLE_WEBHOOK_SECRET`. Body must be the raw request body for HMAC verification
(`ts:rawBody` per Paddle Billing docs).

Success: `{ received, eventId, eventType, creditGrant }`.
Errors: `401 invalid_signature`, `400 invalid_payload`, `503 webhook_not_configured`.

## Planned (not yet implemented)

- GET /api/v1/leads/:id
- POST /api/v1/searches
- GET /api/v1/searches/:id/status
- GET /api/v1/proof/:shareToken
- Outbound webhooks: lead.ready, lead.replied, credit.low, claim.expired

## Rate limits

Not enforced in this phase. Planned per-tenant limits will be documented here
when Redis rate limiting is attached.
