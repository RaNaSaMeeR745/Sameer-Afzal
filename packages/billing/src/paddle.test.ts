import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import { parsePaddleEvent, verifyPaddleSignature } from "./paddle.js";

describe("verifyPaddleSignature", () => {
  it("accepts a valid signature", () => {
    const secret = "test_secret";
    const rawBody = '{"event_id":"evt_1","event_type":"subscription.created"}';
    const ts = "1700000000";
    const h1 = createHmac("sha256", secret)
      .update(`${ts}:${rawBody}`)
      .digest("hex");
    const header = `ts=${ts};h1=${h1}`;
    assert.equal(
      verifyPaddleSignature(rawBody, header, secret, {
        nowSeconds: 1700000000,
      }),
      true,
    );
  });

  it("rejects tampered body", () => {
    const secret = "test_secret";
    const rawBody = '{"event_id":"evt_1"}';
    const ts = "1700000000";
    const h1 = createHmac("sha256", secret)
      .update(`${ts}:${rawBody}`)
      .digest("hex");
    assert.equal(
      verifyPaddleSignature('{"event_id":"evt_2"}', `ts=${ts};h1=${h1}`, secret, {
        nowSeconds: 1700000000,
      }),
      false,
    );
  });
});

describe("parsePaddleEvent", () => {
  it("parses event_id and event_type", () => {
    const event = parsePaddleEvent(
      JSON.stringify({
        event_id: "evt_9",
        event_type: "transaction.completed",
        occurred_at: "2026-10-04T00:00:00Z",
        data: { id: "txn_1" },
      }),
    );
    assert.ok(event);
    assert.equal(event.eventId, "evt_9");
    assert.equal(event.eventType, "transaction.completed");
  });
});
