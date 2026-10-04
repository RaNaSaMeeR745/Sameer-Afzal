import type {
  DiscoverInput,
  DiscoverResult,
  SourceAdapter,
  SourceCandidate,
} from "./types.js";

const DEFAULT_BASE = "https://api.company-information.service.gov.uk";
const USER_AGENT =
  "Scoutline/0.0.1 (lead discovery; +https://github.com/RaNaSaMeeR745/Sameer-Afzal)";

interface ChSearchItem {
  company_number?: string;
  title?: string;
  company_status?: string;
  company_type?: string;
  date_of_creation?: string;
  address?: {
    locality?: string;
    country?: string;
    address_line_1?: string;
  };
  links?: { self?: string };
}

interface ChSearchResponse {
  items?: ChSearchItem[];
  total_results?: number;
}

export interface CompaniesHouseAdapterOptions {
  apiKey: string;
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
}

/**
 * UK Companies House Public Data API adapter.
 * Free with registered API key. Rate limit: 600 requests per 5 minutes.
 * Auth: HTTP Basic with API key as username and empty password.
 * Verified against developer.company-information.service.gov.uk on 2026-10-04.
 */
export class CompaniesHouseAdapter implements SourceAdapter {
  readonly id = "uk_companies_house";
  readonly displayName = "UK Companies House Public Data API";

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;

  constructor(options: CompaniesHouseAdapterOptions) {
    if (!options.apiKey) {
      throw new Error(
        "Companies House adapter requires apiKey (COMPANIES_HOUSE_API_KEY)",
      );
    }
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.userAgent = options.userAgent ?? USER_AGENT;
  }

  async discover(input: DiscoverInput): Promise<DiscoverResult> {
    const limit = Math.min(input.limit ?? 20, 100);
    let endpoint: string;
    let url: string;

    if (input.incorporatedSince) {
      const params = new URLSearchParams({
        incorporated_from: input.incorporatedSince,
        size: String(limit),
      });
      if (input.query) {
        params.set("company_name_includes", input.query);
      }
      endpoint = `${this.baseUrl}/advanced-search/companies`;
      url = `${endpoint}?${params.toString()}`;
    } else {
      const q = input.query?.trim();
      if (!q) {
        throw new Error(
          "Companies House discover requires query or incorporatedSince",
        );
      }
      const params = new URLSearchParams({
        q,
        items_per_page: String(limit),
      });
      endpoint = `${this.baseUrl}/search/companies`;
      url = `${endpoint}?${params.toString()}`;
    }

    const auth = Buffer.from(`${this.apiKey}:`).toString("base64");
    const response = await this.fetchImpl(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "User-Agent": this.userAgent,
      },
    });

    if (response.status === 429) {
      throw new Error(
        "Companies House rate limited (HTTP 429). Limit is 600 requests per 5 minutes. Wait for the window to reset.",
      );
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Companies House request failed (HTTP ${response.status}): ${body.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as ChSearchResponse;
    const items = data.items ?? [];
    const candidates: SourceCandidate[] = [];

    for (const item of items) {
      const candidate = mapChItem(item);
      if (candidate) {
        candidates.push(candidate);
      }
    }

    return {
      candidates,
      queryMeta: {
        source: this.id,
        endpoint,
        fetchedAt: new Date().toISOString(),
        elementCount: items.length,
      },
    };
  }
}

function mapChItem(item: ChSearchItem): SourceCandidate | null {
  const name = item.title?.trim();
  const number = item.company_number?.trim();
  if (!name || !number) {
    return null;
  }

  return {
    canonicalName: name,
    domain: null,
    country: item.address?.country ?? "GB",
    city: item.address?.locality ?? null,
    category: item.company_type ?? null,
    lat: null,
    lon: null,
    registryIds: { companies_house: number },
    evidenceUrl: `https://find-and-update.company-information.service.gov.uk/company/${number}`,
    signalType: "uk_new_or_existing_company",
    source: "uk_companies_house",
    raw: {
      company_number: number,
      company_status: item.company_status,
      date_of_creation: item.date_of_creation,
      company_type: item.company_type,
    },
  };
}
