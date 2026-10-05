import { NextResponse } from "next/server";
import {
  learnWeightsFromOutcomes,
  type OutcomeSample,
  type ScoreBreakdown,
} from "@scoutline/core";
import { loadApiKeysFromEnv, resolveApiKey } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/outcomes
 * Record outcomes for learning. Accepts a batch of samples with score
 * breakdowns and results; returns learned weights when threshold is met.
 * Persistence of individual outcome rows is a later DB step; this endpoint
 * exposes the pure learning result for the submitted batch.
 */
export async function POST(request: Request) {
  const keys = loadApiKeysFromEnv();
  const auth = resolveApiKey(request.headers.get("authorization"), keys);
  if (!auth) {
    return NextResponse.json(
      { error: "unauthorized", message: "Valid Bearer API key required" },
      { status: 401 },
    );
  }

  let body: {
    samples?: Array<{
      breakdown?: ScoreBreakdown;
      result?: "replied" | "call_booked" | "won" | "lost";
    }>;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!Array.isArray(body.samples) || body.samples.length === 0) {
    return NextResponse.json(
      { error: "samples_required" },
      { status: 400 },
    );
  }

  const samples: OutcomeSample[] = [];
  for (const s of body.samples) {
    if (!s.breakdown || !s.result) {
      return NextResponse.json(
        { error: "invalid_sample" },
        { status: 400 },
      );
    }
    if (!["replied", "call_booked", "won", "lost"].includes(s.result)) {
      return NextResponse.json(
        { error: "invalid_result" },
        { status: 400 },
      );
    }
    samples.push({
      breakdown: s.breakdown,
      result: s.result,
    });
  }

  const learning = learnWeightsFromOutcomes(samples);

  return NextResponse.json({
    tenantId: auth.tenantId,
    learning: {
      ready: learning.ready,
      sampleCount: learning.sampleCount,
      weights: learning.weights,
      explanation: learning.explanation,
      baseline: learning.baseline,
    },
  });
}
