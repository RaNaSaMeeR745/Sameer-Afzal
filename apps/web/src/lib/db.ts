import { createDb, type Db } from "@scoutline/db";

let cached: Db | null = null;

/**
 * Shared Drizzle client for API routes.
 * Returns null when DATABASE_URL is not set (local UI without Postgres).
 */
export function getDb(): Db | null {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return null;
  }
  if (!cached) {
    cached = createDb(url);
  }
  return cached;
}

export function requireDb(): Db {
  const db = getDb();
  if (!db) {
    throw new Error("DATABASE_URL is not configured");
  }
  return db;
}
