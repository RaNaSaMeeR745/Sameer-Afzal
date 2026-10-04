import type {
  AgencyCredit,
  AuditFinding,
  EntityContact,
  EntitySignal,
  FreshnessClass,
  ScoreBreakdown,
} from "./types.js";
import { totalScore } from "./types.js";

/** Caps match ScoreBreakdownSchema (Need 40, Timing 25, Budget 15, Reach 10, Fit 10). */
export const SCORE_CAPS = {
  need: 40,
  timing: 25,
  budget: 15,
  reach: 10,
  fit: 10,
} as const;

export interface ScoringWeights {
  need: number;
  timing: number;
  budget: number;
  reach: number;
  fit: number;
}

/** Default weights before per-tenant learning (must sum conceptually to 100 via caps). */
export const DEFAULT_WEIGHTS: ScoringWeights = {
  need: 1,
  timing: 1,
  budget: 1,
  reach: 1,
  fit: 1,
};

export interface IcpProfile {
  /** Preferred countries (ISO 2). Empty means any. */
  countries?: readonly string[];
  /** Preferred niches or categories (substring match, case-insensitive). */
  niches?: readonly string[];
  /** Preferred service key the tenant sells. */
  serviceKey?: string;
}

export interface ScoreInput {
  findings: readonly AuditFinding[];
  signals: readonly EntitySignal[];
  contacts: readonly EntityContact[];
  agencyCredits: readonly AgencyCredit[];
  freshnessClass: FreshnessClass;
  /** Entity country ISO 2, if known. */
  entityCountry?: string | null;
  /** Entity category or niche string, if known. */
  entityCategory?: string | null;
  /** Tenant ICP for Fit. */
  icp?: IcpProfile;
  /** Optional per-tenant weight multipliers (bounded). */
  weights?: ScoringWeights;
  /** Clock for tests. Defaults to Date.now(). */
  nowMs?: number;
}

export interface ScoreResult {
  score: number;
  breakdown: ScoreBreakdown;
  /** If true, lead should not be delivered (missing evidence or suppressed). */
  rejected: boolean;
  rejectReason: string | null;
}

const SEVERITY_POINTS: Record<AuditFinding["severity"], number> = {
  info: 2,
  low: 5,
  medium: 10,
  high: 18,
  critical: 28,
};

/** Timing decay half-lives in days by signal family. */
const TIMING_HALF_LIFE_DAYS: Record<string, number> = {
  hn_hiring_story: 14,
  job_board_hiring: 14,
  meta_active_ad: 14,
  uk_new_or_existing_company: 30,
  us_sec_filing: 30,
  new_or_renewed_tls_certificate: 30,
  osm_local_business: 45,
  osm_agency_office: 45,
  web_search_agency_or_business: 30,
};

const BUDGET_SIGNAL_TYPES = new Set([
  "meta_active_ad",
  "job_board_hiring",
  "hn_hiring_story",
  "us_sec_filing",
]);

/**
 * Explainable lead score: Need + Timing + Budget + Reach + Fit (0-100).
 * Missing audit evidence rejects the lead (not scored for delivery).
 * Served freshness applies a large penalty; contested a medium one.
 */
