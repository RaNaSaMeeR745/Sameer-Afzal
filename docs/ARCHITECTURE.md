# ARCHITECTURE.md - System Design for Scoutline

## Stack (decided)

- Monorepo: pnpm workspaces + Turborepo, TypeScript strict mode everywhere
- apps/web: Next.js (App Router), React, Tailwind CSS, shadcn/ui. Marketing pages statically generated. Dashboard server-rendered with client islands.
- apps/worker: Node.js service running BullMQ workers for discovery, crawling, enrichment, scoring, proof generation, messaging
- packages/core: domain types, config (modes, services, scoring), pure logic, validation schemas (zod)
- packages/db: PostgreSQL 16 with Drizzle ORM and migrations. Row Level Security for tenant tables.
- packages/sources: one adapter per data source behind a common interface
- packages/enrich: crawler, tech fingerprinting, contact extraction, verification
- packages/audit: SEO, AEO, tracking, speed, and CRO checks producing findings with evidence
- packages/ai: LLM provider abstraction (Anthropic by default, model chosen by environment variable; cheaper model for classification and scoring, stronger model for message writing), prompt templates, output validation, evidence grounding
- packages/billing: payment provider abstraction with Paddle as the first implementation
- Redis: queues, rate limiters, cache
- Object storage: S3-compatible bucket for proof report PDFs and screenshots
- Headless browser: Playwright in the worker for screenshots and JavaScript-rendered checks
- Auth: Better Auth (email plus password with verification, Google and GitHub OAuth, TOTP two-factor). Sessions in secure cookies.
- Hosting: apps/web on Vercel or VPS behind Nginx; worker and Redis on VPS via Docker Compose; Postgres on Neon or Supabase or self-hosted (decision recorded in DECISIONS.md after Phase 1 pricing review)
- CI/CD: GitHub Actions for lint, typecheck, tests, banned-pattern check, dependency audit, secret scan, build, and deploy

## Data model outline

### Global tables (shared across tenants, business data only)

- entities: canonical name, domain, country, city, category, registry ids
- entity_signals: signal type, source, evidence URL, observed_at, expires_at, raw payload reference
- entity_contacts: public business contacts only (role emails, phone, socials, verification status, source)
- entity_audits: audit findings per crawl with timestamps and evidence
- agency_credits: detected agency or vendor credits found on an entity's site, ads, or socials

### Tenant tables (every row has tenant_id, protected by RLS)

- tenants, memberships (roles: owner, admin, member, viewer), invitations
- offer_profiles: services sold, ICP, target geography, price range, case studies, tone
- searches: saved discovery configs (type, modes, geography, niche, service)
- tenant_leads: link to entity, score, score breakdown, freshness class, status, owner, notes
- proof_assets: report HTML and PDF pointers, share token, view count
- messages and sequences: drafts, channel, step, sent_at, outcome
- outcomes: replied, call booked, won, lost, reason (used for re-weighting)
- claims: exclusivity (tenant, niche, geography, entity, expires_at)
- suppressions: do-not-contact by email, domain, or entity
- credits_ledger: append-only credit grants and spends
- api_keys, webhooks, integrations (secrets encrypted), audit_log
- subscriptions, billing_events (idempotent webhook records)

## Lead pipeline (jobs)

1. Discover: source adapters return candidate entities and signals for a search config.
2. Resolve: entity resolution and dedupe by normalized domain, registry id, phone, and fuzzy name plus location.
3. Enrich: crawl the site politely, fingerprint technology, extract public contacts and socials, detect agency credits.
4. Audit: run checks relevant to the tenant's service and produce findings with evidence.
5. Verify contacts: syntax, MX, disposable and role detection, optional BYOK provider lookup, suppression check.
6. Classify freshness: fresh, contested, or served (based on agency credits, professional ad management signs, appearance in prior exports, and claims by other tenants).
7. Score: explainable score (Need 0-40, Timing 0-25, Budget 0-15, Reach 0-10, Fit 0-10).
8. Prove: generate the proof report from the audit.
9. Message: draft the outreach and a 3-step follow-up per channel.
10. Deliver: surface only leads above the tenant's threshold, spend credits, notify.
11. Learn: outcomes feed back into per-tenant weights.

Every job is idempotent, retried with backoff, has a timeout, records progress, and never spends a credit twice.

## Multi-tenancy

PostgreSQL Row Level Security on every tenant-scoped table. Tenant id is injected from the authenticated session. No cross-tenant data leakage by construction.

## Caching and queues

Redis for BullMQ queues, rate limiters, and short-lived cache of expensive source responses. Aggressive caching of OpenStreetMap and registry data.

## Deployment

Decision pending Phase 1 after reading current pricing pages for Vercel, Neon, Railway, and self-hosted Docker Compose options. Recorded in DECISIONS.md.
