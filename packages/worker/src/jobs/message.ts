import type { AuditFinding } from "@scoutline/core";
import {
  draftOutreach,
  type MessageChannel,
  type MessageDraftResult,
} from "@scoutline/ai";

export interface MessageJobPayload {
  tenantId: string;
  leadId: string;
  entityName: string;
  entityDomain: string | null;
  contactName: string | null;
  serviceLabel: string;
  senderName: string;
  senderAgency: string;
  findings: AuditFinding[];
  proofShareUrl: string | null;
  channel: MessageChannel;
  valueProp?: string | null;
}

export interface MessageJobResult {
  tenantId: string;
  leadId: string;
  draft: MessageDraftResult;
}

/** Draft grounded outreach for a lead. */
export function runMessage(payload: MessageJobPayload): MessageJobResult {
  const draft = draftOutreach({
    entityName: payload.entityName,
    entityDomain: payload.entityDomain,
    contactName: payload.contactName,
    serviceLabel: payload.serviceLabel,
    senderName: payload.senderName,
    senderAgency: payload.senderAgency,
    findings: payload.findings,
    proofShareUrl: payload.proofShareUrl,
    channel: payload.channel,
    valueProp: payload.valueProp,
  });

  return {
    tenantId: payload.tenantId,
    leadId: payload.leadId,
    draft,
  };
}
