import {
  AdzunaAdapter,
  BraveSearchAdapter,
  CompaniesHouseAdapter,
  CrtShAdapter,
  EdgarAdapter,
  HnAlgoliaAdapter,
  MetaAdLibraryAdapter,
  OsmAgencyAdapter,
  OverpassAdapter,
  type SourceAdapter,
} from "@scoutline/sources";

/**
 * Resolve a source adapter by canonical id (matches each adapter's `.id`).
 * Aliases accept short names used in job payloads.
 */
export function getSourceAdapter(adapterId: string): SourceAdapter {
  const id = normalizeAdapterId(adapterId);

  switch (id) {
    case "openstreetmap_overpass":
      return new OverpassAdapter();
    case "openstreetmap_agency":
      return new OsmAgencyAdapter();
    case "uk_companies_house": {
      const key = process.env.COMPANIES_HOUSE_API_KEY;
      if (!key) {
        throw new Error("COMPANIES_HOUSE_API_KEY is required for uk_companies_house");
      }
      return new CompaniesHouseAdapter({ apiKey: key });
    }
    case "us_edgar":
      return new EdgarAdapter();
    case "crtsh":
      return new CrtShAdapter();
    case "hn_algolia":
      return new HnAlgoliaAdapter();
    case "adzuna_jobs": {
      const appId = process.env.ADZUNA_APP_ID;
      const appKey = process.env.ADZUNA_APP_KEY;
      if (!appId || !appKey) {
        throw new Error("ADZUNA_APP_ID and ADZUNA_APP_KEY are required for adzuna_jobs");
      }
      return new AdzunaAdapter({ appId, appKey });
    }
    case "meta_ad_library": {
      const token = process.env.META_AD_LIBRARY_ACCESS_TOKEN;
      if (!token) {
        throw new Error(
          "META_AD_LIBRARY_ACCESS_TOKEN is required for meta_ad_library",
        );
      }
      return new MetaAdLibraryAdapter({ accessToken: token });
    }
    case "brave_search": {
      const key = process.env.BRAVE_SEARCH_API_KEY;
      if (!key) {
        throw new Error("BRAVE_SEARCH_API_KEY is required for brave_search");
      }
      return new BraveSearchAdapter({ apiKey: key });
    }
    default:
      throw new Error(`Unknown source adapter: ${adapterId}`);
  }
}

function normalizeAdapterId(raw: string): string {
  const aliases: Record<string, string> = {
    overpass: "openstreetmap_overpass",
    osm: "openstreetmap_overpass",
    osm_agency: "openstreetmap_agency",
    companies_house: "uk_companies_house",
    edgar: "us_edgar",
    adzuna: "adzuna_jobs",
    hn: "hn_algolia",
    meta: "meta_ad_library",
    brave: "brave_search",
  };
  return aliases[raw] ?? raw;
}

export const SOURCE_ADAPTER_IDS = [
  "openstreetmap_overpass",
  "openstreetmap_agency",
  "uk_companies_house",
  "us_edgar",
  "crtsh",
  "hn_algolia",
  "adzuna_jobs",
  "meta_ad_library",
  "brave_search",
] as const;

export type SourceAdapterId = (typeof SOURCE_ADAPTER_IDS)[number];
