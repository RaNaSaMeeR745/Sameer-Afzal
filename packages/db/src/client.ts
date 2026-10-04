import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

export type Db = ReturnType<typeof createDb>;

/**
 * Create a Drizzle client bound to DATABASE_URL.
 * Caller must supply the connection string from the environment.
 */
export function createDb(connectionString: string) {
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to create a database client");
  }
  const sql = postgres(connectionString, { max: 10 });
  return drizzle(sql, { schema });
}

/**
 * Set the current tenant for RLS policies.
 * Call inside a transaction before tenant-scoped queries.
 */
export async function setTenantContext(
  sql: postgres.Sql,
  tenantId: string,
): Promise<void> {
  await sql`select set_config('app.current_tenant_id', ${tenantId}, true)`;
}
