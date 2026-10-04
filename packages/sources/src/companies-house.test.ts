import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CompaniesHouseAdapter } from "./companies-house.js";

describe("CompaniesHouseAdapter", () => {
  it("requires an API key", () => {
    assert.throws(
      () => new CompaniesHouseAdapter({ apiKey: "" }),
      /apiKey/,
    );
  });

  it("maps search results to candidates", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          items: [
            {
              company_number: "12345678",
              title: "EXAMPLE LTD",
              company_status: "active",
              company_type: "ltd",
              date_of_creation: "2026-01-15",
              address: { locality: "London", country: "United Kingdom" },
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const adapter = new CompaniesHouseAdapter({
      apiKey: "test-key",
      fetchImpl: fakeFetch,
    });
    const result = await adapter.discover({ query: "EXAMPLE" });

    assert.equal(result.candidates.length, 1);
    assert.equal(result.candidates[0]?.canonicalName, "EXAMPLE LTD");
    assert.equal(result.candidates[0]?.registryIds.companies_house, "12345678");
    assert.equal(result.candidates[0]?.country, "United Kingdom");
    assert.equal(result.candidates[0]?.source, "uk_companies_house");
  });

  it("throws on HTTP 429", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response("too many", { status: 429 });
    const adapter = new CompaniesHouseAdapter({
      apiKey: "test-key",
      fetchImpl: fakeFetch,
    });
    await assert.rejects(
      () => adapter.discover({ query: "x" }),
      /rate limited/i,
    );
  });
});