export function scoreLead(input: ScoreInput): ScoreResult {
  const weights = clampWeights(input.weights ?? DEFAULT_WEIGHTS);
  const nowMs = input.nowMs ?? Date.now();
  const notes: string[] = [];
  const evidenceLinks: string[] = [];

  for (const f of input.findings) {
    if (f.evidenceUrl) {
      evidenceLinks.push(f.evidenceUrl);
    }
  }
  for (const s of input.signals) {
    if (s.evidenceUrl) {
      evidenceLinks.push(s.evidenceUrl);
    }
  }

  if (input.findings.length === 0 && input.signals.length === 0) {
    return {
      score: 0,
      breakdown: emptyBreakdown(),
      rejected: true,
      rejectReason: "missing_evidence",
    };
  }

  const needRaw = scoreNeed(input.findings, notes);
  const timingRaw = scoreTiming(input.signals, nowMs, notes);
  const budgetRaw = scoreBudget(input.signals, input.agencyCredits, notes);
  const reachRaw = scoreReach(input.contacts, notes);
  const fitRaw = scoreFit(input, notes);

  let need = Math.min(SCORE_CAPS.need, Math.round(needRaw * weights.need));
  let timing = Math.min(SCORE_CAPS.timing, Math.round(timingRaw * weights.timing));
  let budget = Math.min(SCORE_CAPS.budget, Math.round(budgetRaw * weights.budget));
  let reach = Math.min(SCORE_CAPS.reach, Math.round(reachRaw * weights.reach));
  let fit = Math.min(SCORE_CAPS.fit, Math.round(fitRaw * weights.fit));

  if (input.freshnessClass === "served") {
    need = Math.max(0, need - 20);
    timing = Math.max(0, timing - 10);
    notes.push("Penalty: served (agency credit or professional management detected)");
  } else if (input.freshnessClass === "contested") {
    need = Math.max(0, need - 8);
    notes.push("Penalty: contested (unclear agency credit or exclusivity overlap)");
  }

  const breakdown: ScoreBreakdown = {
    need,
    timing,
    budget,
    reach,
    fit,
    evidenceLinks: uniqueUrls(evidenceLinks),
    notes,
  };

  return {
    score: Math.min(100, totalScore(breakdown)),
    breakdown,
    rejected: false,
    rejectReason: null,
  };
}

function scoreNeed(findings: readonly AuditFinding[], notes: string[]): number {
  if (findings.length === 0) {
    notes.push("Need: no audit findings yet");
    return 0;
  }
  let points = 0;
  for (const f of findings) {
    points += SEVERITY_POINTS[f.severity] ?? 0;
  }
  const capped = Math.min(SCORE_CAPS.need, points);
  notes.push(`Need: ${findings.length} finding(s) → ${capped}/${SCORE_CAPS.need}`);
  return capped;
}

function scoreTiming(
  signals: readonly EntitySignal[],
  nowMs: number,
  notes: string[],
): number {
  if (signals.length === 0) {
    notes.push("Timing: no signals");
    return 0;
  }

  let best = 0;
  for (const s of signals) {
    const observed = Date.parse(s.observedAt);
    if (Number.isNaN(observed)) {
      continue;
    }
    const ageDays = Math.max(0, (nowMs - observed) / (1000 * 60 * 60 * 24));
    const halfLife = TIMING_HALF_LIFE_DAYS[s.signalType] ?? 30;
    const freshness = Math.exp((-Math.LN2 * ageDays) / halfLife);
    const component = SCORE_CAPS.timing * freshness;
    if (component > best) {
      best = component;
    }
  }

  const rounded = Math.round(best);
  notes.push(`Timing: best signal decay → ${rounded}/${SCORE_CAPS.timing}`);
  return rounded;
}

function scoreBudget(
  signals: readonly EntitySignal[],
  credits: readonly AgencyCredit[],
  notes: string[],
): number {
  let points = 0;
  const budgetSignals = signals.filter((s) => BUDGET_SIGNAL_TYPES.has(s.signalType));
  if (budgetSignals.length > 0) {
    points += Math.min(10, budgetSignals.length * 5);
  }
  if (credits.length > 0) {
    points += 3;
  }
  const capped = Math.min(SCORE_CAPS.budget, points);
  notes.push(`Budget: ${capped}/${SCORE_CAPS.budget}`);
  return capped;
}

