# SECURITY.md - Threat Model and Controls for Scoutline

## Threat model (high level)

- Unauthorized access to another tenant's leads, messages, or billing data
- Credential stuffing or account takeover of agency workspaces
- Injection of malicious signals or forged evidence
- Credit ledger double-spend or negative balance
- Secrets leakage via git, logs, or client-side exposure
- Outbound email/SMS/WhatsApp used for spam (legal and reputation risk)
- Data residency and privacy regulation violations (GDPR, PECR, CAN-SPAM, CASL)

## Controls

- PostgreSQL Row Level Security on every tenant table. Tenant id comes only from the authenticated session.
- Better Auth with email verification, OAuth (Google, GitHub), and TOTP two-factor.
- Sessions in secure, httpOnly, sameSite cookies.
- Secrets never committed. .env.example contains names only. Runtime secrets from environment or a secrets manager.
- All outbound messaging features require unsubscribe support and suppression lists.
- Official APIs and public data only. No scraping of LinkedIn, Instagram, Facebook groups, or any site whose terms forbid automated access.
- Rate limiting on public endpoints and on source adapters.
- Idempotent credit ledger (append-only).
- Audit log for sensitive actions (membership changes, API key creation, claim creation).

## Compliance stance

- EU and UK: GDPR + PECR. Lawful basis for B2B cold outreach must be documented per campaign. Soft opt-in rules followed where required.
- US: CAN-SPAM (physical address, unsubscribe, accurate headers).
- Canada: CASL (consent or implied consent rules).
- Local equivalents for other jurisdictions are recorded when a country is enabled.

## Incident process (outline)

1. Detect (monitoring, user report, or automated alert)
2. Contain (revoke keys, freeze tenant, rotate secrets)
3. Investigate (audit log, ledger, access logs)
4. Notify affected parties within required timelines
5. Remediate and post-mortem in DECISIONS.md or a dedicated incident entry in HISTORY.md

## Checklist (to be expanded)

- [ ] RLS policies written and tested for every tenant table
- [ ] Secret scanning in CI
- [ ] Dependency audit in CI
- [ ] Penetration test before public launch
