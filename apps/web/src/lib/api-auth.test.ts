import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  apiKeyMatches,
  hashApiKey,
  loadApiKeysFromEnv,
  resolveApiKey,
} from "./api-auth.js";

describe("api-auth", () => {
  it("hashes and matches keys", () => {
    const raw = "sk_test_abcdefghijklmnopqrstuv";
    const hash = hashApiKey(raw);
    assert.equal(apiKeyMatches(raw, hash), true);
    assert.equal(apiKeyMatches("wrong_key_value_here", hash), false);
  });

  it("resolves Bearer token from env-style records", () => {
    const raw = "sk_live_1234567890abcdef";
    const keys = loadApiKeysFromEnv(`ten_1:default:${raw}`);
    assert.equal(keys.length, 1);
    const resolved = resolveApiKey(`Bearer ${raw}`, keys);
    assert.ok(resolved);
    assert.equal(resolved.tenantId, "ten_1");
  });

  it("rejects missing Authorization", () => {
    assert.equal(resolveApiKey(null, []), null);
  });
});
