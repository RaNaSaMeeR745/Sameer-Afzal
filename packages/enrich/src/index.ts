export const PACKAGE_NAME = "@scoutline/enrich" as const;

export {
  fetchPage,
  robotsAllowsPath,
  type FetchPageOptions,
  type FetchedPage,
} from "./fetch.js";

export {
  extractContacts,
  type ExtractedContact,
} from "./contacts.js";

export {
  fingerprintTech,
  type TechFingerprint,
} from "./tech.js";

export {
  enrichEntity,
  type EnrichInput,
  type EnrichResult,
} from "./enrich.js";
