import type {
  DiscoverInput,
  DiscoverResult,
  SourceAdapter,
  SourceCandidate,
} from "./types.js";

const DEFAULT_ENDPOINT = "https://efts.sec.gov/LATEST/search-index";
const USER_AGENT =
  "Scoutline/0.0.1 lead-discovery contact@scoutline.example";

interface EdgarHit {
  _id?: string;
  _source?: {
    display_names?: string[];
    entity_name?: string;
    file_date?: string;
    form?: string;
    ciks?: string[];
    tickers?: string[];
    period_ending?: string;
  };
}

interface EdgarSearchResponse {
  hits?: {
    hits?: EdgarHit[];
    total?: { value?: number } | number;
  };
}

export interface EdgarAdapterOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
}

/**
 * SEC EDGAR full-text search adapter (efts.sec.gov).
 * Free, no API key. Fair access: User-Agent with contact required,
 * max 10 requests per second. Verified against SEC fair-access guidance
 * and public EDGAR JSON endpoints documentation on 2026-10-04.
 */
export class EdgarAdapter implements SourceAdapter {
  readonly id = "us_sec_edgar";
  readonly displayName = "US SEC EDGAR Full-Text Search";

  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;

  constructor(options: EdgarAdapterOptions = {}) {
    this.endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.userAgent = options.userAgent ?? USER_AGENT;
  }

  async discover(input: DiscoverInput): Promise<DiscoverResult> {
    const q = input.query?.trim();
    if (!q) {
      throw new Error("EDGAR discover requires a query string");
    }

    const limit = Math.min(input.limit ?? 20, 100);
    const params = new URLSearchParams({
      q,
      forms: "10-K,10-Q,8-K,S-1",
      from: "0",
      size: String(limit),
    });

    if (input.incorporatedSince) {
      params.set("dateRange", "custom");
      params.set("startdt", input.incorporatedSince);
      params.set("enddt", new Date().toISOString().slice(0, 10));
    }

    const url = `${this.endpoint}?${params.toString()}`;
    const response = await this.fetchImpl(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": this.userAgent,
      },
    });

    if (response.status === 403 || response.status === 429) {
      throw new Error(
        `EDGAR access limited (HTTP ${response.status}). Stay under 10 requests per second and send a User-Agent with contact email.`,
      );
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `EDGAR request failed (HTTP ${response.status}): ${body.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as EdgarSearchResponse;
    const hits = data.hits?.hits ?? [];
    const candidates: SourceCandidate[] = [];
    const seen = new Set<string>();

    for (const hit of hits) {
      const candidate = mapEdgarHit(hit);
      if (!candidate) {
        continue;
      }
      const key = candidate.registryIds.cik ?? candidate.canonicalName;
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

function mapEdgarHit(hit: EdgarHit): SourceCandidate | null {
  const src = hit._source;
  if (!src) {
    return null;
  }

  const name =
    src.display_names?.[0]?.replace(/\s*\(CIK\s*\d+\)\s*$/i, "").trim() ??
    src.entity_name?.trim();
  if (!name) {
    return null;
  }

  const cik = src.ciks?.[0] ?? null;
  const ticker = src.tickers?.[0] ?? null;
  const registryIds: Record<string, string> = {};
  if (cik) {
    registryIds.cik = cik.padStart(10, "0");
  }
  if (ticker) {
    registryIds.ticker = ticker;
  }

  const evidenceUrl = cik
    ? `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik.padStart(10, "0")}`
    : null;

  return {
    canonicalName: name,
    domain: null,
    country: "US",
    city: null,
    category: src.form ?? null,
    lat: null,
    lon: null,
    registryIds,
    evidenceUrl,
    signalType: "us_sec_filing",
    source: "us_sec_edgar",
    raw: {
      form: src.form,
      file_date: src.file_date,
      ciks: src.ciks,
      tickers: src.tickers,
    },
  };
}
