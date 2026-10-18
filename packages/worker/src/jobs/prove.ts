import {
  buildProofReport,
  type AuditFinding,
  type ProofReport,
  type ScoreBreakdown,
} from "@scoutline/core";
import {
  createDb,
  insertProofAsset,
  type Db,
} from "@scoutline/db";

export interface ProveJobPayload {
  tenantId: string;
  leadId: string;
  entityName: string;
  entityDomain: string | null;
  entityUrl: string | null;
  serviceLabel: string | null;
  freshnessClass: "fresh" | "contested" | "served";
  score: number;
  breakdown: ScoreBreakdown;
  findings: AuditFinding[];
  preparedBy?: string;
  /** When set, enqueue a message job after proof is stored. */
  enqueueMessage?: boolean;
  contactName?: string | null;
  senderName?: string;
  senderAgency?: string;
  channel?: "email" | "linkedin" | "whatsapp";
}

export interface ProveJobResult {
  tenantId: string;
  leadId: string;
  report: ProofReport;
  shareToken: string;
  proofAssetId: string | null;
  sharePath: string;
}

function getDbFromEnv(): Db | null {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return null;
  }
  return createDb(url);
}

function createShareToken(): string {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().slice(0, 8);
}

/**
 * Build an HTML proof report, persist a proof_assets row with share token,
 * and return paths for public retrieval.
 */
export async function runProve(
  payload: ProveJobPayload,
  db: Db | null = getDbFromEnv(),
): Promise<ProveJobResult> {
  const report = buildProofReport({
    entityName: payload.entityName,
    entityDomain: payload.entityDomain,
    entityUrl: payload.entityUrl,
    serviceLabel: payload.serviceLabel,
    freshnessClass: payload.freshnessClass,
    score: payload.score,
    breakdown: payload.breakdown,
    findings: payload.findings,
    preparedBy: payload.preparedBy ?? "Scoutline",
  });

  const shareToken = createShareToken();
  let proofAssetId: string | null = null;

  if (db) {
    const row = await insertProofAsset(db, {
      tenantId: payload.tenantId,
      leadId: payload.leadId,
      shareToken,
      htmlRef: report.html,
    });
    proofAssetId = row.id;
  }

  return {
    tenantId: payload.tenantId,
    leadId: payload.leadId,
    report,
    shareToken,
    proofAssetId,
    sharePath: `/api/v1/proof/${shareToken}`,
  };
}
