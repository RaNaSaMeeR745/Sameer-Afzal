export const PACKAGE_NAME = "@scoutline/sources" as const;

export {
  BBoxSchema,
  SourceCandidateSchema,
  type BBox,
  type SourceCandidate,
  type DiscoverInput,
  type DiscoverResult,
  type SourceAdapter,
} from "./types.js";

export {
  OverpassAdapter,
  buildOverpassQuery,
  DEFAULT_AMENITY_TAGS,
  DEFAULT_SHOP_TAGS,
  type OverpassAdapterOptions,
} from "./overpass.js";
