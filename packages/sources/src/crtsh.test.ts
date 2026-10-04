import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CrtShAdapter, mapCrtShRow } from "./crtsh.js";

describe("mapCrtShRow", () => {
  it("extracts hostnames and skips wildcards", () => {
    const candidates = mapCrtShRow({
      id: 99,
      common_name: "www.example.com",
      name_value: "www.example.com\n*.example.com\napp.example.com",
      not_before: "2026-09-01T00:00:00",
    });
    const domains = candidates.map((c) => c.domain).sort();
    assert.deepEqual(domains, ["app.example.com", "www.example.com"]);
    assert.equal(candidates[0]?.source, "certificate_transparency_crtsh");
    assert.equal(candidates[0]?.registryIds.crtsh, "99");
  });
});

describe("CrtShAdapter", () => {
  it("requires a query", async () => {
    const adapter = new CrtShAdapter({
      fetchImpl: async () => new Response("[]", { status: 200 }),
    });
    await assert.rejects(() => adapter.discover({}), /query/);
  });

  it("filters by not_before when incorporatedSince is set", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response(
        JSON.stringify([
          {
            id: 1,
            common_name: "old.example.com",
            name_value: "old.example.com",
            not_before: "2020-01-01T00:00:00",
          },
          {
            id: 2,
            common_name: "new.example.com",
            name_value: "new.example.com",
            not_before: "2026-09-15T00:00:00",
          },
        ]),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const adapter = new CrtShAdapter({ fetchImpl: fakeFetch });
    const result = await adapter.discover({
      query: "example.com",
      incorporatedSince: "2026-01-01",
    });

    assert.equal(result.candidates.length, 1);
    assert.equal(result.candidates[0]?.domain, "new.example.com");
  });

  it("throws on HTTP 429", async () => {
    const adapter = new CrtShAdapter({
      fetchImpl: async () => new Response("slow down", { status: 429 }),
    });
    await assert.rejects(
      () => adapter.discover({ query: "example.com" }),
      /rate limited/i,
    );
  });
});
