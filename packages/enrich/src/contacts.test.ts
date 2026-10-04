import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractContacts } from "./contacts.js";

describe("extractContacts", () => {
  it("extracts mailto and tel", () => {
    const html = `
      <a href="mailto:info@acme.example">Email us</a>
      <a href="tel:+15551234567">Call</a>
    `;
    const contacts = extractContacts(html);
    assert.ok(contacts.some((c) => c.email === "info@acme.example"));
    assert.ok(contacts.some((c) => c.phone === "+15551234567"));
    assert.equal(
      contacts.find((c) => c.email === "info@acme.example")?.role,
      "info",
    );
  });
});
