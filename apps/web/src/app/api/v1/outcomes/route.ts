import { NextResponse } from "next/server";
import {
  learnWeightsFromOutcomes,
  type OutcomeSample,
  type ScoreBreakdown,
} from "@scoutline/core";
import {
  insertOutcome,
  listOutcomeSamplesForTenant,
} from "@scoutline/db";
import { loadApiKeysFromEnv, resolveApiKey } from "@/lib/api-auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/outcomes
 * Body shapes:
 * 1) { leadId, result, reason?, breakdown? } — persist one outcome
 * 2) { samples: [{ breakdown, result }] } — compute learning from a batch
 * When DATABASE_URL is set, also loads stored samples for learning.
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
    leadId?: string;
    result?: "replied" | "call_booked" | "won" | "lost";
    reason?: string | null;
    breakdown?: ScoreBreakdown;
    samples?: Array<{
      leadId?: string;
      breakdown?: ScoreBreakdown;
      result?: "replied" | "call_booked" | "won" | "lost";
    }>;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const db = getDb();
  const samples: OutcomeSample[] = [];
  const persisted: string[] = [];

  if (body.leadId && body.result) {
    if (!["replied", "call_booked", "won", "lost"].includes(body.result)) {
      return NextResponse.json({ error: "invalid_result" }, { status: 400 });
    }
    if (db) {
      const row = await insertOutcome(db, {
        tenantId: auth.tenantId,
        leadId: body.leadId,
        result: body.result,
        reason: body.reason ?? null,
        scoreBreakdown: body.breakdown ?? {},
      });
      persisted.push(row.id);
    }
    if (body.breakdown) {
      samples.push({ breakdown: body.breakdown, result: body.result });
    }
  } else if (Array.isArray(body.samples) && body.samples.length > 0) {
    for (const s of body.samples) {
      if (!s.result || !["replied", "call_booked", "won", "lost"].includes(s.result)) {
        return NextResponse.json({ error: "invalid_result" }, { status: 400 });
      }
      if (db && s.leadId) {
        const row = await insertOutcome(db, {
          tenantId: auth.tenantId,
          leadId: s.leadId,
          result: s.result,
          scoreBreakdown: s.breakdown ?? {},
        });
        persisted.push(row.id);
      }
      if (s.breakdown) {
        samples.push({ breakdown: s.breakdown, result: s.result });
      }
    }
  } else {
    return NextResponse.json(
      { error: "samples_or_lead_required" },
      { status: 400 },
    );
  }

  if (db) {
    const stored = await listOutcomeSamplesForTenant(db, auth.tenantId);
    for (const s of stored) {
      const breakdown = s.breakdown as unknown as ScoreBreakdown;
      if (
        breakdown &&
        typeof breakdown.need === "number" &&
        typeof breakdown.timing === "number"
      ) {
        samples.push({ breakdown, result: s.result });
      }
    }
  }

  const learning = learnWeightsFromOutcomes(samples);

  return NextResponse.json({
    tenantId: auth.tenantId,
    persistedIds: persisted,
    learning: {
      ready: learning.ready,
      sampleCount: learning.sampleCount,
      weights: learning.weights,
      explanation: learning.explanation,
      baseline: learning.baseline,
    },
  });
}
