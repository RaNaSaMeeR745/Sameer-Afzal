import type { Job } from "bullmq";
import {
  OverpassAdapter,
  OsmAgencyAdapter,
  CompaniesHouseAdapter,
  EdgarAdapter,
  CrtShAdapter,
  HnAlgoliaAdapter,
  AdzunaAdapter,
  MetaAdLibraryAdapter,
  BraveSearchAdapter,
  type SourceAdapter,
  type DiscoverResult,
} from "@scoutline/sources";
import type { DiscoverJobData } from "../queues.js";

export interface DiscoverJobResult {
  tenantId: string;
  searchId: string;
  sourceId: string;
  candidateCount: number;
  candidates: DiscoverResult["candidates"];
  queryMeta: DiscoverResult["queryMeta"];
}

/** Build a source adapter from env and job sourceId. */
export function createAdapter(sourceId: string): SourceAdapter {
  switch (sourceId) {
    case "openstreetmap_overpass":
      return new OverpassAdapter();
    case "openstreetmap_agency":
      return new OsmAgencyAdapter();
    case "uk_companies_house": {
      const key = process.env.COMPANIES_HOUSE_API_KEY;
      if (!key) {
        throw new Error("COMPANIES_HOUSE_API_KEY required for uk_companies_house");
      }
      return new CompaniesHouseAdapter({ apiKey: key });
    }
    case "us_sec_edgar":
      return new EdgarAdapter();
    case "certificate_transparency_crtsh":
      return new CrtShAdapter();
    case "hackernews_algolia":
      return new HnAlgoliaAdapter();
    case "adzuna_jobs": {
      const appId = process.env.ADZUNA_APP_ID;
      const appKey = process.env.ADZUNA_APP_KEY;
      if (!appId || !appKey) {
        throw new Error("ADZUNA_APP_ID and ADZUNA_APP_KEY required for adzuna_jobs");
      }
      return new AdzunaAdapter({ appId, appKey });
    }
    case "meta_ad_library": {
      const token = process.env.META_AD_LIBRARY_ACCESS_TOKEN;
      if (!token) {
        throw new Error("META_AD_LIBRARY_ACCESS_TOKEN required for meta_ad_library");
      }
      return new MetaAdLibraryAdapter({ accessToken: token });
    }
    case "brave_search": {
      const key = process.env.BRAVE_SEARCH_API_KEY;
      if (!key) {
        throw new Error("BRAVE_SEARCH_API_KEY required for brave_search");
      }
      return new BraveSearchAdapter({ apiKey: key });
    }
    default:
      throw new Error(`Unknown sourceId: ${sourceId}`);
  }
}

/**
 * Discover job processor: runs a source adapter and returns normalized candidates.
 * Persistence to entities/leads is handled by a later commit once the DB write path is wired.
 */
export async function processDiscoverJob(
  job: Job<DiscoverJobData>,
): Promise<DiscoverJobResult> {
  const data = job.data;
  const adapter = createAdapter(data.sourceId);

  await job.updateProgress(10);

  const result = await adapter.discover({
    query: data.query,
    categories: data.categories,
    bbox: data.bbox,
    incorporatedSince: data.incorporatedSince,
    limit: data.limit,
  });

  await job.updateProgress(100);

  return {
    tenantId: data.tenantId,
    searchId: data.searchId,
    sourceId: data.sourceId,
    candidateCount: result.candidates.length,
    candidates: result.candidates,
    queryMeta: result.queryMeta,
  };
}
