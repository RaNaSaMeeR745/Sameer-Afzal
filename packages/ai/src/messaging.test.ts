import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { draftOutreach } from "./messaging.js";

describe("draftOutreach", () => {
  it("grounds email body in findings and builds 3-step sequence", () => {
    const result = draftOutreach({
      entityName: "Acme Dental",
      entityDomain: "acme.example",
      contactName: "Jordan Lee",
      serviceLabel: "SEO",
      senderName: "Sam Rivera",
      senderAgency: "North Star Agency",
      findings: [
        {
          code: "seo_missing_title",
          severity: "high",
          title: "Missing document title",
          detail: "The page has no title element.",
          evidenceUrl: "https://acme.example",
          serviceKeys: ["seo"],
        },
      ],
      proofShareUrl: "https://app.example/proof/abc",
      channel: "email",
    });

    assert.equal(result.channel, "email");
    assert.ok(result.subject?.includes("Acme Dental"));
    assert.match(result.body, /Jordan/);
    assert.match(result.body, /Missing document title/);
    assert.match(result.body, /https:\/\/app\.example\/proof\/abc/);
    assert.equal(result.sequence.length, 3);
    assert.deepEqual(result.groundedFindingCodes, ["seo_missing_title"]);
  });

  it("omits subject for linkedin", () => {
    const result = draftOutreach({
      entityName: "Acme",
      entityDomain: null,
      contactName: null,
      serviceLabel: "SEO",
      senderName: "Sam",
      senderAgency: "Agency",
      findings: [],
      proofShareUrl: null,
      channel: "linkedin",
    });
    assert.equal(result.subject, null);
    assert.equal(result.sequence.length, 3);
  });
});
