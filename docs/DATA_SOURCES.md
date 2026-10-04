# DATA_SOURCES.md - Lead Source Registry for Scoutline

Every source must be verified against current official documentation and terms before any adapter is built. Verification date and findings are recorded here. Status values: candidate, verified, rejected, implemented.

## Local and general businesses

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| OpenStreetMap Overpass API | https://wiki.openstreetmap.org/wiki/Overpass_API | Read-only public instances. Require identifying User-Agent. Cache and rate-limit. On HTTP 429 or 406 pause 30s. Commercial regular use should prefer self-hosted or paid Overpass. ODbL attribution required for derived products. | Main instance: ~10,000 queries and ~1 GB/day one-off; regular apps ~100 queries and ~10 MB/day. | Global | 2026-10-04 | implemented |
| Google Places API | Official Google docs | Strict terms, no resale outside allowed use | Paid, BYOK only | Global | pending | candidate (BYOK) |
| Foursquare Places API | Official docs | Check current terms | Free tier exists, verify | Global | pending | candidate (BYOK) |
| Yelp Fusion | Official docs | Paid, no free tier currently | Paid | Limited | pending | candidate (BYOK) |

## New business and funding signals

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| UK Companies House API | https://developer.company-information.service.gov.uk/ | Free public data API with registered API key. HTTP Basic (key as username). Do not embed keys in client code. | 600 requests per 5-minute window per application. HTTP 429 when exceeded. | UK | 2026-10-04 | implemented |
| US SEC EDGAR | https://www.sec.gov/edgar and efts.sec.gov | Public filings. Fair access: identify with User-Agent including contact email. No API key. | Max 10 requests per second. No daily quota. Exceeding can yield 403/429 and temporary IP block. | US | 2026-10-04 | implemented |
| Certificate Transparency (crt.sh) | https://crt.sh/?q=&output=json | Public CT log search. No API key. JSON via output=json. Service is donation-supported and can return 50x under load. | Operator-reported throttle historically ~60 requests per IP per minute. Back off on 429/502/503/504. | Global | 2026-10-04 | implemented |
| Product Hunt API | Official docs | Check terms | Free tier verify | Global | pending | candidate |
| OpenCorporates | Official docs | Limited free access | Limited | Multi-country | pending | candidate |

### UK Companies House verification notes (2026-10-04)

- Adapter: `packages/sources/src/companies-house.ts`.
- Requires `COMPANIES_HOUSE_API_KEY`.

### US SEC EDGAR verification notes (2026-10-04)

- Adapter: `packages/sources/src/edgar.ts`.
- Endpoint: `https://efts.sec.gov/LATEST/search-index`.

### Certificate Transparency crt.sh verification notes (2026-10-04)

- Public site: https://crt.sh/ . Query form supports identity search; append `output=json` for machine-readable results.
- Adapter: `packages/sources/src/crtsh.ts` (`CrtShAdapter`).
- Maps certificate common names and SAN name_value lines to domain candidates; skips wildcards.
- Optional `incorporatedSince` filters on certificate `not_before`.
- Evidence URL: `https://crt.sh/?id={id}` when available.
- Rate limit: historical operator post (Rob Stradling, crtsh Google Group) documented ~60 r/m per IP; treat as soft fair-use and back off on errors.

## Hiring signals

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| Hacker News Who is Hiring (Algolia) | https://hn.algolia.com/api | Public | Free | Global remote | pending Phase 8 | candidate |
| RemoteOK API | Official | Check | Free | Remote | pending | candidate |
| We Work Remotely RSS | Public RSS | Fair use | Free | Remote | pending | candidate |
| Adzuna API | Official | Free keys, multi-country | Free tier | Multi-country | pending Phase 8 | candidate |
| Jooble API | Official | Free keys | Free tier | Multi-country | pending | candidate |

## Advertising signals

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| Meta Ad Library | Official API docs | Regional coverage | Free API where available | Regional | pending Phase 9 | candidate |
| Google Ads Transparency Center | No official API | Manual assist only | N/A | Global | pending | rejected (no official API) |

## Agency discovery

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| Brave Search API / Serper / SerpAPI | Official | BYOK | Free tiers vary | Global | pending Phase 10 | candidate (BYOK) |
| OSM advertising/marketing categories | Overpass | Same as OSM | Free | Global | pending | candidate |
| Clutch / Sortlist / DesignRush | Site terms | Automated access usually forbidden | N/A | Global | pending | candidate (manual only if terms forbid) |

## Contact discovery and verification

Public contact pages, mailto links, structured data, team pages on the entity's own site only. Optional BYOK (Hunter, Apollo) using tenant key.

## Explicitly excluded

- LinkedIn scraping
- Instagram or Facebook page/group scraping
- Any source behind a login
- Any source whose terms forbid automated access
