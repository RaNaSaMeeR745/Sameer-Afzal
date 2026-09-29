# DECISIONS.md - Important Decisions Log for Scoutline

Format: Date | Decision | Options considered | Choice | Reason

## 2026-09-29 | Repository location

Options: Create new private repo "scoutline" or use existing empty repo "Sameer-Afzal".

Choice: Use RaNaSaMeeR745/Sameer-Afzal as instructed by the owner.

Reason: Owner directed the project into this repository. Permissions were granted after initial connector limitations.

## 2026-09-29 | Stack (from product constitution)

Options: Various monorepo and framework combinations.

Choice: pnpm workspaces + Turborepo, TypeScript strict, Next.js App Router for web, Node.js + BullMQ for worker, Drizzle + PostgreSQL 16, Better Auth, Anthropic as default LLM, Paddle as first billing provider, Redis, Playwright, S3-compatible storage.

Reason: Explicitly decided in the product constitution. Changes require a new entry in this file.

## 2026-09-29 | Pricing model defaults

Options: Per-seat, pure credit, hybrid, usage-based.

Choice: Flat per workspace, unlimited seats, credit-based (one credit = one fully enriched, scored, evidence-backed lead). Trial 14 days / 25 credits no card. Starter 39 USD / 300 credits / 2 modes. Growth 99 USD / 1,500 credits / all modes. Agency 249 USD / 6,000 credits / white-label + API + exclusivity. Annual = two months free. Target >= 70 percent gross margin after LLM and infrastructure costs.

Reason: Matches the product constitution positioning against per-seat competitors. Final numbers may be adjusted after real cost-per-lead measurement.

## Pending decisions (to be resolved in later phases)

- Exact hosting providers (Vercel vs VPS, Neon vs Supabase vs self-hosted Postgres) after reading current pricing pages in Phase 1.
- Default LLM model names and token budgets once packages/ai is implemented.
- Exact credit cost calculation once the pipeline has measured real LLM + crawl costs.
