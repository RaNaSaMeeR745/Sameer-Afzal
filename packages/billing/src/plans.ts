/**
 * Published plan catalog aligned with docs/STRATEGY.md pricing defaults.
 * One credit = one fully enriched, scored, evidence-backed lead.
 */

export type PlanKey = "trial" | "starter" | "growth" | "agency";

export interface PlanDefinition {
  readonly key: PlanKey;
  readonly label: string;
  readonly monthlyPriceUsd: number;
  readonly creditsPerMonth: number;
  readonly modeLimit: number | "all";
  readonly features: readonly string[];
  /** Paddle price id placeholder name only; real ids come from env at runtime. */
  readonly paddlePriceEnvKey: string | null;
}

export const PLANS: readonly PlanDefinition[] = [
  {
    key: "trial",
    label: "Trial",
    monthlyPriceUsd: 0,
    creditsPerMonth: 25,
    modeLimit: 2,
    features: ["14-day trial", "25 credits", "no card required"],
    paddlePriceEnvKey: null,
  },
  {
    key: "starter",
    label: "Starter",
    monthlyPriceUsd: 39,
    creditsPerMonth: 300,
    modeLimit: 2,
    features: ["300 credits/mo", "2 modes", "proof reports", "message drafts"],
    paddlePriceEnvKey: "PADDLE_PRICE_STARTER",
  },
  {
    key: "growth",
    label: "Growth",
    monthlyPriceUsd: 99,
    creditsPerMonth: 1500,
    modeLimit: "all",
    features: [
      "1,500 credits/mo",
      "all modes",
      "follow-up sequences",
      "integrations",
    ],
    paddlePriceEnvKey: "PADDLE_PRICE_GROWTH",
  },
  {
    key: "agency",
    label: "Agency",
    monthlyPriceUsd: 249,
    creditsPerMonth: 6000,
    modeLimit: "all",
    features: [
      "6,000 credits/mo",
      "white-label proof reports",
      "public API",
      "exclusivity claims",
      "priority queue",
    ],
    paddlePriceEnvKey: "PADDLE_PRICE_AGENCY",
  },
] as const;

const BY_KEY = new Map(PLANS.map((p) => [p.key, p]));

export function getPlan(key: PlanKey): PlanDefinition {
  const plan = BY_KEY.get(key);
  if (!plan) {
    throw new Error(`Unknown plan key: ${key}`);
  }
  return plan;
}

export function isValidPlanKey(value: string): value is PlanKey {
  return BY_KEY.has(value as PlanKey);
}
