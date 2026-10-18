import { NextResponse } from "next/server";
import {
  tryCreateClaim,
  type ExclusivityClaim,
} from "@scoutline/core";
import { insertClaim, listActiveClaimsForEntity } from "@scoutline/db";
import { loadApiKeysFromEnv, resolveApiKey } from "@/lib/api-auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/claims
 * Body: { entityId, niche?, geography?, ttlMs? }
 * Creates an exclusivity claim for the authenticated tenant.
 * Overlap checks use active claims from the database when available.
 */
export async function POST(request: Request) {
  const keys = loadApiKeysFromEnv();
  const auth = resolveApiKey(request.headers.get("authorization"), keys);
  if (!auth) {
    return NextResponse.json(
      { error: "unauthorized", message: "Valid Bearer API key required" },
      { status: 401 },
    );
  }

  let body: {
    entityId?: string;
    niche?: string | null;
    geography?: string | null;
    ttlMs?: number;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body.entityId || typeof body.entityId !== "string") {
    return NextResponse.json(
      { error: "entity_id_required" },
      { status: 400 },
    );
  }

  const db = getDb();
  let existing: ExclusivityClaim[] = [];

  if (db) {
    const rows = await listActiveClaimsForEntity(db, body.entityId);
    existing = rows.map((r) => ({
      id: r.id,
      tenantId: r.tenantId,
      entityId: r.entityId,
      niche: r.niche,
      geography: r.geography,
      createdAt: r.createdAt.toISOString(),
      expiresAt: r.expiresAt.toISOString(),
    }));
  }

  const decision = tryCreateClaim(
    {
      id: crypto.randomUUID(),
      tenantId: auth.tenantId,
      entityId: body.entityId,
      niche: body.niche ?? null,
      geography: body.geography ?? null,
      ttlMs: body.ttlMs,
    },
    existing,
  );

  if (!decision.ok) {
    const status =
      decision.reason === "already_claimed_by_other" ? 409 : 400;
    return NextResponse.json(
      { error: decision.reason },
      { status },
    );
  }

  if (db) {
    const row = await insertClaim(db, {
      id: decision.claim.id,
      tenantId: decision.claim.tenantId,
      entityId: decision.claim.entityId,
      niche: decision.claim.niche,
      geography: decision.claim.geography,
      expiresAt: new Date(decision.claim.expiresAt),
      createdAt: new Date(decision.claim.createdAt),
    });
    return NextResponse.json(
      {
        claim: {
          id: row.id,
          tenantId: row.tenantId,
          entityId: row.entityId,
          niche: row.niche,
          geography: row.geography,
          createdAt: row.createdAt.toISOString(),
          expiresAt: row.expiresAt.toISOString(),
        },
      },
      { status: 201 },
    );
  }

  return NextResponse.json({ claim: decision.claim }, { status: 201 });
}
