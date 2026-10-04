import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractCompanyFromTitle,
  HnAlgoliaAdapter,
  mapHnHit,
} from "./hn-algolia.js";

describe("extractCompanyFromTitle", () => {
  it("parses YC-style hiring titles", () => {
    assert.equal(
      extractCompanyFromTitle("Acme (YC W24) is hiring a growth marketer"),
      "Acme",
    );
  });

  it("parses simple is hiring titles", () => {
    assert.equal(
      extractCompanyFromTitle("Widget Co is hiring SEO engineers"),
      "Widget Co",
    );
  });
});

describe("mapHnHit", () => {
  it("returns null when title is not a hiring post", () => {
    assert.equal(
      mapHnHit({ title: "Show HN: My side project", objectID: "1" }),
      null,
    );
  });

  it("maps hiring hits with domain from URL", () => {
    const c = mapHnHit({
      objectID: "42",
      title: "NovaLabs is hiring a performance marketer",
      url: "https://www.novalabs.example/jobs",
    });
    assert.ok(c);
    assert.equal(c.canonicalName, "NovaLabs");
    assert.equal(c.domain, "novalabs.example");
    assert.equal(c.source, "hackernews_algolia");
  });
});

describe("HnAlgoliaAdapter", () => {
  it("discovers candidates from mocked search results", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          hits: [
            {
              objectID: "99",
              title: "PixelForge is hiring a paid social lead",
              url: "https://pixelforge.example/careers",
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const adapter = new HnAlgoliaAdapter({ fetchImpl: fakeFetch });
    const result = await adapter.discover({
      query: "hiring",
      categories: ["marketing"],
    });
    assert.equal(result.candidates.length, 1);
    assert.equal(result.candidates[0]?.canonicalName, "PixelForge");
  });
});
