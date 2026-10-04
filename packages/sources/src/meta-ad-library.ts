import type {
  DiscoverInput,
  DiscoverResult,
  SourceAdapter,
  SourceCandidate,
} from "./types.js";

const DEFAULT_VERSION = "v21.0";
const DEFAULT_BASE = "https://graph.facebook.com";
const USER_AGENT =
  "Scoutline/0.0.1 (lead discovery; +https://github.com/RaNaSaMeeR745/Sameer-Afzal)";

interface MetaAd {
  id?: string;
  page_name?: string;
  page_id?: string;
  ad_delivery_start_time?: string;
  ad_snapshot_url?: string;
  ad_creative_bodies?: string[];
  publisher_platforms?: string[];
}

interface MetaAdsArchiveResponse {
  data?: MetaAd[];
  error?: { message?: string; code?: number };
  paging?: { cursors?: { after?: string } };
}

export interface MetaAdLibraryAdapterOptions {
  accessToken: string;
  /** ISO country codes ads must have reached, e.g. ["GB", "DE"]. Required by Meta. */
  countries?: readonly string[];
  graphVersion?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
}

/**
 * Meta Ad Library API adapter (Graph API ads_archive).
 *
 * Access (verified 2026-10-04 against developers.facebook.com docs):
 * - Meta developer app + identity confirmation + access token required.
 * - Official endpoint: GET /{version}/ads_archive
 * - Required params: access_token, ad_reached_countries, and search_terms or search_page_ids.
 * - Commercial ad coverage via API is strongest for EU/UK (DSA). Outside those regions,
 *   results are often limited to political and issue ads depending on ad_type and policy.
 * - Rate limit errors return Graph API code 613; back off and retry.
 *
 * Do not scrape the Ad Library web UI. Use this official API only.
 */
export class MetaAdLibraryAdapter implements SourceAdapter {
  readonly id = "meta_ad_library";
  readonly displayName = "Meta Ad Library API";

  private readonly accessToken: string;
  private readonly countries: readonly string[];
  private readonly graphVersion: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;

  constructor(options: MetaAdLibraryAdapterOptions) {
    if (!options.accessToken) {
      throw new Error(
        "Meta Ad Library adapter requires accessToken (META_AD_LIBRARY_ACCESS_TOKEN)",
      );
    }
    this.accessToken = options.accessToken;
    this.countries = options.countries ?? ["GB"];
    this.graphVersion = options.graphVersion ?? DEFAULT_VERSION;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.userAgent = options.userAgent ?? USER_AGENT;
  }

  async discover(input: DiscoverInput): Promise<DiscoverResult> {
    const searchTerms = input.query?.trim();
    if (!searchTerms) {
      throw new Error(
        "Meta Ad Library discover requires query (search_terms)",
      );
    }

    const limit = Math.min(input.limit ?? 25, 100);
    const countriesJson = JSON.stringify([...this.countries]);
    const fields = [
      "id",
      "page_name",
      "page_id",
      "ad_delivery_start_time",
      "ad_snapshot_url",
      "ad_creative_bodies",
      "publisher_platforms",
    ].join(",");

    const params = new URLSearchParams({
      access_token: this.accessToken,
      search_terms: searchTerms,
      ad_reached_countries: countriesJson,
      ad_type: "ALL",
      ad_active_status: "ACTIVE",
      fields,
      limit: String(limit),
    });

    const endpoint = `${this.baseUrl}/${this.graphVersion}/ads_archive`;
    const url = `${endpoint}?${params.toString()}`;

    const response = await this.fetchImpl(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": this.userAgent,
      },
    });

    const bodyText = await response.text();
    let data: MetaAdsArchiveResponse;
    try {
      data = JSON.parse(bodyText) as MetaAdsArchiveResponse;
    } catch {
      throw new Error(
        `Meta Ad Library returned non-JSON (HTTP ${response.status}): ${bodyText.slice(0, 200)}`,
      );
    }

    if (data.error) {
      const code = data.error.code;
      if (code === 613 || response.status === 429) {
        throw new Error(
          "Meta Ad Library rate limited (Graph error 613 or HTTP 429). Back off and retry.",
        );
      }
      throw new Error(
        `Meta Ad Library error: ${data.error.message ?? "unknown"} (code ${code ?? "n/a"})`,
      );
    }

    if (!response.ok) {
      throw new Error(
        `Meta Ad Library request failed (HTTP ${response.status}): ${bodyText.slice(0, 200)}`,
      );
    }

    const ads = data.data ?? [];
    const candidates: SourceCandidate[] = [];
    const seen = new Set<string>();

    for (const ad of ads) {
      const candidate = mapMetaAd(ad);
      if (!candidate) {
        continue;
      }
      if (input.incorporatedSince && ad.ad_delivery_start_time) {
        const start = Date.parse(ad.ad_delivery_start_time);
        const since = Date.parse(input.incorporatedSince);
        if (!Number.isNaN(start) && !Number.isNaN(since) && start < since) {
          continue;
        }
      }
      const key = candidate.registryIds.meta_page_id ?? candidate.canonicalName;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      candidates.push(candidate);
    }

    return {
      candidates,
      queryMeta: {
        source: this.id,
        endpoint,
        fetchedAt: new Date().toISOString(),
        elementCount: ads.length,
      },
    };
  }
}

export function mapMetaAd(ad: MetaAd): SourceCandidate | null {
  const name = ad.page_name?.trim();
  if (!name) {
    return null;
  }

  const registryIds: Record<string, string> = {};
  if (ad.page_id) {
    registryIds.meta_page_id = String(ad.page_id);
  }
  if (ad.id) {
    registryIds.meta_ad_id = String(ad.id);
  }

  return {
    canonicalName: name,
    domain: null,
    country: null,
    city: null,
    category: "active_advertiser",
    lat: null,
    lon: null,
    registryIds,
    evidenceUrl: ad.ad_snapshot_url ?? null,
    signalType: "meta_active_ad",
    source: "meta_ad_library",
    raw: {
      ad_delivery_start_time: ad.ad_delivery_start_time,
      publisher_platforms: ad.publisher_platforms,
      creative_preview: ad.ad_creative_bodies?.[0]?.slice(0, 200),
    },
  };
}
