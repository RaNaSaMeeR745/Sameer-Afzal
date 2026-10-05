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

### GET /api/v1/leads

List leads for the authenticated tenant. Query: `page`, `pageSize`, `freshness`.
Empty `data` until worker persistence is connected.

### POST /api/v1/claims

Create an exclusivity claim. Body: `entityId`, optional `niche`, `geography`, `ttlMs`.
Default TTL 14 days. See `@scoutline/core` claim helpers.

### POST /api/v1/outcomes

Submit outcome samples and receive learned scoring weights when ready.

Body:

```json
{
  "samples": [
    {
      "breakdown": {
        "need": 30,
        "timing": 20,
        "budget": 10,
        "reach": 5,
        "fit": 5,
        "evidenceLinks": [],
        "notes": []
      },
      "result": "won"
    }
  ]
}
```

`result` is one of: `replied`, `call_booked`, `won`, `lost`.

Response includes `learning.ready`, `sampleCount`, `weights` (null if under 30 samples),
`explanation` (UI strings), and `baseline` defaults. Multipliers are bounded to [0.5, 1.5].

### POST /api/webhooks/paddle

Paddle Billing notifications. Requires `Paddle-Signature` and `PADDLE_WEBHOOK_SECRET`.

## Planned (not yet implemented)

- GET /api/v1/leads/:id
- POST /api/v1/searches
- GET /api/v1/searches/:id/status
- GET /api/v1/proof/:shareToken
- Outbound webhooks: lead.ready, lead.replied, credit.low, claim.expired

## Rate limits

Not enforced in this phase.
