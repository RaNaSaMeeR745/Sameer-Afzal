import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BraveSearchAdapter, mapBraveResult } from "./brave-search.js";

describe("mapBraveResult", () => {
  it("maps title and domain from URL", () => {
    const c = mapBraveResult({
      title: "Acme Marketing | Digital Agency",
      url: "https://www.acmemarketing.example/about",
      description: "Full-service agency",
    });
    assert.ok(c);
    assert.equal(c.domain, "acmemarketing.example");
    assert.equal(c.canonicalName, "Acme Marketing");
    assert.equal(c.source, "brave_search");
  });

  it("returns null without url", () => {
    assert.equal(mapBraveResult({ title: "x" }), null);
  });
});

describe("BraveSearchAdapter", () => {
  it("requires api key", () => {
    assert.throws(() => new BraveSearchAdapter({ apiKey: "" }), /apiKey/);
  });

  it("requires query", async () => {
    const adapter = new BraveSearchAdapter({
      apiKey: "key",
      fetchImpl: async () => new Response("{}", { status: 200 }),
    });
    await assert.rejects(() => adapter.discover({}), /query/);
  });

  it("dedupes by domain", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          web: {
            results: [
              {
                title: "Same Co",
                url: "https://same.example/a",
              },
              {
                title: "Same Co Blog",
                url: "https://same.example/b",
              },
            ],
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const adapter = new BraveSearchAdapter({
      apiKey: "key",
      fetchImpl: fakeFetch,
    });
    const result = await adapter.discover({
      query: "marketing agency london",
    });
    assert.equal(result.candidates.length, 1);
    assert.equal(result.candidates[0]?.domain, "same.example");
  });
});
