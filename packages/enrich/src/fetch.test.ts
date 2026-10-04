import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { robotsAllowsPath, fetchPage } from "./fetch.js";

describe("robotsAllowsPath", () => {
  it("allows when no matching disallow", () => {
    const txt = "User-agent: *\nDisallow: /admin\n";
    assert.equal(robotsAllowsPath(txt, "/about", "ScoutlineBot"), true);
  });

  it("blocks disallowed path", () => {
    const txt = "User-agent: *\nDisallow: /private\n";
    assert.equal(robotsAllowsPath(txt, "/private/page", "ScoutlineBot"), false);
  });
});

describe("fetchPage", () => {
  it("refuses localhost", async () => {
    await assert.rejects(
      () => fetchPage({ url: "http://localhost/test", skipRobots: true }),
      /private host/,
    );
  });

  it("returns html from mock fetch", async () => {
    const fakeFetch: typeof fetch = async () =>
      new Response("<html><title>Hi</title></html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      });

    const page = await fetchPage({
      url: "https://example.com/",
      fetchImpl: fakeFetch,
      skipRobots: true,
    });
    assert.equal(page.statusCode, 200);
    assert.match(page.html, /Hi/);
  });
});
