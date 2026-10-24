import { NextResponse } from "next/server";
import { getTenantLeadById } from "@scoutline/db";
import { loadApiKeysFromEnv, resolveApiKey } from "@/lib/api-auth";
import { getDb } from "@/lib/db";
import { consumeRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/leads/:id
 * Authorization: Bearer <api_key>
 * Returns one tenant lead or 404.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const keys = loadApiKeysFromEnv();
  const auth = resolveApiKey(request.headers.get("authorization"), keys);
  if (!auth) {
    return NextResponse.json(
      { error: "unauthorized", message: "Valid Bearer API key required" },
      { status: 401 },
    );
  }

  const limited = consumeRateLimit(`api:${auth.tenantId}`);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(limited) },
    );
  }

  const { id } = await context.params;
  if (!id || id.length < 8) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "database_not_configured" },
      { status: 503, headers: rateLimitHeaders(limited) },
    );
  }

  const row = await getTenantLeadById(db, auth.tenantId, id);
  if (!row) {
    return NextResponse.json(
      { error: "not_found" },
      { status: 404, headers: rateLimitHeaders(limited) },
    );
  }

  return NextResponse.json(
    {
      id: row.id,
      entityId: row.entityId,
      score: row.score,
      scoreBreakdown: row.scoreBreakdown,
      freshnessClass: row.freshnessClass,
      status: row.status,
      serviceKey: row.serviceKey,
      modeKeys: row.modeKeys,
      notes: row.notes,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      tenantId: auth.tenantId,
    },
    { headers: rateLimitHeaders(limited) },
  );
}
