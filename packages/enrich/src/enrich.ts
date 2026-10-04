import { fetchPage, type FetchedPage, type FetchPageOptions } from "./fetch.js";
import { extractContacts, type ExtractedContact } from "./contacts.js";
import { fingerprintTech, type TechFingerprint } from "./tech.js";

export interface EnrichInput {
  /** Domain or absolute URL. */
  domainOrUrl: string;
  fetchImpl?: typeof fetch;
  skipRobots?: boolean;
}

export interface EnrichResult {
  page: FetchedPage;
  contacts: ExtractedContact[];
  tech: TechFingerprint;
}

/**
 * Enrich an entity by fetching its public site and extracting contacts + tech hints.
 * Network I/O is isolated here so audit remains pure on snapshots.
 */
export async function enrichEntity(input: EnrichInput): Promise<EnrichResult> {
  const url = input.domainOrUrl.includes("://")
    ? input.domainOrUrl
    : `https://${input.domainOrUrl.replace(/^\/+/, "")}`;

  const fetchOptions: FetchPageOptions = {
    url,
    fetchImpl: input.fetchImpl,
    skipRobots: input.skipRobots,
  };

  const page = await fetchPage(fetchOptions);
  const contacts = extractContacts(page.html);
  const tech = fingerprintTech(page.html, page.headers);

  return { page, contacts, tech };
}
