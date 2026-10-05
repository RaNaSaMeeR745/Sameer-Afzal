import { NextResponse } from "next/server";
import { loadApiKeysFromEnv, resolveApiKey } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export interface LeadListItem {
  id: string;
  entityName: string;
  domain: string | null;
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
 * Returns tenant leads. Empty list until worker persistence is connected.
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
  const freshness = url.searchParams.get("freshness");

  // Persistence not wired: return an empty, correctly shaped page for the tenant.
  const data: LeadListItem[] = [];
  if (freshness && !["fresh", "contested", "served"].includes(freshness)) {
    return NextResponse.json(
      { error: "invalid_freshness", message: "Use fresh, contested, or served" },
      { status: 400 },
    );
  }

  const body: LeadListResponse = {
    data,
    pagination: { page, pageSize, total: 0 },
    tenantId: auth.tenantId,
  };

  return NextResponse.json(body);
}
