import { eq } from "drizzle-orm";
import type { Db } from "../client.js";
import { proofAssets } from "../schema/tenant.js";

export interface InsertProofAssetInput {
  tenantId: string;
  leadId: string;
  shareToken: string;
  htmlRef?: string | null;
  pdfRef?: string | null;
}

/** Insert a proof asset row with a unique share token. */
export async function insertProofAsset(db: Db, input: InsertProofAssetInput) {
  const [row] = await db
    .insert(proofAssets)
    .values({
      tenantId: input.tenantId,
      leadId: input.leadId,
      shareToken: input.shareToken,
      htmlRef: input.htmlRef ?? null,
      pdfRef: input.pdfRef ?? null,
    })
    .returning();
  return row;
}

/** Look up a proof asset by public share token. */
export async function getProofByShareToken(db: Db, shareToken: string) {
  const rows = await db
    .select()
    .from(proofAssets)
    .where(eq(proofAssets.shareToken, shareToken))
    .limit(1);
  return rows[0] ?? null;
}

/** Increment view count for analytics. */
export async function incrementProofViewCount(db: Db, shareToken: string) {
  const existing = await getProofByShareToken(db, shareToken);
  if (!existing) {
    return null;
  }
  const [row] = await db
    .update(proofAssets)
    .set({ viewCount: existing.viewCount + 1 })
    .where(eq(proofAssets.id, existing.id))
    .returning();
  return row;
}
