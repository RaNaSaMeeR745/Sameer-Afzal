import type {
  BBox,
  DiscoverInput,
  DiscoverResult,
  SourceAdapter,
  SourceCandidate,
} from "./types.js";

const DEFAULT_ENDPOINT = "https://overpass-api.de/api/interpreter";
const USER_AGENT = "Scoutline/0.0.1 (lead discovery; +https://github.com/RaNaSaMeeR745/Sameer-Afzal)";

/** Default local-business OSM tags for Phase 5 local_business mode. */
export const DEFAULT_AMENITY_TAGS = [
  "restaurant",
  "cafe",
  "fast_food",
  "clinic",
  "doctors",
  "dentist",
  "hairdresser",
  "beauty_salon",
  "gym",
  "fitness_centre",
] as const;

export const DEFAULT_SHOP_TAGS = [
  "hairdresser",
  "beauty",
  "convenience",
  "supermarket",
] as const;

/**
 * Build an Overpass QL query for named amenities and shops inside a bbox.
 * Public for unit tests. Does not hit the network.
 */
export function buildOverpassQuery(
  bbox: BBox,
  amenities: readonly string[] = DEFAULT_AMENITY_TAGS,
  shops: readonly string[] = DEFAULT_SHOP_TAGS,
  timeoutSeconds = 25,
): string {
  const { south, west, north, east } = bbox;
  const amenityRegex = amenities.map(escapeRegex).join("|");
  const shopRegex = shops.map(escapeRegex).join("|");

  return `
[out:json][timeout:${timeoutSeconds}];
(
  node["amenity"~"^(${amenityRegex})$"](${south},${west},${north},${east});
  way["amenity"~"^(${amenityRegex})$"](${south},${west},${north},${east});
  node["shop"~"^(${shopRegex})$"](${south},${west},${north},${east});
  way["shop"~"^(${shopRegex})$"](${south},${west},${north},${east});
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
  const category = tags.amenity ?? tags.shop ?? null;
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
    category,
    lat,
    lon,
    registryIds: { osm: osmId },
    evidenceUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
    signalType: "osm_local_business",
    source: "openstreetmap_overpass",
    raw: { osmId, tags },
  };
}

export interface OverpassAdapterOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
  userAgent?: string;
}

/**
 * OpenStreetMap Overpass API adapter for local business discovery.
 * Respects public instance fair-use guidelines (User-Agent, modest volume,
 * pause on 429). Verified against OSM wiki Overpass policy on 2026-10-04.
 */
export class OverpassAdapter implements SourceAdapter {
  readonly id = "openstreetmap_overpass";
  readonly displayName = "OpenStreetMap Overpass API";

  private readonly endpoint: string;
  private readonly fetchImpl: typeof fetch;
  private readonly userAgent: string;

  constructor(options: OverpassAdapterOptions = {}) {
    this.endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.userAgent = options.userAgent ?? USER_AGENT;
  }

  async discover(input: DiscoverInput): Promise<DiscoverResult> {
    const categories = input.categories ?? [...DEFAULT_AMENITY_TAGS];
    const query = buildOverpassQuery(
      input.bbox,
      categories,
      DEFAULT_SHOP_TAGS,
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
        `Overpass rate limited (HTTP ${response.status}). Pause at least 30 seconds before retrying per OSM fair-use guidance.`,
      );
    }

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Overpass request failed (HTTP ${response.status}): ${body.slice(0, 200)}`,
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
