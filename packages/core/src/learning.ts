import type { Outcome, ScoreBreakdown } from "./types.js";
import {
  DEFAULT_WEIGHTS,
  deriveWeightsFromOutcomes,
  type ScoringWeights,
} from "./scoring.js";

export interface OutcomeSample {
  breakdown: ScoreBreakdown;
  result: Outcome["result"];
}

export interface WeightLearningResult {
  /** Null when fewer than 30 outcomes (learning not applied). */
  weights: ScoringWeights | null;
  sampleCount: number;
  ready: boolean;
  /** Human-readable explanation for the dashboard. */
  explanation: string[];
  /** Defaults used when not ready or no contrast between wins and losses. */
  baseline: ScoringWeights;
}

const MIN_SAMPLES = 30;

/**
 * Learn per-tenant scoring weights from outcomes.
 * Bounded multipliers in [0.5, 1.5], reversible by clearing outcomes or
 * resetting to DEFAULT_WEIGHTS. Requires at least 30 samples.
 */
export function learnWeightsFromOutcomes(
  samples: readonly OutcomeSample[],
): WeightLearningResult {
  const baseline = { ...DEFAULT_WEIGHTS };
  const sampleCount = samples.length;

  if (sampleCount < MIN_SAMPLES) {
    return {
      weights: null,
      sampleCount,
      ready: false,
      explanation: [
        `Need ${MIN_SAMPLES} outcomes before re-weighting (have ${sampleCount}).`,
        "Using default weights until the threshold is met.",
      ],
      baseline,
    };
  }

  const weights = deriveWeightsFromOutcomes(samples);
  if (!weights) {
    return {
      weights: null,
      sampleCount,
      ready: false,
      explanation: [
        "Could not derive weights (insufficient contrast or internal guard).",
        "Using default weights.",
      ],
      baseline,
    };
  }

  const explanation = explainWeightDeltas(baseline, weights, sampleCount);
  return {
    weights,
    sampleCount,
    ready: true,
    explanation,
    baseline,
  };
}

/** Build UI-facing notes describing how each dimension moved vs baseline. */
export function explainWeightDeltas(
  baseline: ScoringWeights,
  learned: ScoringWeights,
  sampleCount: number,
): string[] {
  const lines = [
    `Learned from ${sampleCount} outcomes. Multipliers stay between 0.5 and 1.5.`,
  ];
  for (const key of ["need", "timing", "budget", "reach", "fit"] as const) {
    const b = baseline[key];
    const l = learned[key];
    const delta = l - b;
    if (Math.abs(delta) < 0.05) {
      lines.push(`${key}: unchanged (${l.toFixed(2)})`);
    } else if (delta > 0) {
      lines.push(
        `${key}: up to ${l.toFixed(2)} (positive outcomes had higher ${key} scores)`,
      );
    } else {
      lines.push(
        `${key}: down to ${l.toFixed(2)} (positive outcomes had lower relative ${key})`,
      );
    }
  }
  lines.push("Reset is reversible: clear custom weights to restore defaults.");
  return lines;
}

/** Minimum outcomes required before learnWeightsFromOutcomes applies. */
export const LEARNING_MIN_SAMPLES = MIN_SAMPLES;
