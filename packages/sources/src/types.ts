import { z } from "zod";

/** Bounding box: south, west, north, east (degrees). */
export const BBoxSchema = z.object({
  south: z.number().min(-90).max(90),
  west: z.number().min(-180).max(180),
  north: z.number().min(-90).max(90),
  east: z.number().min(-180).max(180),
});
export type BBox = z.infer<typeof BBoxSchema>;

/** Normalized candidate entity returned by any source adapter. */
export const SourceCandidateSchema = z.object({
  canonicalName: z.string().min(1),
  domain: z.string().nullable(),
  country: z.string().nullable(),
  city: z.string().nullable(),
  category: z.string().nullable(),
  lat: z.number().nullable(),
  lon: z.number().nullable(),
  registryIds: z.record(z.string()).default({}),
  evidenceUrl: z.string().url().nullable(),
  signalType: z.string().min(1),
  source: z.string().min(1),
  raw: z.unknown().optional(),
});
export type SourceCandidate = z.infer<typeof SourceCandidateSchema>;

/**
 * Discovery input shared by geographic and registry adapters.
 * Geographic adapters (Overpass) require bbox.
 * Registry adapters use query and optional incorporatedSince.
 */
export interface DiscoverInput {
  bbox?: BBox;
  /** Free-text company or place name for registry search. */
  query?: string;
  /** OSM amenity or shop tag values, e.g. restaurant, clinic. */
  categories?: readonly string[];
  /** ISO date (YYYY-MM-DD): only return entities incorporated on or after. */
  incorporatedSince?: string;
  /** Max results to return when the source supports pagination size. */
  limit?: number;
  timeoutSeconds?: number;
}

export interface DiscoverResult {
  candidates: SourceCandidate[];
  queryMeta: {
    source: string;
    endpoint: string;
    fetchedAt: string;
    elementCount: number;
  };
}

/** Common interface every source adapter implements. */
export interface SourceAdapter {
  readonly id: string;
  readonly displayName: string;
  discover(input: DiscoverInput): Promise<DiscoverResult>;
}
