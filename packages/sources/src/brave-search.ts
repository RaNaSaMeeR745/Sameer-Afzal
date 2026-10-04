import type {
  DiscoverInput,
  DiscoverResult,
  SourceAdapter,
  SourceCandidate,
} from "./types.js";

const DEFAULT_ENDPOINT = "https://api.search.brave.com/res/v1/web/search";
const USER_AGENT =
  "Scoutline/0.0.1 (lead discovery; +https://github.com/RaNaSaMeeR745/Sameer-Afzal)";

interface BraveWebResult {
  title?: string;
  url?: string;
  description?: string;
  profile?: { name?: string; long_name?: string };
}

interface BraveSearchResponse {
  web?: { results?: BraveWebResult[] };
}

export interface BraveSearchAdapterOptions {
  apiKey: string;
  endpoint?: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
  /** Default country for results (ISO 2-letter). */
  country?: string;
}

/**
 * Brave Search API adapter for agency and competitor discovery (BYOK).
 *
 * Verified 2026-10-04 against brave.com/search/api and API dashboard docs:
 * - Auth: X-Subscription-Token header
 * - Endpoint: GET https://api.search.brave.com/res/v1/web/search
 * - Pricing: metered; plans include monthly credit (about $5 / ~1000 Search queries).
 * - Storage: default terms restrict caching results beyond transient use unless the
 *   plan grants storage rights. Adapter returns candidates only; do not bulk-archive
 *   raw SERP payloads without a plan that allows it.
 * - Clutch/Sortlist/DesignRush are not scraped; search only finds public web pages.
 */
export class BraveSearchAdapter implements SourceAdapter {
  readonly id = "brave_search";
  readonly displayName = "Brave Search API (BYOK)";

  private readonly apiKey: string;
  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;
  private readonly country: string;

  constructor(options: BraveSearchAdapterOptions) {
    if (!options.apiKey) {
      throw new Error(
        "Brave Search adapter requires apiKey (BRAVE_SEARCH_API_KEY)",
      );
    }
    this.apiKey = options.apiKey;
    this.endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.userAgent = options.userAgent ?? USER_AGENT;
    this.country = options.country ?? "US";
  }

  async discover(input: DiscoverInput): Promise<DiscoverResult> {
    const q = input.query?.trim();
    if (!q) {
      throw new Error(
        "Brave Search discover requires a query (e.g. marketing agency Austin)",
      );
    }

    const count = Math.min(input.limit ?? 10, 20);
    const params = new URLSearchParams({
      q,
      count: String(count),
      country: this.country,
    });

    const url = `${this.endpoint}?${params.toString()}`;
    const response = await this.fetchImpl(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": this.apiKey,
        "User-Agent": this.userAgent,
      },
    });

    if (response.status === 429) {
      throw new Error(
        "Brave Search rate limited (HTTP 429). Respect plan QPS and monthly credits.",
      );
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Brave Search request failed (HTTP ${response.status}): ${body.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as BraveSearchResponse;
    const results = data.web?.results ?? [];
    const candidates: SourceCandidate[] = [];
    const seen = new Set<string>();

    for (const row of results) {
      const candidate = mapBraveResult(row);
      if (!candidate) {
        continue;
      }
      const key = candidate.domain ?? candidate.canonicalName;
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
        endpoint: this.endpoint,
        fetchedAt: new Date().toISOString(),
        elementCount: results.length,
      },
    };
  }
}

export function mapBraveResult(row: BraveWebResult): SourceCandidate | null {
  if (!row.url || !row.title) {
    return null;
  }

  let domain: string | null = null;
  try {
    domain = new URL(row.url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }

  const name =
    row.profile?.name?.trim() ||
    row.title.replace(/\s*[|\-–].*$/, "").trim() ||
    domain;

  if (!name) {
    return null;
  }

  return {
    canonicalName: name,
    domain,
    country: null,
    city: null,
    category: "web_search_result",
    lat: null,
    lon: null,
    registryIds: domain ? { domain } : {},
    evidenceUrl: row.url,
    signalType: "web_search_agency_or_business",
    source: "brave_search",
    raw: {
      title: row.title,
      description: row.description?.slice(0, 300),
    },
  };
}
