/**
 * Fixed-window rate limiter for public API routes.
 * In-process only: each server instance has its own counters.
 * Suitable for MVP; shared Redis counters can replace this later.
 */

export interface RateLimitConfig {
  /** Max requests allowed in the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the current window resets. */
  retryAfterSeconds: number;
}

interface WindowState {
  count: number;
  windowStart: number;
}

const store = new Map<string, WindowState>();

const DEFAULT_CONFIG: RateLimitConfig = {
  limit: 60,
  windowMs: 60_000,
};

/**
 * Consume one request for the given key (typically tenantId or key hash).
 */
export function consumeRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG,
  now = Date.now(),
): RateLimitResult {
  const existing = store.get(key);
  if (!existing || now - existing.windowStart >= config.windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return {
      allowed: true,
      limit: config.limit,
      remaining: config.limit - 1,
      retryAfterSeconds: Math.ceil(config.windowMs / 1000),
    };
  }

  if (existing.count >= config.limit) {
    const elapsed = now - existing.windowStart;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((config.windowMs - elapsed) / 1000),
    );
    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    limit: config.limit,
    remaining: config.limit - existing.count,
    retryAfterSeconds: Math.ceil(
      (config.windowMs - (now - existing.windowStart)) / 1000,
    ),
  };
}

/** Headers for successful and limited responses. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
  };
  if (!result.allowed) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }
  return headers;
}

/** Reset store (tests only). */
export function resetRateLimitStore(): void {
  store.clear();
}
