# HISTORY.md - Commit Log for Scoutline

Newest entries at the bottom.

## 2026-09-29 | phase-0 | a4994a5 | create AGENTS.md with non-negotiable agent rules

Goal: Bootstrap the agent rules document required by the project constitution.

Done: Wrote AGENTS.md containing the complete Part 1 rules (1.1 through 1.12) plus the phase start checklist.

Achieved: Mandatory rules file exists on main.

Files changed: AGENTS.md (added)

Next: Remaining documentation set.

## 2026-10-04 | phase-1 | multiple | monorepo skeleton and tooling

Goal: Establish pnpm workspaces + Turborepo + strict TypeScript baseline, CI, and banned-pattern check.

Done: Root package.json, pnpm-workspace, turbo, tsconfig.base, packages and apps skeletons, check-banned.ts, CI workflow, .env.example.

Achieved: Monorepo structure matches ARCHITECTURE.md.

Problems: Local install not fully verified (no lockfile yet).

Next: Phase 2.

## 2026-10-04 | phase-2 | multiple | core domain types and service catalog

Goal: Define TypeScript types and the service catalog in packages/core.

Done:
- packages/core/src/modes.ts: five modes (local_business, ecommerce_brand, b2b_company, hiring_company, agency) with Zod enums and helpers
- packages/core/src/services.ts: full service catalog (33 services) with applicable modes and detectable problems
- packages/core/src/types.ts: Entity, Signal, Contact, AuditFinding, ScoreBreakdown, TenantLead, SearchConfig, AgencyCredit, Outcome plus Zod schemas and totalScore()
- Unit tests: modes.test.ts, services.test.ts, types.test.ts (node:test via tsx)
- index.ts re-exports all public symbols
- FILEMAP and PROJECT_PLAN updated; Phase 2 marked done

Achieved: @scoutline/core exports validated domain types, modes, and services matching the product constitution.

Problems: Local pnpm install hit intermittent npm registry 502 in the agent environment; tests could not be executed there. CI will run after lockfile exists.

Next: Phase 3 (database schema and Drizzle setup).
