# API.md - Public REST API and Webhooks Reference for Scoutline

This document will contain the full public API reference once the API surface is implemented (later phases).

## Planned surface (high level)

- Authentication: API keys scoped per tenant, with rate limits and audit log.
- Endpoints (planned):
  - GET /v1/leads (list with filters, pagination)
  - GET /v1/leads/:id (single lead with score breakdown and evidence)
  - POST /v1/searches (create or trigger a discovery run)
  - GET /v1/searches/:id/status
  - GET /v1/proof/:shareToken (public proof report)
  - Webhooks: lead.ready, lead.replied, credit.low, claim.expired

## Current status

No public API endpoints exist yet. This file is a placeholder registered in Phase 0 so the documentation set is complete. Detailed request/response schemas, error codes, and rate limits will be added when the API is built and will be kept in sync with the implementation.

## Versioning

API will be versioned under /v1. Breaking changes will require a new major version.
