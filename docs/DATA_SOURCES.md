# DATA_SOURCES.md - Lead Source Registry for Scoutline

Every source must be verified against current official documentation and terms before any adapter is built. Verification date and findings are recorded here. Status values: candidate, verified, rejected, implemented.

## Local and general businesses

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| OpenStreetMap Overpass API | https://wiki.openstreetmap.org/wiki/Overpass_API | Read-only public instances. Require identifying User-Agent. Cache and rate-limit. On HTTP 429 or 406 pause 30s. Commercial regular use should prefer self-hosted or paid Overpass. ODbL attribution required for derived products. | Main instance (overpass-api.de): guideline under ~10,000 queries and ~1 GB/day for one-off use; for regular app use divide by ~100 (~100 queries and ~10 MB/day). No parallel multi-script hammering. | Global | 2026-10-04 | implemented |
| Google Places API | Official Google docs | Strict terms, no resale outside allowed use | Paid, BYOK only | Global | pending | candidate (BYOK) |
| Foursquare Places API | Official docs | Check current terms | Free tier exists, verify | Global | pending | candidate (BYOK) |
| Yelp Fusion | Official docs | Paid, no free tier currently | Paid | Limited | pending | candidate (BYOK) |

### OpenStreetMap Overpass verification notes (2026-10-04)

- Endpoint used: `https://overpass-api.de/api/interpreter` (configurable).
- Adapter: `packages/sources/src/overpass.ts` (`OverpassAdapter`).
- Sends `User-Agent: Scoutline/0.0.1 (...)` on every request.
- Maps named amenity/shop nodes and ways to `SourceCandidate` with OSM registry id and evidence URL.
- Throws on 429/406 with guidance to pause 30 seconds.
- Production volume must stay within fair-use; heavy commercial workloads should move to self-hosted or paid Overpass (Geofabrik, Mapsource, Overspan, etc.).
- OSM editing API (api.openstreetmap.org) is not used: it is for map editing only, not bulk read.

## New business and funding signals

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| UK Companies House API | https://developer.company-information.service.gov.uk/ | Free for registered users | Free | UK | pending Phase 6 | candidate |
| US SEC EDGAR | https://www.sec.gov/edgar | Public data, fair use | Free | US | pending Phase 6 | candidate |
| Certificate Transparency (crt.sh) | https://crt.sh | Public logs | Free, rate limits apply | Global | pending Phase 7 | candidate |
| Product Hunt API | Official docs | Check terms | Free tier verify | Global | pending | candidate |
| OpenCorporates | Official docs | Limited free access | Limited | Multi-country | pending | candidate |

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
| Meta Ad Library | Official API docs | Regional coverage, commercial data limited | Free API where available | Regional | pending Phase 9 | candidate |
| Google Ads Transparency Center | No official API | Manual assist only unless terms change | N/A | Global | pending | rejected (no official API) |

## Agency discovery

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| Brave Search API / Serper / SerpAPI | Official | BYOK | Free tiers vary | Global | pending Phase 10 | candidate (BYOK) |
| OSM advertising/marketing categories | Overpass | Same as OSM | Free | Global | pending | candidate |
| Clutch / Sortlist / DesignRush | Site terms | Automated access usually forbidden | N/A | Global | pending | candidate (manual validation only if terms forbid) |

## Contact discovery and verification

Public contact pages, mailto links, structured data, team pages on the entity's own site only. Role address patterns suggested but never sent unverified. Syntax, MX, disposable, catch-all heuristics. Optional BYOK (Hunter, Apollo) using tenant key.

## Explicitly excluded

- LinkedIn scraping
- Instagram or Facebook page/group scraping
- Any source behind a login
- Any source whose terms forbid automated access
