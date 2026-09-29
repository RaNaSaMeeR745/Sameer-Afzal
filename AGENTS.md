# AGENTS.md - Non-Negotiable Agent Rules for Scoutline

These rules must be obeyed for the life of the project. They cannot be overridden.

## 1.1 Read before you act

At the start of EVERY phase, and after any long pause, read in this order:

1. AGENTS.md
2. docs/FILEMAP.md
3. docs/PROJECT_PLAN.md (find the current phase and its status)
4. The last 5 entries of docs/HISTORY.md
5. Every doc that the phase touches (ARCHITECTURE.md, SECURITY.md, DATA_SOURCES.md, API.md, SEO_AEO.md, BACKLINKS.md, STRATEGY.md, DECISIONS.md)

State in your first message of the phase which files you read and the current phase number. If you skip this, you are working blind, and that is a failure.

## 1.2 Never push placeholders

Forbidden in any pushed file: TODO, FIXME, lorem ipsum, fake sample data presented as real, stub functions that return hardcoded values, empty handlers, "coming soon" text, dummy API keys, mock endpoints in production code, or commented-out code blocks. A CI check (scripts/check-banned.ts) greps for these and fails the build. If something cannot be finished in the phase, do not stub it. Write it into docs/PROJECT_PLAN.md as an unfinished item with a reason, and stop that item.

## 1.3 Never overwrite or duplicate working code

This is the most important rule.

Before writing any function, component, query, or module, search the repo for an existing implementation (grep the symbol names and the concept). Read it. Then modify that code in place with the smallest correct diff.

Never write a second version next to the first. Forbidden: v2, new, final, copy, old, temp, backup in file or function names. Forbidden: leaving the previous implementation in the file while adding a new one below it.

If code is wrong, fix the root cause in the existing code. Do not layer a workaround on top.

If code is superseded, delete it in the same commit and remove every reference to it.

Never rewrite an entire file to change a few lines. Use targeted edits. If a file must be restructured, say why in the commit body and in HISTORY.md.

Before editing a file, re-read its current content from disk. Never edit from memory.

## 1.4 Never invent new files when one can be edited

Before creating any file, check docs/FILEMAP.md and search the repo. If an existing file can hold the change, edit it. A new file is allowed only when the concern is genuinely new and no existing file owns it. Every new file must be registered in docs/FILEMAP.md in the same commit with its path, purpose, owner module, and the phase that created it. No stray scripts, scratch files, or duplicate docs. The documentation set is fixed (see Part 2). Do not create other markdown files.

## 1.5 Commit and documentation protocol (every single commit)

Every commit must, in the same commit, update:

- docs/HISTORY.md: append an entry (format in 2.3)
- docs/FILEMAP.md: every file added, moved, renamed, or deleted
- docs/PROJECT_PLAN.md: phase status and checkboxes
- Any other doc whose facts changed: README.md, ARCHITECTURE.md, SECURITY.md, API.md, DATA_SOURCES.md, SEO_AEO.md, BACKLINKS.md, DECISIONS.md

Docs must be updated with full detail, not one-line notes. If a doc statement is now false, correct it. Stale docs are bugs.

Commit message format: phase-<N>: <imperative summary> with a body listing what changed and why. Push to main after every passing commit. Tag the end of each phase phase-<N>-done.

## 1.6 Verify before you claim

Before every commit run: lint, typecheck, unit tests, integration tests, build. Only commit if all pass. Never say "done" or "working" unless you ran it and saw it pass. If a test fails, fix the cause. Never delete or weaken a test to make it pass. Report failures honestly in HISTORY.md.

## 1.7 Verify external facts, never assume

Before integrating any third-party API, data source, or payment provider, read its CURRENT official documentation and terms (free tier limits, rate limits, allowed use, pricing, country availability). Record the finding and the verification date in docs/DATA_SOURCES.md. If a source forbids automated access in its terms or robots.txt, do not use it. Do not rely on memory for limits or prices.

## 1.8 No guessing, no mocking around blockers

If you are blocked (missing credentials, unclear requirement, a source that turns out unusable), write the blocker in HISTORY.md and PROJECT_PLAN.md, stop that task, and ask me one precise question. Do not fake the result.

## 1.9 Time-boxing

Each phase is sized for 15 to 20 minutes of work. If a phase looks larger, split it by editing docs/PROJECT_PLAN.md into sub-phases (for example 12a, 12b), then do the first. Do not silently do partial work.

## 1.10 Writing style rule

Never use em dashes (the long dash character) in any text: UI copy, docs, comments, commit messages, emails, JSON content, marketing pages. Use commas, colons, periods, or parentheses. A check in scripts/check-banned.ts fails the build if an em dash appears in any tracked text file.

## 1.11 Secrets and data

Never commit secrets, keys, tokens, or real personal data. Use .env.example with variable names only. Use a secrets manager or environment variables in deployment.

## 1.12 Compliance stance

Use official APIs and public data. Respect robots.txt, rate limits, and terms. Do NOT scrape LinkedIn, Instagram, Facebook groups, or any site whose terms forbid it. Do NOT build anything that sends spam. Every outbound feature must carry unsubscribe support and suppression lists, and the docs must state the legal basis and regional rules (GDPR and PECR for the EU and UK, CAN-SPAM for the US, CASL for Canada, and local equivalents).

## Phase start checklist

1. Read AGENTS.md
2. Read docs/FILEMAP.md
3. Read docs/PROJECT_PLAN.md and note current phase and status
4. Read last 5 entries of docs/HISTORY.md
5. Read every doc the phase touches
6. State in first message: files read + current phase number
