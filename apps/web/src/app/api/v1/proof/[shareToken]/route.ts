import { NextResponse } from "next/server";
import {
  getProofByShareToken,
  incrementProofViewCount,
} from "@scoutline/db";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/proof/:shareToken
 * Public proof report. No auth. Returns stored HTML when available.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ shareToken: string }> },
) {
  const { shareToken } = await context.params;
  if (!shareToken || shareToken.length < 16) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "database_not_configured" },
      { status: 503 },
    );
  }

  const asset = await getProofByShareToken(db, shareToken);
  if (!asset) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await incrementProofViewCount(db, shareToken);

  if (asset.htmlRef && asset.htmlRef.includes("<!DOCTYPE html>")) {
    return new NextResponse(asset.htmlRef, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  }

  return NextResponse.json({
    id: asset.id,
    leadId: asset.leadId,
    shareToken: asset.shareToken,
    viewCount: asset.viewCount + 1,
    htmlRef: asset.htmlRef,
    pdfRef: asset.pdfRef,
  });
}
