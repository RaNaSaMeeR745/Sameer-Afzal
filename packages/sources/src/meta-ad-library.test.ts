import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapMetaAd, MetaAdLibraryAdapter } from "./meta-ad-library.js";

describe("mapMetaAd", () => {
  it("requires page_name", () => {
    assert.equal(mapMetaAd({ id: "1" }), null);
  });

  it("maps page and ad ids", () => {
    const c = mapMetaAd({
      id: "ad1",
      page_id: "page9",
      page_name: "Bright Brand",
      ad_snapshot_url: "https://www.facebook.com/ads/library/?id=ad1",
      ad_delivery_start_time: "2026-09-01T00:00:00+0000",
    });
    assert.ok(c);
    assert.equal(c.canonicalName, "Bright Brand");
    assert.equal(c.registryIds.meta_page_id, "page9");
    assert.equal(c.signalType, "meta_active_ad");
  });
});

describe("MetaAdLibraryAdapter", () => {
  it("requires access token", () => {
    assert.throws(
      () => new MetaAdLibraryAdapter({ accessToken: "" }),
      /accessToken/,
    );
  });

  it("requires query", async () => {
    const adapter = new MetaAdLibraryAdapter({
      accessToken: "token",
      fetchImpl: async () => new Response("{}", { status: 200 }),
    });
    await assert.rejects(() => adapter.discover({}), /query/);
  });

  it("dedupes by page and maps candidates", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          data: [
            { id: "1", page_id: "p1", page_name: "Same Page" },
            { id: "2", page_id: "p1", page_name: "Same Page" },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const adapter = new MetaAdLibraryAdapter({
      accessToken: "token",
      countries: ["GB"],
      fetchImpl: fakeFetch,
    });
    const result = await adapter.discover({ query: "seo agency" });
    assert.equal(result.candidates.length, 1);
    assert.equal(result.candidates[0]?.canonicalName, "Same Page");
  });

  it("throws on Graph rate limit error 613", async () => {
    const adapter = new MetaAdLibraryAdapter({
      accessToken: "token",
      fetchImpl: async () =>
        new Response(
          JSON.stringify({ error: { message: "rate limit", code: 613 } }),
          { status: 400 },
        ),
    });
    await assert.rejects(
      () => adapter.discover({ query: "test" }),
      /rate limited/i,
    );
  });
});
