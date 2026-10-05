import { createHash, timingSafeEqual } from "node:crypto";

export interface ApiKeyRecord {
  /** SHA-256 hex of the raw key. */
  keyHash: string;
  tenantId: string;
  label: string;
  revoked: boolean;
}

/** Hash a raw API key for storage or comparison. */
export function hashApiKey(rawKey: string): string {
  return createHash("sha256").update(rawKey, "utf8").digest("hex");
}

/**
 * Constant-time compare of a raw key against a stored hash.
 */
export function apiKeyMatches(rawKey: string, keyHash: string): boolean {
  try {
    const a = Buffer.from(hashApiKey(rawKey), "hex");
    const b = Buffer.from(keyHash, "hex");
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Resolve tenant from Authorization: Bearer <key> using an in-memory key list.
 * Production will load keys from the api_keys table; this interface stays the same.
 */
export function resolveApiKey(
  authorizationHeader: string | null,
  keys: readonly ApiKeyRecord[],
): { tenantId: string; label: string } | null {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }
  const raw = authorizationHeader.slice("Bearer ".length).trim();
  if (!raw || raw.length < 16) {
    return null;
  }
  for (const record of keys) {
    if (record.revoked) {
      continue;
    }
    if (apiKeyMatches(raw, record.keyHash)) {
      return { tenantId: record.tenantId, label: record.label };
    }
  }
  return null;
}

/**
 * Load API key records from environment for bootstrap / single-tenant testing.
 * Format: SCOUTLINE_API_KEYS="tenantId:label:rawKey,tenantId2:label2:rawKey2"
 */
export function loadApiKeysFromEnv(
  envValue = process.env.SCOUTLINE_API_KEYS,
): ApiKeyRecord[] {
  if (!envValue?.trim()) {
    return [];
  }
  const out: ApiKeyRecord[] = [];
  for (const part of envValue.split(",")) {
    const [tenantId, label, rawKey] = part.split(":");
    if (!tenantId || !label || !rawKey) {
      continue;
    }
    out.push({
      tenantId: tenantId.trim(),
      label: label.trim(),
      keyHash: hashApiKey(rawKey.trim()),
      revoked: false,
    });
  }
  return out;
}