function scoreReach(contacts: readonly EntityContact[], notes: string[]): number {
  if (contacts.length === 0) {
    notes.push("Reach: no contacts");
    return 0;
  }

  let best = 0;
  for (const c of contacts) {
    if (c.verificationStatus === "suppressed" || c.verificationStatus === "invalid") {
      continue;
    }
    if (c.verificationStatus === "verified") {
      best = Math.max(best, 10);
    } else if (c.verificationStatus === "mx_ok") {
      best = Math.max(best, 7);
    } else if (c.verificationStatus === "syntax_ok") {
      best = Math.max(best, 4);
    } else if (c.email || c.phone) {
      best = Math.max(best, 2);
    }
  }

  notes.push(`Reach: ${best}/${SCORE_CAPS.reach}`);
  return best;
}

function scoreFit(input: ScoreInput, notes: string[]): number {
  const icp = input.icp;
  if (!icp) {
    notes.push("Fit: no ICP configured, neutral 5");
    return 5;
  }

  let points = 0;
  let checks = 0;

  if (icp.countries && icp.countries.length > 0) {
    checks += 1;
    const country = input.entityCountry?.toUpperCase();
    if (country && icp.countries.map((c) => c.toUpperCase()).includes(country)) {
      points += 4;
    }
  }

  if (icp.niches && icp.niches.length > 0) {
    checks += 1;
    const cat = (input.entityCategory ?? "").toLowerCase();
    if (cat && icp.niches.some((n) => cat.includes(n.toLowerCase()))) {
      points += 3;
    }
  }

  if (icp.serviceKey) {
    checks += 1;
    const hasServiceFinding = input.findings.some((f) =>
      f.serviceKeys.includes(icp.serviceKey as never),
    );
    if (hasServiceFinding) {
      points += 3;
    }
  }

  if (checks === 0) {
    notes.push("Fit: ICP empty, neutral 5");
    return 5;
  }

  const capped = Math.min(SCORE_CAPS.fit, points);
  notes.push(`Fit: ${capped}/${SCORE_CAPS.fit}`);
  return capped;
}

function clampWeights(w: ScoringWeights): ScoringWeights {
  return {
    need: clamp(w.need, 0.5, 1.5),
    timing: clamp(w.timing, 0.5, 1.5),
    budget: clamp(w.budget, 0.5, 1.5),
    reach: clamp(w.reach, 0.5, 1.5),
    fit: clamp(w.fit, 0.5, 1.5),
  };
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function emptyBreakdown(): ScoreBreakdown {
  return {
    need: 0,
    timing: 0,
    budget: 0,
    reach: 0,
    fit: 0,
    evidenceLinks: [],
    notes: ["Rejected: missing evidence"],
  };
}

function uniqueUrls(urls: string[]): string[] {
  return [...new Set(urls)];
}

/**
 * Derive default weights from tenant outcomes after 30+ records.
 * Bounded, reversible: returns multipliers in [0.5, 1.5].
 * Wins boost dimensions that were high on won leads; losses dampen them.
 */
export function deriveWeightsFromOutcomes(
  samples: readonly {
    breakdown: ScoreBreakdown;
    result: "replied" | "call_booked" | "won" | "lost";
  }[],
): ScoringWeights | null {
  if (samples.length < 30) {
    return null;
  }

  const positive = samples.filter((s) => s.result !== "lost");
  const negative = samples.filter((s) => s.result === "lost");
  if (positive.length === 0 || negative.length === 0) {
    return { ...DEFAULT_WEIGHTS };
  }

  const avg = (list: typeof samples, key: keyof ScoreBreakdown) => {
    const nums = list.map((s) => Number(s.breakdown[key]) || 0);
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  };

  const dim = (key: "need" | "timing" | "budget" | "reach" | "fit") => {
    const p = avg(positive, key);
    const n = avg(negative, key);
    if (n <= 0) {
      return 1;
    }
    return clamp(p / n, 0.5, 1.5);
  };

  return {
    need: dim("need"),
    timing: dim("timing"),
    budget: dim("budget"),
    reach: dim("reach"),
    fit: dim("fit"),
  };
}
