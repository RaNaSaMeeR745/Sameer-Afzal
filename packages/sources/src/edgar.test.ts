import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EdgarAdapter } from "./edgar.js";

describe("EdgarAdapter", () => {
  it("requires a query", async () => {
    const adapter = new EdgarAdapter({
      fetchImpl: async () => new Response("{}", { status: 200 }),
    });
    await assert.rejects(() => adapter.discover({}), /query/);
  });

  it("maps filing hits to unique candidates by CIK", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response(
        JSON.stringify({
          hits: {
            hits: [
              {
                _source: {
                  display_names: ["Acme Corp (CIK 0001234567)"],
                  form: "10-K",
                  file_date: "2026-03-01",
                  ciks: ["1234567"],
                  tickers: ["ACME"],
                },
              },
              {
                _source: {
                  display_names: ["Acme Corp (CIK 0001234567)"],
                  form: "8-K",
                  file_date: "2026-04-01",
                  ciks: ["1234567"],
                  tickers: ["ACME"],
                },
              },
            ],
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );

    const adapter = new EdgarAdapter({ fetchImpl: fakeFetch });
    const result = await adapter.discover({ query: "Acme" });

    assert.equal(result.candidates.length, 1);
    assert.equal(result.candidates[0]?.canonicalName, "Acme Corp");
    assert.equal(result.candidates[0]?.registryIds.cik, "0001234567");
    assert.equal(result.candidates[0]?.registryIds.ticker, "ACME");
    assert.equal(result.candidates[0]?.country, "US");
    assert.equal(result.candidates[0]?.source, "us_sec_edgar");
  });
});
