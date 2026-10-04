import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SERVICES,
  getService,
  servicesForMode,
  isValidServiceKey,
  ServiceKeySchema,
} from "./services.js";

describe("services", () => {
  it("includes the minimum catalog size from the product spec", () => {
    assert.ok(SERVICES.length >= 30);
  });

  it("getService returns aeo_geo with applicable modes", () => {
    const service = getService("aeo_geo");
    assert.equal(service.label.includes("AEO"), true);
    assert.ok(service.applicableModes.includes("agency"));
    assert.ok(service.detectableProblems.length > 0);
  });

  it("servicesForMode returns services applicable to local_business", () => {
    const local = servicesForMode("local_business");
    assert.ok(local.length > 0);
    assert.ok(local.every((s) => s.applicableModes.includes("local_business")));
  });

  it("isValidServiceKey accepts seo and rejects garbage", () => {
    assert.equal(isValidServiceKey("seo"), true);
    assert.equal(isValidServiceKey("not-a-service"), false);
  });

  it("ServiceKeySchema rejects invalid values", () => {
    const result = ServiceKeySchema.safeParse("invalid_key");
    assert.equal(result.success, false);
  });
});
