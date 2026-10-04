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

export {
  OsmAgencyAdapter,
  buildOverpassAgencyQuery,
  DEFAULT_OFFICE_TAGS,
  type OsmAgencyAdapterOptions,
} from "./osm-agency.js";

export {
  CompaniesHouseAdapter,
  type CompaniesHouseAdapterOptions,
} from "./companies-house.js";

export { EdgarAdapter, type EdgarAdapterOptions } from "./edgar.js";

export {
  CrtShAdapter,
  mapCrtShRow,
  type CrtShAdapterOptions,
  type CrtShRow,
} from "./crtsh.js";

export {
  HnAlgoliaAdapter,
  mapHnHit,
  extractCompanyFromTitle,
  type HnAlgoliaAdapterOptions,
} from "./hn-algolia.js";

export {
  AdzunaAdapter,
  mapAdzunaJob,
  type AdzunaAdapterOptions,
} from "./adzuna.js";

export {
  MetaAdLibraryAdapter,
  mapMetaAd,
  type MetaAdLibraryAdapterOptions,
} from "./meta-ad-library.js";

export {
  BraveSearchAdapter,
  mapBraveResult,
  type BraveSearchAdapterOptions,
} from "./brave-search.js";
