import type { Job } from "bullmq";
import { draftOutreach, type MessageChannel } from "@scoutline/ai";
import type { AuditFinding, ServiceKey } from "@scoutline/core";

export interface MessageJobData {
  tenantId: string;
  leadId: string;
  entityId: string;
  entityName: string;
  entityDomain: string | null;
  contactName: string | null;
  serviceLabel: string;
  senderName: string;
  senderAgency: string;
  channel: MessageChannel;
  proofShareUrl: string | null;
  valueProp?: string | null;
  findings: Array<{
    code: string;
    severity: "info" | "low" | "medium" | "high" | "critical";
    title: string;
    detail: string;
    evidenceUrl: string | null;
    serviceKeys: string[];
  }>;
}

export interface MessageJobResult {
  tenantId: string;
  leadId: string;
  channel: MessageChannel;
  subject: string | null;
  body: string;
  sequence: ReturnType<typeof draftOutreach>["sequence"];
  groundedFindingCodes: string[];
}

/** Message job processor: evidence-grounded outreach + 3-step sequence. */
export async function processMessageJob(
  job: Job<MessageJobData>,
): Promise<MessageJobResult> {
  const data = job.data;
  await job.updateProgress(20);

  const findings: AuditFinding[] = data.findings.map((f) => ({
    code: f.code,
    severity: f.severity,
    title: f.title,
    detail: f.detail,
    evidenceUrl: f.evidenceUrl,
    serviceKeys: f.serviceKeys as ServiceKey[],
  }));

  const draft = draftOutreach({
    entityName: data.entityName,
    entityDomain: data.entityDomain,
    contactName: data.contactName,
    serviceLabel: data.serviceLabel,
    senderName: data.senderName,
    senderAgency: data.senderAgency,
    findings,
    proofShareUrl: data.proofShareUrl,
    channel: data.channel,
    valueProp: data.valueProp,
  });

  await job.updateProgress(100);

  return {
    tenantId: data.tenantId,
    leadId: data.leadId,
    channel: draft.channel,
    subject: draft.subject,
    body: draft.body,
    sequence: draft.sequence,
    groundedFindingCodes: draft.groundedFindingCodes,
  };
}
