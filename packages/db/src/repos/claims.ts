import { and, eq, gt } from "drizzle-orm";
import type { Db } from "../client.js";
import { claims } from "../schema/tenant.js";

export interface InsertClaimInput {
  id?: string;
  tenantId: string;
  entityId: string;
  niche?: string | null;
  geography?: string | null;
  expiresAt: Date;
  createdAt?: Date;
}

/** Persist an exclusivity claim row. */
export async function insertClaim(db: Db, input: InsertClaimInput) {
  const [row] = await db
    .insert(claims)
    .values({
      id: input.id,
      tenantId: input.tenantId,
      entityId: input.entityId,
      niche: input.niche ?? null,
      geography: input.geography ?? null,
      expiresAt: input.expiresAt,
      createdAt: input.createdAt ?? new Date(),
    })
    .returning();
  return row;
}

/** Active (non-expired) claims for an entity. */
export async function listActiveClaimsForEntity(
  db: Db,
  entityId: string,
  now: Date = new Date(),
) {
  return db
    .select()
    .from(claims)
    .where(and(eq(claims.entityId, entityId), gt(claims.expiresAt, now)));
}
