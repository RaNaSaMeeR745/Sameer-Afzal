import { z } from "zod";

/** Top-level market type: B2C consumer businesses or B2B companies and agencies. */
export const LeadTypeSchema = z.enum(["B2C", "B2B"]);
export type LeadType = z.infer<typeof LeadTypeSchema>;

/** Discovery mode keys used in search configs and scoring. */
export const ModeKeySchema = z.enum([
  "local_business",
  "ecommerce_brand",
  "b2b_company",
  "hiring_company",
  "agency",
]);
export type ModeKey = z.infer<typeof ModeKeySchema>;

export interface ModeDefinition {
  readonly key: ModeKey;
  readonly type: LeadType;
  readonly label: string;
  readonly whoItFinds: string;
  readonly primarySignals: readonly string[];
}

export const MODES: readonly ModeDefinition[] = [
  {
    key: "local_business",
    type: "B2C",
    label: "Local business",
    whoItFinds:
      "Restaurants, clinics, salons, gyms, real estate, home services, retail",
    primarySignals: [
      "Weak or missing website",
      "No tracking",
      "Review problems",
      "No online booking",
      "New listing",
      "No WhatsApp or chat",
    ],
  },
  {
    key: "ecommerce_brand",
    type: "B2C",
    label: "E-commerce brand",
    whoItFinds: "Online stores (Shopify, WooCommerce, others)",
    primarySignals: [
      "New store",
      "Running ads without pixel or CAPI",
      "Slow mobile pages",
      "Weak product pages",
      "No email capture",
      "Poor schema",
    ],
  },
  {
    key: "b2b_company",
    type: "B2B",
    label: "B2B company",
    whoItFinds: "SaaS, services, manufacturers, funded startups",
    primarySignals: [
      "New registration",
      "Funding filing",
      "Hiring for marketing roles",
      "Site gaps",
      "New product launch",
    ],
  },
  {
    key: "hiring_company",
    type: "B2B",
    label: "Hiring company",
    whoItFinds:
      "Any company hiring marketing, SEO, ads, design, content, or dev roles",
    primarySignals: [
      "Open job posts with stated need and budget",
      "Pitch outsourcing opportunity",
    ],
  },
  {
    key: "agency",
    type: "B2B",
    label: "Agency",
    whoItFinds:
      "Other agencies who could buy an AEO tool, white-label services, or a white-label WhatsApp CRM",
    primarySignals: [
      "Sells SEO with no AEO offer",
      "No schema or llms.txt on own site",
      "No CRM or WhatsApp offer",
      "Agency in a WhatsApp-heavy market",
    ],
  },
] as const;

const MODE_BY_KEY: ReadonlyMap<ModeKey, ModeDefinition> = new Map(
  MODES.map((m) => [m.key, m]),
);

export function getMode(key: ModeKey): ModeDefinition {
  const mode = MODE_BY_KEY.get(key);
  if (!mode) {
    throw new Error(`Unknown mode key: ${key}`);
  }
  return mode;
}

export function modesForType(type: LeadType): readonly ModeDefinition[] {
  return MODES.filter((m) => m.type === type);
}

export function isValidModeKey(value: string): value is ModeKey {
  return ModeKeySchema.safeParse(value).success;
}
