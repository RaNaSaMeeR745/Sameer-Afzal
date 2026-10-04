import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MODES,
  getMode,
  modesForType,
  isValidModeKey,
  ModeKeySchema,
} from "./modes.js";

describe("modes", () => {
  it("defines exactly five modes", () => {
    assert.equal(MODES.length, 5);
  });

  it("getMode returns the local_business definition", () => {
    const mode = getMode("local_business");
    assert.equal(mode.type, "B2C");
    assert.equal(mode.key, "local_business");
    assert.ok(mode.primarySignals.length > 0);
  });

  it("modesForType filters B2B modes", () => {
    const b2b = modesForType("B2B");
    assert.ok(b2b.every((m) => m.type === "B2B"));
    assert.ok(b2b.some((m) => m.key === "agency"));
  });

  it("isValidModeKey accepts known keys and rejects unknown", () => {
    assert.equal(isValidModeKey("agency"), true);
    assert.equal(isValidModeKey("not_a_mode"), false);
  });

  it("ModeKeySchema parses valid keys", () => {
    const result = ModeKeySchema.safeParse("hiring_company");
    assert.equal(result.success, true);
  });

  it("getMode throws on unknown key at runtime via cast", () => {
    assert.throws(() => getMode("unknown" as never));
  });
});
