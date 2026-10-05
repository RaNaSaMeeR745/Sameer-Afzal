import { NextResponse } from "next/server";
import {
  grantCredits,
  getPlan,
  parsePaddleEvent,
  verifyPaddleSignature,
  type PlanKey,
} from "@scoutline/billing";

export const dynamic = "force-dynamic";

/**
 * Paddle Billing notification endpoint.
 * Verifies Paddle-Signature against the raw body, then acknowledges the event.
 * Credit grants are computed here; durable ledger writes attach when DB is wired.
 */
export async function POST(request: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "webhook_not_configured" },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature") ?? "";

  if (!verifyPaddleSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const event = parsePaddleEvent(rawBody);
  if (!event) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  // Idempotent acknowledgment. Ledger persistence uses event.eventId as eventId.
  const creditHint = creditGrantForEvent(event.eventType, event.data);

  return NextResponse.json({
    received: true,
    eventId: event.eventId,
    eventType: event.eventType,
    creditGrant: creditHint,
  });
}

function creditGrantForEvent(
  eventType: string,
  data: unknown,
): { planKey: PlanKey; credits: number; eventIdSuffix: string } | null {
  if (
    eventType !== "subscription.activated" &&
    eventType !== "subscription.created" &&
    eventType !== "transaction.completed"
  ) {
    return null;
  }

  const planKey = inferPlanKey(data);
  if (!planKey || planKey === "trial") {
    return null;
  }
  const plan = getPlan(planKey);
  // Build a deterministic grant preview (caller persists with grantCredits)
  const preview = grantCredits({
    tenantId: "pending",
    amount: plan.creditsPerMonth,
    reason: `paddle:${eventType}:${planKey}`,
    eventId: `preview-${planKey}`,
    id: "preview",
    existing: [],
  });
  if (!preview.ok || !preview.entry) {
    return null;
  }
  return {
    planKey,
    credits: plan.creditsPerMonth,
    eventIdSuffix: planKey,
  };
}

function inferPlanKey(data: unknown): PlanKey | null {
  if (!data || typeof data !== "object") {
    return null;
  }
  const custom = (data as { custom_data?: { plan_key?: string } }).custom_data;
  const key = custom?.plan_key;
  if (key === "starter" || key === "growth" || key === "agency") {
    return key;
  }
  return null;
}
