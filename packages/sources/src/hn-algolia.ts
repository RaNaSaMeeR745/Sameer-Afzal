import type {
  DiscoverInput,
  DiscoverResult,
  SourceAdapter,
  SourceCandidate,
} from "./types.js";

const DEFAULT_ENDPOINT = "https://hn.algolia.com/api/v1/search";
const USER_AGENT =
  "Scoutline/0.0.1 (lead discovery; +https://github.com/RaNaSaMeeR745/Sameer-Afzal)";

interface HnHit {
  objectID?: string;
  title?: string;
  url?: string | null;
  author?: string;
  created_at?: string;
  created_at_i?: number;
  points?: number;
  num_comments?: number;
  story_text?: string | null;
}

interface HnSearchResponse {
  hits?: HnHit[];
  nbHits?: number;
}

export interface HnAlgoliaAdapterOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
}

/**
 * Hacker News search via the public Algolia HN API (hn.algolia.com).
 * No API key. Used to find hiring posts that signal marketing/SEO demand.
 * Verified as the official HN search API surface on 2026-10-04.
 * Be polite: modest volume; Algolia-backed public indexes are shared.
 */
export class HnAlgoliaAdapter implements SourceAdapter {
  readonly id = "hackernews_algolia";
  readonly displayName = "Hacker News (Algolia Search API)";

  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;

  constructor(options: HnAlgoliaAdapterOptions = {}) {
    this.endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.userAgent = options.userAgent ?? USER_AGENT;
  }

  async discover(input: DiscoverInput): Promise<DiscoverResult> {
    const baseQuery = input.query?.trim() || "hiring";
    const roleHints = (input.categories ?? []).join(" ");
    const q = roleHints ? `${baseQuery} ${roleHints}` : baseQuery;
    const limit = Math.min(input.limit ?? 20, 50);

    const params = new URLSearchParams({
      query: q,
      tags: "story",
      hitsPerPage: String(limit),
    });

    if (input.incorporatedSince) {
      const sinceSec = Math.floor(Date.parse(input.incorporatedSince) / 1000);
      if (!Number.isNaN(sinceSec)) {
        params.set("numericFilters", `created_at_i>${sinceSec}`);
      }
    }

    const url = `${this.endpoint}?${params.toString()}`;
    const response = await this.fetchImpl(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": this.userAgent,
      },
    });

    if (response.status === 429) {
      throw new Error(
        "HN Algolia rate limited (HTTP 429). Reduce request rate and retry later.",
      );
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `HN Algolia request failed (HTTP ${response.status}): ${body.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as HnSearchResponse;
    const hits = data.hits ?? [];
    const candidates: SourceCandidate[] = [];
    const seen = new Set<string>();

    for (const hit of hits) {
      const candidate = mapHnHit(hit);
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
        elementCount: hits.length,
      },
    };
  }
}

/** Map an HN story hit to a company-like candidate when possible. */
export function mapHnHit(hit: HnHit): SourceCandidate | null {
  const title = hit.title?.trim();
  if (!title) {
    return null;
  }

  const lower = title.toLowerCase();
  if (!lower.includes("hiring") && !lower.includes("hire")) {
    return null;
  }

  const companyName = extractCompanyFromTitle(title);
  if (!companyName) {
    return null;
  }

  let domain: string | null = null;
  if (hit.url) {
    try {
      domain = new URL(hit.url).hostname.replace(/^www\./, "");
    } catch {
      domain = null;
    }
  }

  const objectId = hit.objectID ?? "";
  const evidenceUrl = objectId
    ? `https://news.ycombinator.com/item?id=${objectId}`
    : hit.url ?? null;

  return {
    canonicalName: companyName,
    domain,
    country: null,
    city: null,
    category: "hiring_post",
    lat: null,
    lon: null,
    registryIds: objectId ? { hn_object_id: objectId } : {},
    evidenceUrl,
    signalType: "hn_hiring_story",
    source: "hackernews_algolia",
    raw: {
      title,
      author: hit.author,
      created_at: hit.created_at,
      points: hit.points,
      url: hit.url,
    },
  };
}

/**
 * Best-effort company name from common HN hiring title patterns.
 * Examples: "Acme (YC W24) is hiring...", "Acme is hiring a..."
 */
export function extractCompanyFromTitle(title: string): string | null {
  const patterns = [
    /^(.+?)\s+\(YC[^)]*\)\s+is hiring/i,
    /^(.+?)\s+is hiring/i,
    /^Hiring at\s+(.+?)(?:\s+[-–|]|$)/i,
    /^(.+?)\s+hiring\s+/i,
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match?.[1]) {
      const name = match[1].trim();
      if (name.length >= 2 && name.length <= 80) {
        return name;
      }
    }
  }
  return null;
}
