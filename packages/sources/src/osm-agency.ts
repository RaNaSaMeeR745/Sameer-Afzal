import type {
  BBox,
  DiscoverInput,
  DiscoverResult,
  SourceAdapter,
  SourceCandidate,
} from "./types.js";

const DEFAULT_ENDPOINT = "https://overpass-api.de/api/interpreter";
const USER_AGENT =
  "Scoutline/0.0.1 (lead discovery; +https://github.com/RaNaSaMeeR745/Sameer-Afzal)";

/**
 * OSM office tags for marketing and advertising agencies.
 * office=advertising_agency is documented on the OSM wiki (in use).
 * office=graphic_design and office=marketing are commonly used for related firms.
 */
export const DEFAULT_OFFICE_TAGS = [
  "advertising_agency",
  "graphic_design",
  "marketing",
  "consulting",
] as const;

/**
 * Build Overpass QL for named offices in a bbox.
 * Public for unit tests. Does not hit the network.
 */
export function buildOverpassAgencyQuery(
  bbox: BBox,
  offices: readonly string[] = DEFAULT_OFFICE_TAGS,
  timeoutSeconds = 25,
): string {
  const { south, west, north, east } = bbox;
  const officeRegex = offices.map(escapeRegex).join("|");

  return `
[out:json][timeout:${timeoutSeconds}];
(
  node["office"~"^(${officeRegex})$"](${south},${west},${north},${east});
  way["office"~"^(${officeRegex})$"](${south},${west},${north},${east});
);
out center tags;
`.trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements?: OverpassElement[];
}

function elementToCandidate(el: OverpassElement): SourceCandidate | null {
  const tags = el.tags ?? {};
  const name = tags.name ?? tags["name:en"];
  if (!name) {
    return null;
  }

  const lat = el.lat ?? el.center?.lat ?? null;
  const lon = el.lon ?? el.center?.lon ?? null;
  const website = tags.website ?? tags["contact:website"] ?? null;
  let domain: string | null = null;
  if (website) {
    try {
      domain = new URL(website.startsWith("http") ? website : `https://${website}`)
        .hostname;
    } catch {
      domain = null;
    }
  }

  const osmId = `${el.type}/${el.id}`;

  return {
    canonicalName: name,
    domain,
    country: tags["addr:country"] ?? null,
    city: tags["addr:city"] ?? null,
    category: tags.office ?? "agency",
    lat,
    lon,
    registryIds: { osm: osmId },
    evidenceUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
    signalType: "osm_agency_office",
    source: "openstreetmap_agency",
    raw: { osmId, tags },
  };
}

export interface OsmAgencyAdapterOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
}

/**
 * Discover marketing and advertising agencies from OpenStreetMap office tags.
 * Same Overpass fair-use rules as the local-business adapter (User-Agent, rate limits).
 * Verified office=advertising_agency on OSM wiki 2026-10-04.
 */
export class OsmAgencyAdapter implements SourceAdapter {
  readonly id = "openstreetmap_agency";
  readonly displayName = "OpenStreetMap Agency Offices";

  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;

  constructor(options: OsmAgencyAdapterOptions = {}) {
    this.endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.userAgent = options.userAgent ?? USER_AGENT;
  }

  async discover(input: DiscoverInput): Promise<DiscoverResult> {
    if (!input.bbox) {
      throw new Error("OSM agency discover requires a bbox");
    }

    const offices = input.categories?.length
      ? input.categories
      : [...DEFAULT_OFFICE_TAGS];
    const query = buildOverpassAgencyQuery(
      input.bbox,
      offices,
      input.timeoutSeconds ?? 25,
    );

    const response = await this.fetchImpl(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": this.userAgent,
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (response.status === 429 || response.status === 406) {
      throw new Error(
        `Overpass rate limited (HTTP ${response.status}). Pause at least 30 seconds before retrying.`,
      );
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Overpass agency request failed (HTTP ${response.status}): ${body.slice(0, 200)}`,
      );
    }

    const data = (await response.json()) as OverpassResponse;
    const elements = data.elements ?? [];
    const candidates: SourceCandidate[] = [];

    for (const el of elements) {
      const candidate = elementToCandidate(el);
      if (candidate) {
        candidates.push(candidate);
      }
    }

    return {
      candidates,
      queryMeta: {
        source: this.id,
        endpoint: this.endpoint,
        fetchedAt: new Date().toISOString(),
        elementCount: elements.length,
      },
    };
  }
}
