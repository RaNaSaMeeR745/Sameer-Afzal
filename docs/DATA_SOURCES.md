# DATA_SOURCES.md - Lead Source Registry for Scoutline

Every source must be verified against current official documentation and terms before any adapter is built. Verification date and findings are recorded here. Status values: candidate, verified, rejected, implemented.

## Local and general businesses

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| OpenStreetMap Overpass API | https://wiki.openstreetmap.org/wiki/Overpass_API | Read-only. User-Agent required. | Fair-use guidelines | Global | 2026-10-04 | implemented |
| Google Places API | Official | BYOK | Paid | Global | pending | candidate (BYOK) |
| Foursquare Places API | Official | BYOK | Free tier verify | Global | pending | candidate (BYOK) |
| Yelp Fusion | Official | Paid | Paid | Limited | pending | candidate (BYOK) |

## New business and funding signals

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| UK Companies House API | developer.company-information.service.gov.uk | Free API key | 600/5min | UK | 2026-10-04 | implemented |
| US SEC EDGAR | efts.sec.gov | User-Agent, no key | 10 req/s | US | 2026-10-04 | implemented |
| Certificate Transparency (crt.sh) | crt.sh | Public, no key | ~60/min historical | Global | 2026-10-04 | implemented |
| Product Hunt API | Official | Check terms | Verify | Global | pending | candidate |
| OpenCorporates | Official | Limited free | Limited | Multi | pending | candidate |

## Hiring signals

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| Hacker News (Algolia) | hn.algolia.com/api | Public, no key | Shared; back off on 429 | Global | 2026-10-04 | implemented |
| Adzuna API | developer.adzuna.com | Free keys; commercial licence caution | 25/min, 250/day, 2500/month | Multi | 2026-10-04 | implemented (licence caution) |
| RemoteOK / WWR / Jooble | Official | Check | Varies | Remote/multi | pending | candidate |

## Advertising signals

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| Meta Ad Library | graph.facebook.com ads_archive | Token + identity; no UI scraping | Graph 613 when limited | EU/UK commercial strongest | 2026-10-04 | implemented |
| Google Ads Transparency Center | No official API | Manual only | N/A | Global | 2026-10-04 | rejected |

## Agency discovery

| Source | URL / docs | Terms summary | Free tier / rate limit | Coverage | Verification date | Status |
|--------|------------|---------------|------------------------|----------|-------------------|--------|
| OSM office tags (advertising_agency, etc.) | wiki.openstreetmap.org Tag:office=advertising_agency | Same Overpass fair-use as other OSM queries | Fair-use | Global | 2026-10-04 | implemented |
| Brave Search API | brave.com/search/api | BYOK. Metered; monthly credit typical. Default terms restrict bulk storage of results unless plan grants storage rights. | Plan QPS + monthly credits (~$5 credit / ~1000 Search queries common) | Global | 2026-10-04 | implemented (BYOK) |
| Serper / SerpAPI | Official | BYOK alternatives | Varies | Global | pending | candidate (BYOK) |
| Clutch / Sortlist / DesignRush | Site terms | Automated access usually forbidden | N/A | Global | 2026-10-04 | rejected (terms forbid automated access) |

### OSM agency verification notes (2026-10-04)

- Adapter: `packages/sources/src/osm-agency.ts`
- Tags: office=advertising_agency, graphic_design, marketing, consulting

### Brave Search verification notes (2026-10-04)

- Endpoint: `https://api.search.brave.com/res/v1/web/search`
- Header: `X-Subscription-Token`
- Adapter: `packages/sources/src/brave-search.ts`
- Env: `BRAVE_SEARCH_API_KEY`
- Do not bulk-archive SERP JSON without a storage-rights plan

## Contact discovery and verification

Public contact pages on the entity's own site only. Optional BYOK enrichment.

## Explicitly excluded

- LinkedIn scraping
- Instagram or Facebook page/group scraping
- Clutch / Sortlist / DesignRush automated scraping
- Any source behind a login
- Any source whose terms forbid automated access
