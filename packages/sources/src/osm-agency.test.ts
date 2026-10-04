import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildOverpassAgencyQuery,
  OsmAgencyAdapter,
} from "./osm-agency.js";

describe("buildOverpassAgencyQuery", () => {
  it("includes office filters and bbox", () => {
    const q = buildOverpassAgencyQuery(
      { south: 51.5, west: -0.15, north: 51.52, east: -0.1 },
      ["advertising_agency", "marketing"],
      20,
    );
    assert.match(q, /office/);
    assert.match(q, /advertising_agency\|marketing/);
    assert.match(q, /51\.5,-0\.15,51\.52,-0\.1/);
  });
});

describe("OsmAgencyAdapter", () => {
  it("requires bbox", async () => {
    const adapter = new OsmAgencyAdapter({
      fetchImpl: async () => new Response("{}", { status: 200 }),
    });
    await assert.rejects(() => adapter.discover({}), /bbox/);
  });

  it("maps named office elements", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          elements: [
            {
              type: "node",
              id: 7,
              lat: 51.5,
              lon: -0.12,
              tags: {
                name: "North Star Ads",
                office: "advertising_agency",
                website: "https://northstar.example",
              },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const adapter = new OsmAgencyAdapter({ fetchImpl: fakeFetch });
    const result = await adapter.discover({
      bbox: { south: 51.5, west: -0.15, north: 51.52, east: -0.1 },
    });
    assert.equal(result.candidates.length, 1);
    assert.equal(result.candidates[0]?.canonicalName, "North Star Ads");
    assert.equal(result.candidates[0]?.category, "advertising_agency");
    assert.equal(result.candidates[0]?.source, "openstreetmap_agency");
  });
});
