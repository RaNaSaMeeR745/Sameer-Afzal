# FILEMAP.md - Complete File Inventory for Scoutline

## Repository Tree (high level)

```
.
├── .env.example
├── .github/workflows/ci.yml
├── .gitignore
├── AGENTS.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/app/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   └── worker/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/index.ts
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── BACKLINKS.md
│   ├── DATA_SOURCES.md
│   ├── DECISIONS.md
│   ├── FILEMAP.md
│   ├── HISTORY.md
│   ├── PROJECT_PLAN.md
│   ├── SECURITY.md
│   ├── SEO_AEO.md
│   └── STRATEGY.md
├── packages/
│   ├── ai/
│   ├── audit/
│   ├── billing/
│   ├── core/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── modes.ts
│   │       ├── modes.test.ts
│   │       ├── services.ts
│   │       ├── services.test.ts
│   │       ├── types.ts
│   │       └── types.test.ts
│   ├── db/
│   ├── enrich/
│   └── sources/
└── scripts/
    └── check-banned.ts
```

## File Table

| Path | Purpose | Module | Created (phase) | Last changed (phase) |
|------|---------|--------|-----------------|----------------------|
| AGENTS.md | Non-negotiable agent rules and phase start checklist | docs | 0 | 0 |
| README.md | Detailed product description, audience, goals, architecture summary, links to every doc | docs | 0 | 0 |
| docs/HISTORY.md | Detailed commit log, one entry per commit | docs | 0 | 2 |
| docs/FILEMAP.md | Inventory of every file in the repository | docs | 0 | 2 |
| docs/PROJECT_PLAN.md | Full phased development plan with goals, tasks, acceptance criteria, status | docs | 0 | 2 |
| docs/ARCHITECTURE.md | System design, stack, data model, queues, multi-tenancy, deployment | docs | 0 | 0 |
| docs/SECURITY.md | Threat model, controls, compliance stance, incident process | docs | 0 | 0 |
| docs/DATA_SOURCES.md | Every lead source: terms, limits, coverage, verification date, status | docs | 0 | 0 |
| docs/API.md | Public REST API and webhooks reference (placeholder until implemented) | docs | 0 | 0 |
| docs/STRATEGY.md | Competitor analysis, positioning, keyword map, pricing logic | docs | 0 | 0 |
| docs/SEO_AEO.md | Landing page and content SEO/AEO specification and score log | docs | 0 | 0 |
| docs/BACKLINKS.md | Link asset inventory, target list, outreach status tracker | docs | 0 | 0 |
| docs/DECISIONS.md | Every important decision with date, options, choice, reason | docs | 0 | 0 |
| package.json | Root monorepo package, scripts, shared devDependencies | root | 1 | 1 |
| pnpm-workspace.yaml | pnpm workspace package globs | root | 1 | 1 |
| turbo.json | Turborepo task pipeline | root | 1 | 1 |
| tsconfig.base.json | Shared strict TypeScript compiler options | root | 1 | 1 |
| .gitignore | Ignore node_modules, dist, env, caches | root | 1 | 1 |
| .env.example | Environment variable names only (no secrets) | root | 1 | 1 |
| scripts/check-banned.ts | CI script that fails on TODO, FIXME, em dash, lorem, dummy keys | scripts | 1 | 1 |
| .github/workflows/ci.yml | GitHub Actions: install, banned check, typecheck, lint, test, build | ci | 1 | 1 |
| packages/core/package.json | Core domain package metadata and test script | core | 1 | 2 |
| packages/core/tsconfig.json | Core package TypeScript config (excludes tests from build) | core | 1 | 2 |
| packages/core/src/index.ts | Core package public exports | core | 1 | 2 |
| packages/core/src/modes.ts | B2B/B2C mode definitions, Zod enums, helpers | core | 2 | 2 |
| packages/core/src/modes.test.ts | Unit tests for modes | core | 2 | 2 |
| packages/core/src/services.ts | Full service catalog with detectable problems and mode mapping | core | 2 | 2 |
| packages/core/src/services.test.ts | Unit tests for services | core | 2 | 2 |
| packages/core/src/types.ts | Domain types and Zod schemas (Entity, Lead, Score, etc.) | core | 2 | 2 |
| packages/core/src/types.test.ts | Unit tests for types and totalScore | core | 2 | 2 |
| packages/db/package.json | Database package metadata | db | 1 | 1 |
| packages/db/tsconfig.json | DB package TypeScript config | db | 1 | 1 |
| packages/db/src/index.ts | DB package entry | db | 1 | 1 |
| packages/sources/package.json | Sources adapters package metadata | sources | 1 | 1 |
| packages/sources/tsconfig.json | Sources TypeScript config | sources | 1 | 1 |
| packages/sources/src/index.ts | Sources package entry | sources | 1 | 1 |
| packages/enrich/package.json | Enrichment package metadata | enrich | 1 | 1 |
| packages/enrich/tsconfig.json | Enrich TypeScript config | enrich | 1 | 1 |
| packages/enrich/src/index.ts | Enrich package entry | enrich | 1 | 1 |
| packages/audit/package.json | Audit package metadata | audit | 1 | 1 |
| packages/audit/tsconfig.json | Audit TypeScript config | audit | 1 | 1 |
| packages/audit/src/index.ts | Audit package entry | audit | 1 | 1 |
| packages/ai/package.json | AI/LLM package metadata | ai | 1 | 1 |
| packages/ai/tsconfig.json | AI TypeScript config | ai | 1 | 1 |
| packages/ai/src/index.ts | AI package entry | ai | 1 | 1 |
| packages/billing/package.json | Billing package metadata | billing | 1 | 1 |
| packages/billing/tsconfig.json | Billing TypeScript config | billing | 1 | 1 |
| packages/billing/src/index.ts | Billing package entry | billing | 1 | 1 |
| apps/web/package.json | Next.js web app package metadata | web | 1 | 1 |
| apps/web/tsconfig.json | Web app TypeScript config | web | 1 | 1 |
| apps/web/src/app/layout.tsx | Root layout | web | 1 | 1 |
| apps/web/src/app/page.tsx | Minimal home page | web | 1 | 1 |
| apps/worker/package.json | Worker service package metadata | worker | 1 | 1 |
| apps/worker/tsconfig.json | Worker TypeScript config | worker | 1 | 1 |
| apps/worker/src/index.ts | Worker process entry | worker | 1 | 1 |
