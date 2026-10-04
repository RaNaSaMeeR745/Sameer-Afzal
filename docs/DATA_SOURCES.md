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
| Hacker News (Algolia) | https://hn.algolia.com/api | Official public HN search API. No key. | Shared service; back off on 429 | Global remote | 2026-10-04 | implemented |
| Adzuna API | https://developer.adzuna.com/docs/terms_of_service | Free keys; commercial beyond trial may need licence | 25/min, 250/day, 2500/month | Multi-country | 2026-10-04 | implemented (licence caution) |
| RemoteOK API | Official | Check | Free | Remote | pending | candidate |
| We Work Remotely RSS | Public RSS | Fair use | Free | Remote | pending | candidate |
| Jooble API | Official | Free keys | Free tier | Multi | pending | candidate |

## Advertising signals

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| Meta Ad Library | https://developers.facebook.com/docs/graph-api/reference/ads_archive/ | Official Graph API ads_archive. Requires Meta app, identity confirmation, access token. Do not scrape the web UI. | Graph rate limits (error 613 when exceeded); typical development quota is modest (~hundreds/hour). Back off on 613/429. | Commercial ads strongest in EU/UK (DSA). Outside those regions API results often limited to political/issue ads. | 2026-10-04 | implemented |
| Google Ads Transparency Center | No official API | Manual only | N/A | Global | pending | rejected |

### Meta Ad Library verification notes (2026-10-04)

- Endpoint: `GET https://graph.facebook.com/{version}/ads_archive`
- Required: access_token, ad_reached_countries, search_terms (or search_page_ids)
- Adapter: `packages/sources/src/meta-ad-library.ts`
- Maps active advertisers (page_name) to candidates with ad snapshot evidence URL
- Env: `META_AD_LIBRARY_ACCESS_TOKEN` (name only in .env.example)
- Identity verification is a human/process step before tokens work; not automatable in CI

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
