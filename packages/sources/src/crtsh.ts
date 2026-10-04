import type {
  DiscoverInput,
  DiscoverResult,
  SourceAdapter,
  SourceCandidate,
} from "./types.js";

const DEFAULT_ENDPOINT = "https://crt.sh/";
const USER_AGENT =
  "Scoutline/0.0.1 (lead discovery; +https://github.com/RaNaSaMeeR745/Sameer-Afzal)";

/** crt.sh JSON row (subset of fields returned with output=json). */
export interface CrtShRow {
  id?: number;
  issuer_name?: string;
  common_name?: string;
  name_value?: string;
  entry_timestamp?: string;
  not_before?: string;
  not_after?: string;
  serial_number?: string;
}

export interface CrtShAdapterOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
}

/**
 * Certificate Transparency search via crt.sh.
 * Public, no API key. Query: GET /?q=...&output=json
 * Historical fair-use throttle reported by operators: about 60 requests per IP per minute.
 * Expect intermittent 502/503 under load; callers should back off.
 * Verified against crt.sh and public operator notes on 2026-10-04.
 */
export class CrtShAdapter implements SourceAdapter {
  readonly id = "certificate_transparency_crtsh";
  readonly displayName = "Certificate Transparency (crt.sh)";

  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;

  constructor(options: CrtShAdapterOptions = {}) {
    this.endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.userAgent = options.userAgent ?? USER_AGENT;
  }

  async discover(input: DiscoverInput): Promise<DiscoverResult> {
    const q = input.query?.trim();
    if (!q) {
      throw new Error("crt.sh discover requires a query (domain or organization)");
    }

    const params = new URLSearchParams({
      q,
      output: "json",
    });
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
        "crt.sh rate limited (HTTP 429). Stay near or under 60 requests per minute per IP and back off.",
      );
    }

    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error(
        `crt.sh temporarily unavailable (HTTP ${response.status}). Retry with backoff.`,
      );
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `crt.sh request failed (HTTP ${response.status}): ${body.slice(0, 200)}`,
      );
    }

    const rows = (await response.json()) as CrtShRow[];
    if (!Array.isArray(rows)) {
      throw new Error("crt.sh returned unexpected JSON (expected an array)");
    }

    const since = input.incorporatedSince
      ? Date.parse(input.incorporatedSince)
      : null;
    const limit = input.limit ?? 50;
    const candidates: SourceCandidate[] = [];
    const seen = new Set<string>();

    for (const row of rows) {
      if (since !== null && !Number.isNaN(since)) {
        const notBefore = row.not_before ? Date.parse(row.not_before) : NaN;
        if (!Number.isNaN(notBefore) && notBefore < since) {
          continue;
        }
      }

      const mapped = mapCrtShRow(row);
      for (const candidate of mapped) {
        const key = candidate.domain ?? candidate.canonicalName;
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        candidates.push(candidate);
        if (candidates.length >= limit) {
          break;
        }
      }
      if (candidates.length >= limit) {
        break;
      }
    }

    return {
      candidates,
      queryMeta: {
        source: this.id,
        endpoint: this.endpoint,
        fetchedAt: new Date().toISOString(),
        elementCount: rows.length,
      },
    };
  }
}

/** Extract registrable-looking hostnames from a crt.sh row. */
export function mapCrtShRow(row: CrtShRow): SourceCandidate[] {
  const names = new Set<string>();
  if (row.common_name) {
    names.add(row.common_name.trim().toLowerCase());
  }
  if (row.name_value) {
    for (const part of row.name_value.split(/\n/)) {
      const n = part.trim().toLowerCase();
      if (n) {
        names.add(n);
      }
    }
  }

  const out: SourceCandidate[] = [];
  for (const name of names) {
    if (name.startsWith("*.")) {
      continue;
    }
    if (!looksLikeHostname(name)) {
      continue;
    }

    const evidenceUrl =
      row.id !== undefined
        ? `https://crt.sh/?id=${row.id}`
        : `https://crt.sh/?q=${encodeURIComponent(name)}`;

    out.push({
      canonicalName: name,
      domain: name,
      country: null,
      city: null,
      category: "tls_certificate",
      lat: null,
      lon: null,
      registryIds: row.id !== undefined ? { crtsh: String(row.id) } : {},
      evidenceUrl,
      signalType: "new_or_renewed_tls_certificate",
      source: "certificate_transparency_crtsh",
      raw: {
        not_before: row.not_before,
        not_after: row.not_after,
        issuer_name: row.issuer_name,
        serial_number: row.serial_number,
      },
    });
  }
  return out;
}

function looksLikeHostname(value: string): boolean {
  if (value.length < 3 || value.length > 253) {
    return false;
  }
  if (value.includes(" ") || value.includes("@")) {
    return false;
  }
  return value.includes(".");
}
