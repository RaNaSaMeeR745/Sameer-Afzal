import type { AuditFinding } from "@scoutline/core";

export type MessageChannel = "email" | "linkedin" | "whatsapp";

export interface MessageDraftInput {
  entityName: string;
  entityDomain: string | null;
  contactName: string | null;
  serviceLabel: string;
  senderName: string;
  senderAgency: string;
  findings: readonly AuditFinding[];
  proofShareUrl: string | null;
  channel: MessageChannel;
  /** Optional one-line value prop for the tenant agency. */
  valueProp?: string | null;
}

export interface SequenceStep {
  step: 1 | 2 | 3;
  channel: MessageChannel;
  subject: string | null;
  body: string;
  delayDays: number;
}

export interface MessageDraftResult {
  channel: MessageChannel;
  subject: string | null;
  body: string;
  sequence: SequenceStep[];
  groundedFindingCodes: string[];
}

/**
 * Build personalized outreach drafts grounded only in verified findings.
 * Deterministic templates (no LLM required). Callers may later pass the same
 * input to an LLM rewriter while keeping evidence grounding rules.
 */
export function draftOutreach(input: MessageDraftInput): MessageDraftResult {
  const top = pickTopFindings(input.findings, 3);
  const groundedFindingCodes = top.map((f) => f.code);
  const greeting = input.contactName
    ? `Hi ${input.contactName.split(" ")[0]},`
    : `Hi,`;

  const findingLines = top.map((f, i) => `${i + 1}. ${f.title}: ${shorten(f.detail, 140)}`);
  const proofLine = input.proofShareUrl
    ? `I put the details in a short proof report: ${input.proofShareUrl}`
    : `Happy to send a short proof report with the evidence links.`;

  const value =
    input.valueProp?.trim() ||
    `${input.senderAgency} helps teams fix issues like these with ${input.serviceLabel}.`;

  const domainHint = input.entityDomain ? ` (${input.entityDomain})` : "";

  if (input.channel === "email") {
    const subject = top[0]
      ? `${input.entityName}: ${top[0].title}`
      : `${input.entityName} and ${input.serviceLabel}`;

    const body = [
      greeting,
      "",
      `I reviewed ${input.entityName}${domainHint} and found a few concrete gaps relevant to ${input.serviceLabel}:`,
      "",
      ...findingLines,
      "",
      proofLine,
      "",
      value,
      "",
      "If useful, I can share a 15-minute walkthrough of the fixes. If not, no problem.",
      "",
      `Best,`,
      input.senderName,
      input.senderAgency,
    ].join("\n");

    const sequence: SequenceStep[] = [
      { step: 1, channel: "email", subject, body, delayDays: 0 },
      {
        step: 2,
        channel: "email",
        subject: `Re: ${subject}`,
        body: [
          greeting,
          "",
          `Quick follow-up on the ${input.serviceLabel} gaps I flagged for ${input.entityName}.`,
          top[0] ? `The highest-impact one was: ${top[0].title}.` : "",
          proofLine,
          "",
          `Open to a short call this week?`,
          "",
          input.senderName,
        ]
          .filter(Boolean)
          .join("\n"),
        delayDays: 3,
      },
      {
        step: 3,
        channel: "email",
        subject: `Re: ${subject}`,
        body: [
          greeting,
          "",
          `Last note from me on this. If ${input.serviceLabel} is not a priority right now, I will close the loop.`,
          `If priorities change, the proof report remains available${input.proofShareUrl ? `: ${input.proofShareUrl}` : ""}.`,
          "",
          input.senderName,
        ].join("\n"),
        delayDays: 7,
      },
    ];

    return { channel: "email", subject, body, sequence, groundedFindingCodes };
  }

  if (input.channel === "linkedin") {
    const body = [
      greeting,
      `Noticed a few ${input.serviceLabel} issues on ${input.entityName}${domainHint}.`,
      top[0] ? `Top one: ${top[0].title}.` : "",
      proofLine,
      `Worth a quick chat?`,
      `– ${input.senderName}, ${input.senderAgency}`,
    ]
      .filter(Boolean)
      .join(" ");

    const sequence: SequenceStep[] = [
      { step: 1, channel: "linkedin", subject: null, body, delayDays: 0 },
      {
        step: 2,
        channel: "linkedin",
        subject: null,
        body: `${greeting} Following up on the ${input.serviceLabel} notes for ${input.entityName}. Happy to share the proof report if useful.`,
        delayDays: 4,
      },
      {
        step: 3,
        channel: "linkedin",
        subject: null,
        body: `${greeting} Closing the loop on my earlier note about ${input.entityName}. Glad to reconnect if ${input.serviceLabel} becomes a priority.`,
        delayDays: 8,
      },
    ];

    return {
      channel: "linkedin",
      subject: null,
      body,
      sequence,
      groundedFindingCodes,
    };
  }

  // whatsapp
  const body = [
    greeting,
    `I checked ${input.entityName}${domainHint} for ${input.serviceLabel} gaps.`,
    top[0] ? `Main issue: ${top[0].title}.` : "",
    proofLine,
    `– ${input.senderName} (${input.senderAgency})`,
  ]
    .filter(Boolean)
    .join(" ");

  const sequence: SequenceStep[] = [
    { step: 1, channel: "whatsapp", subject: null, body, delayDays: 0 },
    {
      step: 2,
      channel: "whatsapp",
      subject: null,
      body: `${greeting} Following up on the ${input.serviceLabel} proof for ${input.entityName}. Want me to resend the link?`,
      delayDays: 2,
    },
    {
      step: 3,
      channel: "whatsapp",
      subject: null,
      body: `${greeting} Last follow-up from me on ${input.entityName}. Happy to help later if useful.`,
      delayDays: 5,
    },
  ];

  return {
    channel: "whatsapp",
    subject: null,
    body,
    sequence,
    groundedFindingCodes,
  };
}

function pickTopFindings(
  findings: readonly AuditFinding[],
  limit: number,
): AuditFinding[] {
  const rank = (s: AuditFinding["severity"]) =>
    ({ critical: 5, high: 4, medium: 3, low: 2, info: 1 })[s] ?? 0;
  return [...findings]
    .sort((a, b) => rank(b.severity) - rank(a.severity))
    .slice(0, limit);
}

function shorten(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) {
    return t;
  }
  return `${t.slice(0, max - 1)}…`;
}
