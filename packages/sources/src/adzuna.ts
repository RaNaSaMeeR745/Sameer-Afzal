import type {
  DiscoverInput,
  DiscoverResult,
  SourceAdapter,
  SourceCandidate,
} from "./types.js";

const DEFAULT_BASE = "https://api.adzuna.com/v1/api";
const USER_AGENT =
  "Scoutline/0.0.1 (lead discovery; +https://github.com/RaNaSaMeeR745/Sameer-Afzal)";

interface AdzunaJob {
  id?: string;
  title?: string;
  description?: string;
  created?: string;
  company?: { display_name?: string };
  location?: { display_name?: string; area?: string[] };
  redirect_url?: string;
  category?: { label?: string };
}

interface AdzunaSearchResponse {
  results?: AdzunaJob[];
  count?: number;
}

export interface AdzunaAdapterOptions {
  appId: string;
  appKey: string;
  /** ISO country path segment, e.g. gb, us, de. */
  country?: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
}

/**
 * Adzuna Jobs API adapter for hiring signals.
 * Free developer keys: default limits 25/min, 250/day, 1000/week, 2500/month
 * (developer.adzuna.com terms, verified 2026-10-04).
 * Commercial, government, and academic use beyond a 14-day trial may require
 * a written licence agreement per Adzuna Terms of Service. Do not ignore that.
 */
export class AdzunaAdapter implements SourceAdapter {
  readonly id = "adzuna_jobs";
  readonly displayName = "Adzuna Jobs API";

  private readonly appId: string;
  private readonly appKey: string;
  private readonly country: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;

  constructor(options: AdzunaAdapterOptions) {
    if (!options.appId || !options.appKey) {
      throw new Error(
        "Adzuna adapter requires appId and appKey (ADZUNA_APP_ID, ADZUNA_APP_KEY)",
      );
    }
    this.appId = options.appId;
    this.appKey = options.appKey;
    this.country = options.country ?? "gb";
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.userAgent = options.userAgent ?? USER_AGENT;
  }

  async discover(input: DiscoverInput): Promise<DiscoverResult> {
    const what =
      input.query?.trim() ||
      (input.categories?.length
        ? input.categories.join(" ")
        : "marketing SEO advertising");
    const page = 1;
    const resultsPerPage = Math.min(input.limit ?? 20, 50);

    const params = new URLSearchParams({
      app_id: this.appId,
      app_key: this.appKey,
      what,
      results_per_page: String(resultsPerPage),
      sort_by: "date",
    });

    const endpoint = `${this.baseUrl}/jobs/${this.country}/search/${page}`;
    const url = `${endpoint}?${params.toString()}`;

    const response = await this.fetchImpl(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": this.userAgent,
      },
    });

    if (response.status === 429) {
      throw new Error(
        "Adzuna rate limited (HTTP 429). Default free limits are 25/min and 250/day.",
      );
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Adzuna request failed (HTTP ${response.status}): ${body.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as AdzunaSearchResponse;
    const jobs = data.results ?? [];
    const candidates: SourceCandidate[] = [];
    const seen = new Set<string>();

    for (const job of jobs) {
      const candidate = mapAdzunaJob(job);
      if (!candidate) {
        continue;
      }
      const key = candidate.canonicalName.toLowerCase();
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
        elementCount: jobs.length,
      },
    };
  }
}

export function mapAdzunaJob(job: AdzunaJob): SourceCandidate | null {
  const company = job.company?.display_name?.trim();
  if (!company) {
    return null;
  }

  const location = job.location?.display_name ?? null;
  const city = job.location?.area?.slice(-1)[0] ?? location;

  return {
    canonicalName: company,
    domain: null,
    country: null,
    city,
    category: job.category?.label ?? job.title ?? "job_posting",
    lat: null,
    lon: null,
    registryIds: job.id ? { adzuna: String(job.id) } : {},
    evidenceUrl: job.redirect_url ?? null,
    signalType: "job_board_hiring",
    source: "adzuna_jobs",
    raw: {
      title: job.title,
      created: job.created,
      location,
    },
  };
}
