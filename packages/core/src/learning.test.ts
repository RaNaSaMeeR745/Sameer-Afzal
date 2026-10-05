import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  LEARNING_MIN_SAMPLES,
  learnWeightsFromOutcomes,
  type OutcomeSample,
} from "./learning.js";
import type { ScoreBreakdown } from "./types.js";

function breakdown(partial: Partial<ScoreBreakdown>): ScoreBreakdown {
  return {
    need: 20,
    timing: 10,
    budget: 5,
    reach: 5,
    fit: 5,
    evidenceLinks: [],
    notes: [],
    ...partial,
  };
}

describe("learnWeightsFromOutcomes", () => {
  it("returns not ready below threshold", () => {
    const samples: OutcomeSample[] = Array.from({ length: 10 }, () => ({
      breakdown: breakdown({}),
      result: "won" as const,
    }));
    const result = learnWeightsFromOutcomes(samples);
    assert.equal(result.ready, false);
    assert.equal(result.weights, null);
    assert.ok(result.explanation[0]?.includes(String(LEARNING_MIN_SAMPLES)));
  });

  it("derives weights after 30 mixed outcomes", () => {
    const samples: OutcomeSample[] = [];
    for (let i = 0; i < 20; i++) {
      samples.push({
        breakdown: breakdown({ need: 35, timing: 20 }),
        result: "won",
      });
    }
    for (let i = 0; i < 15; i++) {
      samples.push({
        breakdown: breakdown({ need: 5, timing: 5 }),
        result: "lost",
      });
    }
    assert.ok(samples.length >= LEARNING_MIN_SAMPLES);
    const result = learnWeightsFromOutcomes(samples);
    assert.equal(result.ready, true);
    assert.ok(result.weights);
    assert.ok(result.weights.need >= 1);
    assert.ok(result.explanation.length > 1);
  });
});
