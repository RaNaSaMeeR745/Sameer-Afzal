import { eq } from "drizzle-orm";
import type { Db } from "../client.js";
import { entities } from "../schema/global.js";

export interface EnsureEntityInput {
  canonicalName: string;
  domain?: string | null;
  country?: string | null;
  city?: string | null;
  category?: string | null;
  registryIds?: Record<string, string>;
}

/**
 * Find entity by domain when provided, otherwise insert a new row.
 * Domain match is exact (normalized lowercase).
 */
export async function ensureEntity(db: Db, input: EnsureEntityInput) {
  const domain = input.domain?.trim().toLowerCase() || null;

  if (domain) {
    const existing = await db
      .select()
      .from(entities)
      .where(eq(entities.domain, domain))
      .limit(1);
    if (existing[0]) {
      return existing[0];
    }
  }

  const [row] = await db
    .insert(entities)
    .values({
      canonicalName: input.canonicalName,
      domain,
      country: input.country ?? null,
      city: input.city ?? null,
      category: input.category ?? null,
      registryIds: input.registryIds ?? {},
    })
    .returning();

  return row;
}
