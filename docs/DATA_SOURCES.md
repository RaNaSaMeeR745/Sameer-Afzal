# DATA_SOURCES.md - Lead Source Registry for Scoutline

Every source must be verified against current official documentation and terms before any adapter is built. Verification date and findings are recorded here. Status values: candidate, verified, rejected, implemented.

## Local and general businesses

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| OpenStreetMap Overpass API | https://wiki.openstreetmap.org/wiki/Overpass_API | Read-only public instances. User-Agent required. | Fair-use guidelines apply | Global | 2026-10-04 | implemented |
| Google Places API | Official Google docs | BYOK | Paid | Global | pending | candidate (BYOK) |
| Foursquare Places API | Official docs | BYOK | Free tier verify | Global | pending | candidate (BYOK) |
| Yelp Fusion | Official docs | Paid | Paid | Limited | pending | candidate (BYOK) |

## New business and funding signals

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| UK Companies House API | https://developer.company-information.service.gov.uk/ | Free API key, Basic auth | 600/5min | UK | 2026-10-04 | implemented |
| US SEC EDGAR | efts.sec.gov | User-Agent + contact, no key | 10 req/s | US | 2026-10-04 | implemented |
| Certificate Transparency (crt.sh) | https://crt.sh/?output=json | Public CT search, no key | ~60 req/min historical | Global | 2026-10-04 | implemented |
| Product Hunt API | Official docs | Check terms | Free tier verify | Global | pending | candidate |
| OpenCorporates | Official docs | Limited free | Limited | Multi | pending | candidate |

## Hiring signals

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| Hacker News (Algolia) | https://hn.algolia.com/api | Official public HN search API. No key. Shared index; use modest volume. | Public shared service; back off on 429 | Global remote | 2026-10-04 | implemented |
| Adzuna API | https://developer.adzuna.com/docs/terms_of_service | Free keys for permitted uses. Commercial/government/academic beyond 14-day trial may need written licence. | 25/min, 250/day, 1000/week, 2500/month default | Multi-country | 2026-10-04 | implemented (licence caution) |
| RemoteOK API | Official | Check | Free | Remote | pending | candidate |
| We Work Remotely RSS | Public RSS | Fair use | Free | Remote | pending | candidate |
| Jooble API | Official | Free keys | Free tier | Multi | pending | candidate |

### HN Algolia verification notes (2026-10-04)

- Endpoint: `https://hn.algolia.com/api/v1/search`
- Adapter: `packages/sources/src/hn-algolia.ts`
- Filters stories with hiring language; extracts company from title patterns.

### Adzuna verification notes (2026-10-04)

- Terms: developer.adzuna.com Terms of Service.
- Adapter: `packages/sources/src/adzuna.ts`
- Requires `ADZUNA_APP_ID` and `ADZUNA_APP_KEY`.
- Production commercial use beyond trial may require contacting Adzuna for a licence.

## Advertising signals

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| Meta Ad Library | Official API docs | Regional | Free where available | Regional | pending Phase 9 | candidate |
| Google Ads Transparency Center | No official API | Manual only | N/A | Global | pending | rejected |

## Agency discovery

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| Brave Search / Serper / SerpAPI | Official | BYOK | Varies | Global | pending Phase 10 | candidate (BYOK) |
| OSM marketing categories | Overpass | Same as OSM | Free | Global | pending | candidate |
| Clutch / Sortlist / DesignRush | Site terms | Automated access often forbidden | N/A | Global | pending | candidate (manual only) |

## Contact discovery and verification

Public contact pages on the entity's own site only. Optional BYOK enrichment.

## Explicitly excluded

- LinkedIn scraping
- Instagram or Facebook page/group scraping
- Any source behind a login
- Any source whose terms forbid automated access
