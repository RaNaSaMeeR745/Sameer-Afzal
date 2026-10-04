import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createAdapter } from "./discover.js";

describe("createAdapter", () => {
  it("returns OverpassAdapter for openstreetmap_overpass", () => {
    const adapter = createAdapter("openstreetmap_overpass");
    assert.equal(adapter.id, "openstreetmap_overpass");
  });

  it("returns OsmAgencyAdapter for openstreetmap_agency", () => {
    const adapter = createAdapter("openstreetmap_agency");
    assert.equal(adapter.id, "openstreetmap_agency");
  });

  it("returns EdgarAdapter without credentials", () => {
    const adapter = createAdapter("us_sec_edgar");
    assert.equal(adapter.id, "us_sec_edgar");
  });

  it("throws on unknown sourceId", () => {
    assert.throws(() => createAdapter("not_a_source"), /Unknown sourceId/);
  });

  it("throws when Companies House key is missing", () => {
    const prev = process.env.COMPANIES_HOUSE_API_KEY;
    delete process.env.COMPANIES_HOUSE_API_KEY;
    try {
      assert.throws(
        () => createAdapter("uk_companies_house"),
        /COMPANIES_HOUSE_API_KEY/,
      );
    } finally {
      if (prev !== undefined) {
        process.env.COMPANIES_HOUSE_API_KEY = prev;
      }
    }
  });
});
