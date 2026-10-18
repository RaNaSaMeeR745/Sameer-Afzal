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
 * Resolve a source adapter by id using environment credentials where required.
 */
export function getSourceAdapter(adapterId: string): SourceAdapter {
  switch (adapterId) {
    case "overpass":
      return new OverpassAdapter();
    case "osm_agency":
      return new OsmAgencyAdapter();
    case "companies_house": {
      const key = process.env.COMPANIES_HOUSE_API_KEY;
      if (!key) {
        throw new Error("COMPANIES_HOUSE_API_KEY is required for companies_house");
      }
      return new CompaniesHouseAdapter({ apiKey: key });
    }
    case "edgar":
      return new EdgarAdapter();
    case "crtsh":
      return new CrtShAdapter();
    case "hn_algolia":
      return new HnAlgoliaAdapter();
    case "adzuna": {
      const appId = process.env.ADZUNA_APP_ID;
      const appKey = process.env.ADZUNA_APP_KEY;
      if (!appId || !appKey) {
        throw new Error("ADZUNA_APP_ID and ADZUNA_APP_KEY are required for adzuna");
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

export const SOURCE_ADAPTER_IDS = [
  "overpass",
  "osm_agency",
  "companies_house",
  "edgar",
  "crtsh",
  "hn_algolia",
  "adzuna",
  "meta_ad_library",
  "brave_search",
] as const;

export type SourceAdapterId = (typeof SOURCE_ADAPTER_IDS)[number];
