import { NextResponse } from "next/server";
import {
  getPlan,
  parsePaddleEvent,
  verifyPaddleSignature,
  type PlanKey,
} from "@scoutline/billing";
import { persistGrant } from "@scoutline/db";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Paddle Billing notification endpoint.
 * Verifies Paddle-Signature, then grants credits when custom_data includes
 * tenant_id and plan_key and DATABASE_URL is configured.
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

  const grant = resolveCreditGrant(event.eventType, event.data);
  let persisted: {
    ok: boolean;
    reason: string | null;
    balanceAfter: number | null;
  } | null = null;

  if (grant) {
    const db = getDb();
    if (db) {
      const result = await persistGrant(db, {
        tenantId: grant.tenantId,
        amount: grant.credits,
        reason: `paddle:${event.eventType}:${grant.planKey}`,
        eventId: event.eventId,
      });
      persisted = {
        ok: result.ok,
        reason: result.reason,
        balanceAfter: result.balanceAfter,
      };
    }
  }

  return NextResponse.json({
    received: true,
    eventId: event.eventId,
    eventType: event.eventType,
    creditGrant: grant
      ? {
          planKey: grant.planKey,
          credits: grant.credits,
          tenantId: grant.tenantId,
        }
      : null,
    persisted,
  });
}

function resolveCreditGrant(
  eventType: string,
  data: unknown,
): { planKey: PlanKey; credits: number; tenantId: string } | null {
  if (
    eventType !== "subscription.activated" &&
    eventType !== "subscription.created" &&
    eventType !== "transaction.completed"
  ) {
    return null;
  }

  if (!data || typeof data !== "object") {
    return null;
  }

  const custom = (
    data as {
      custom_data?: { plan_key?: string; tenant_id?: string };
    }
  ).custom_data;

  const planKey = custom?.plan_key;
  const tenantId = custom?.tenant_id;
  if (!tenantId) {
    return null;
  }
  if (planKey !== "starter" && planKey !== "growth" && planKey !== "agency") {
    return null;
  }

  const plan = getPlan(planKey);
  return {
    planKey,
    credits: plan.creditsPerMonth,
    tenantId,
  };
}
