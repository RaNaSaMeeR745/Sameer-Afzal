import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Paddle Billing webhook signature verification.
 * Header format: ts=<unix>;h1=<hex hmac>
 * Signed payload: `${ts}:${rawBody}` with HMAC-SHA256 and the notification secret.
 * Verified against developer.paddle.com docs (2026-10-04).
 */
export function verifyPaddleSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
  options?: { maxSkewSeconds?: number; nowSeconds?: number },
): boolean {
  if (!rawBody || !signatureHeader || !secret) {
    return false;
  }

  let ts = "";
  let h1 = "";
  for (const part of signatureHeader.split(";")) {
    const [key, ...rest] = part.split("=");
    const value = rest.join("=");
    if (key?.trim() === "ts") {
      ts = value.trim();
    }
    if (key?.trim() === "h1") {
      h1 = value.trim();
    }
  }
  if (!ts || !h1) {
    return false;
  }

  const maxSkew = options?.maxSkewSeconds ?? 300;
  const now = options?.nowSeconds ?? Math.floor(Date.now() / 1000);
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum) || Math.abs(now - tsNum) > maxSkew) {
    return false;
  }

  const payload = `${ts}:${rawBody}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");

  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(h1, "hex");
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export interface PaddleWebhookEvent {
  eventId: string;
  eventType: string;
  occurredAt: string | null;
  data: unknown;
}

/** Parse a Paddle Billing notification JSON body into a minimal event shape. */
export function parsePaddleEvent(rawBody: string): PaddleWebhookEvent | null {
  try {
    const parsed = JSON.parse(rawBody) as {
      event_id?: string;
      event_type?: string;
      occurred_at?: string;
      data?: unknown;
    };
    if (!parsed.event_id || !parsed.event_type) {
      return null;
    }
    return {
      eventId: parsed.event_id,
      eventType: parsed.event_type,
      occurredAt: parsed.occurred_at ?? null,
      data: parsed.data ?? null,
    };
  } catch {
    return null;
  }
}

/** Map subscription-related event types to credit grant plan keys when applicable. */
export const PADDLE_SUBSCRIPTION_EVENTS = [
  "subscription.created",
  "subscription.activated",
  "subscription.updated",
  "transaction.completed",
] as const;
