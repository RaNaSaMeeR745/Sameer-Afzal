# Scoutline

Scoutline finds marketing agencies their next clients: real businesses, companies, and agencies worldwide that show a live need right now, delivered with verified contacts, the evidence, a ready-to-send proof report, and a personalized message.

## Who it is for

- Marketing agencies of every type and size (SEO, AEO/GEO, paid media, social, content, web, e-commerce, branding, video, PR, CRO, analytics, WhatsApp and CRM automation, AI automation)
- Freelancers and consultants who sell marketing services
- White-label resellers and agency-service vendors who sell to agencies

## The problem

Agencies buy lists from Apollo, ZoomInfo, Google Maps scrapers, and LinkedIn tools. Every agency pulls from the same pools, so the same businesses receive dozens of identical pitches and ignore all of them. Generic lists tell you a business exists. They do not tell you it needs help today, and they do not give you anything specific to say.

## The solution

Scoutline discovers leads through signals (a new launch, a hiring post, a fresh filing, a broken tracking setup, a new ad account, a missing AI-search presence) instead of static lists. It stacks multiple signals into one explainable score, checks whether the lead is already taken by another agency, builds a proof asset from the lead's own site, and writes an evidence-grounded message. It then tracks replies and learns which signals convert for that specific agency.

## Goals

- Every lead carries evidence links and a reason to contact now. No evidence, no lead.
- Top 5 to 10 percent of leads each week are genuinely hot, not a raw dump.
- Worldwide coverage using free and legitimate sources first, with paid providers only as optional BYOK add-ons.
- From lead to booked call inside one workflow: discover, verify, score, prove, message, follow up, learn.
- Simple flat pricing per workspace with unlimited seats.
- A landing page and content system that ranks in Google and is cited by AI answer engines.

## Lead modes

Users pick a top-level type, then one or more modes, then geography, niche, and the service they sell.

| Type | Mode key | Who it finds | Primary signals |
|------|----------|--------------|-----------------|
| B2C | local_business | Restaurants, clinics, salons, gyms, real estate, home services, retail | Weak or missing website, no tracking, review problems, no online booking, new listing, no WhatsApp or chat |
| B2C | ecommerce_brand | Online stores (Shopify, WooCommerce, others) | New store, running ads without pixel or CAPI, slow mobile pages, weak product pages, no email capture, poor schema |
| B2B | b2b_company | SaaS, services, manufacturers, funded startups | New registration, funding filing, hiring for marketing roles, site gaps, new product launch |
| B2B | hiring_company | Any company hiring marketing, SEO, ads, design, content, or dev roles | Open job posts (they have a stated need and budget, pitch outsourcing) |
| B2B | agency | Other agencies who could buy an AEO tool, white-label services, or a white-label WhatsApp CRM | Sells SEO with no AEO offer, no schema or llms.txt on own site, no CRM or WhatsApp offer, agency in a WhatsApp-heavy market |

## Architecture summary

Monorepo with pnpm workspaces and Turborepo. TypeScript everywhere, strict mode.

- apps/web: Next.js App Router, React, Tailwind, shadcn/ui
- apps/worker: Node.js BullMQ workers for discovery, crawl, enrich, score, proof, message
- packages/core: domain types, config, pure logic, zod schemas
- packages/db: PostgreSQL 16 + Drizzle ORM + RLS
- packages/sources: one adapter per data source
- packages/enrich: crawler, tech fingerprint, contact extraction
- packages/audit: SEO/AEO/tracking/speed/CRO checks
- packages/ai: LLM abstraction (Anthropic default)
- packages/billing: Paddle first

Auth: Better Auth. Hosting: Vercel or VPS + Docker. Object storage for proof PDFs.

Full details in docs/ARCHITECTURE.md.

## Security summary

Row Level Security on every tenant table. Secrets never committed. Official APIs and public data only. Full compliance stance (GDPR, PECR, CAN-SPAM, CASL) documented in docs/SECURITY.md.

## Documentation

- [AGENTS.md](AGENTS.md) - Rules every agent must follow
- [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md) - Phased plan and status
- [docs/HISTORY.md](docs/HISTORY.md) - Commit log
- [docs/FILEMAP.md](docs/FILEMAP.md) - File inventory
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/SECURITY.md](docs/SECURITY.md)
- [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md)
- [docs/API.md](docs/API.md)
- [docs/STRATEGY.md](docs/STRATEGY.md)
- [docs/SEO_AEO.md](docs/SEO_AEO.md)
- [docs/BACKLINKS.md](docs/BACKLINKS.md)
- [docs/DECISIONS.md](docs/DECISIONS.md)

## Quick start

(Coming after Phase 1 monorepo skeleton.)

## License

Proprietary. All rights reserved.
