import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AdzunaAdapter, mapAdzunaJob } from "./adzuna.js";

describe("mapAdzunaJob", () => {
  it("requires a company name", () => {
    assert.equal(mapAdzunaJob({ title: "SEO Manager" }), null);
  });

  it("maps company and location", () => {
    const c = mapAdzunaJob({
      id: "abc",
      title: "SEO Manager",
      company: { display_name: "Bright Agency" },
      location: { display_name: "Manchester, UK", area: ["UK", "Manchester"] },
      redirect_url: "https://adzuna.example/job/1",
      category: { label: "PR, Advertising & Marketing Jobs" },
    });
    assert.ok(c);
    assert.equal(c.canonicalName, "Bright Agency");
    assert.equal(c.city, "Manchester");
    assert.equal(c.source, "adzuna_jobs");
  });
});

describe("AdzunaAdapter", () => {
  it("requires app credentials", () => {
    assert.throws(
      () => new AdzunaAdapter({ appId: "", appKey: "" }),
      /appId/,
    );
  });

  it("discovers unique companies from job results", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          results: [
            {
              id: "1",
              title: "Marketing Manager",
              company: { display_name: "Same Co" },
            },
            {
              id: "2",
              title: "SEO Lead",
              company: { display_name: "Same Co" },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const adapter = new AdzunaAdapter({
      appId: "id",
      appKey: "key",
      fetchImpl: fakeFetch,
    });
    const result = await adapter.discover({ query: "SEO" });
    assert.equal(result.candidates.length, 1);
    assert.equal(result.candidates[0]?.canonicalName, "Same Co");
  });
});
