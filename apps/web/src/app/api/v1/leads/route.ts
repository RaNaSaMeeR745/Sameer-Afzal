import { NextResponse } from "next/server";
import { listTenantLeads } from "@scoutline/db";
import { loadApiKeysFromEnv, resolveApiKey } from "@/lib/api-auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export interface LeadListItem {
  id: string;
  entityId: string;
  score: number;
  freshnessClass: "fresh" | "contested" | "served";
  status: string;
  serviceKey: string | null;
}

export interface LeadListResponse {
  data: LeadListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  tenantId: string;
}

/**
 * GET /api/v1/leads
 * Authorization: Bearer <api_key>
 * Lists tenant leads from the database when DATABASE_URL is set.
 */
export async function GET(request: Request) {
  const keys = loadApiKeysFromEnv();
  const auth = resolveApiKey(request.headers.get("authorization"), keys);
  if (!auth) {
    return NextResponse.json(
      { error: "unauthorized", message: "Valid Bearer API key required" },
      { status: 401 },
    );
  }

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("pageSize") ?? "20") || 20),
  );
  const freshnessParam = url.searchParams.get("freshness");
  if (
    freshnessParam &&
    !["fresh", "contested", "served"].includes(freshnessParam)
  ) {
    return NextResponse.json(
      { error: "invalid_freshness", message: "Use fresh, contested, or served" },
      { status: 400 },
    );
  }
  const freshness = freshnessParam as
    | "fresh"
    | "contested"
    | "served"
    | undefined;

  const db = getDb();
  if (!db) {
    const body: LeadListResponse = {
      data: [],
      pagination: { page, pageSize, total: 0 },
      tenantId: auth.tenantId,
    };
    return NextResponse.json(body);
  }

  const result = await listTenantLeads(db, {
    tenantId: auth.tenantId,
    page,
    pageSize,
    freshness,
  });

  const data: LeadListItem[] = result.data.map((row) => ({
    id: row.id,
    entityId: row.entityId,
    score: row.score,
    freshnessClass: row.freshnessClass as LeadListItem["freshnessClass"],
    status: row.status,
    serviceKey: row.serviceKey,
  }));

  const body: LeadListResponse = {
    data,
    pagination: result.pagination,
    tenantId: auth.tenantId,
  };

  return NextResponse.json(body);
}
