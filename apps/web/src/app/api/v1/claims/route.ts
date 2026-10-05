import { NextResponse } from "next/server";
import { tryCreateClaim } from "@scoutline/core";
import { loadApiKeysFromEnv, resolveApiKey } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/v1/claims
 * Body: { entityId, niche?, geography?, ttlMs? }
 * Creates an exclusivity claim for the authenticated tenant.
 * In-memory only until claims table persistence is connected; response still
 * returns the decided claim object from pure tryCreateClaim logic.
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

  // Without a shared claims store, overlapping checks against other tenants
  // use an empty list here. Persistence phase will pass active claims from DB.
  const decision = tryCreateClaim(
    {
      id: crypto.randomUUID(),
      tenantId: auth.tenantId,
      entityId: body.entityId,
      niche: body.niche ?? null,
      geography: body.geography ?? null,
      ttlMs: body.ttlMs,
    },
    [],
  );

  if (!decision.ok) {
    const status =
      decision.reason === "already_claimed_by_other" ? 409 : 400;
    return NextResponse.json(
      { error: decision.reason },
      { status },
    );
  }

  return NextResponse.json({ claim: decision.claim }, { status: 201 });
}
