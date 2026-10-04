import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildOverpassQuery, OverpassAdapter } from "./overpass.js";

describe("buildOverpassQuery", () => {
  it("includes bbox and amenity filters", () => {
    const q = buildOverpassQuery(
      { south: 51.5, west: -0.15, north: 51.52, east: -0.1 },
      ["restaurant", "clinic"],
      ["hairdresser"],
      20,
    );
    assert.match(q, /\[timeout:20\]/);
    assert.match(q, /51\.5,-0\.15,51\.52,-0\.1/);
    assert.match(q, /restaurant\|clinic/);
    assert.match(q, /hairdresser/);
    assert.match(q, /out center tags/);
  });
});

describe("OverpassAdapter", () => {
  it("maps Overpass elements to candidates and skips nameless ones", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          elements: [
            {
              type: "node",
              id: 1,
              lat: 51.5,
              lon: -0.12,
              tags: {
                name: "Test Cafe",
                amenity: "cafe",
                website: "https://testcafe.example",
                "addr:city": "London",
                "addr:country": "GB",
              },
            },
            {
              type: "node",
              id: 2,
              lat: 51.51,
              lon: -0.11,
              tags: { amenity: "restaurant" },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const adapter = new OverpassAdapter({ fetchImpl: fakeFetch });
    const result = await adapter.discover({
      bbox: { south: 51.5, west: -0.15, north: 51.52, east: -0.1 },
    });

    assert.equal(result.candidates.length, 1);
    assert.equal(result.candidates[0]?.canonicalName, "Test Cafe");
    assert.equal(result.candidates[0]?.domain, "testcafe.example");
    assert.equal(result.candidates[0]?.city, "London");
    assert.equal(result.candidates[0]?.source, "openstreetmap_overpass");
    assert.equal(result.queryMeta.elementCount, 2);
  });

  it("throws a clear error on HTTP 429", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response("rate limited", { status: 429 });

    const adapter = new OverpassAdapter({ fetchImpl: fakeFetch });
    await assert.rejects(
      () =>
        adapter.discover({
          bbox: { south: 0, west: 0, north: 1, east: 1 },
        }),
      /rate limited/i,
    );
  });
});
