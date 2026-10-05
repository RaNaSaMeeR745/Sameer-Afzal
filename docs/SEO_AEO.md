# SEO_AEO.md - Landing Page and Content SEO/AEO Specification for Scoutline

## Goals

- Rank for primary commercial keywords listed in STRATEGY.md
- Be cited by AI answer engines (AEO / GEO) for agency lead-generation queries
- Provide embeddable free tools that create backlinks and capture inbound leads

## Implemented pages (Phase 20)

- Homepage `/` with positioning, how-it-works, modes, FAQ
- Pricing `/pricing` with published tiers and best-for tags
- Root metadata: title template, description, keywords, Open Graph, Twitter
- JSON-LD: SoftwareApplication + FAQPage on homepage
- `public/robots.txt`: allow marketing, disallow dashboard and auth routes
- `public/llms.txt`: product summary for AI crawlers

## Remaining page inventory

- Comparison pages: Scoutline vs Apollo, Scoutline vs Clay (honest tables)
- Alternatives pages: Apollo alternative for agencies, Clay alternative
- Tool landing pages: free website audit, AEO readiness checker, cold email opener, lead score calculator
- Informational hub: cold outreach for agencies, GDPR B2B rules, hiring signals
- Year-stamped roundups: best lead generation tools for agencies 2026+

## Technical SEO requirements

- Statically generated marketing pages where possible
- Clean URL structure, proper title and meta, Open Graph, Twitter cards
- Schema.org (Organization, SoftwareApplication, FAQPage, HowTo where relevant)
- llms.txt and robots.txt that allow legitimate AI crawlers while protecting private app routes
- Core Web Vitals targets: LCP < 2.5s, INP < 200ms, CLS < 0.1 on marketing pages
- Mobile-first, accessible, semantic HTML

## AEO / GEO requirements

- Answer-first content blocks that can be extracted by AI answer engines
- Clear, citable statements of fact with sources where applicable
- FAQ blocks on every commercial page
- Original data (signal reports and case studies once available) to increase citation likelihood

## Audit scores over time

| Date | Tool | Score | Notes |
|------|------|-------|-------|
| 2026-10-05 | manual | n/a | Homepage and pricing shipped with FAQ schema and llms.txt |

## Current status

Phase 20 foundation shipped. Comparison pages and free tools not started.
