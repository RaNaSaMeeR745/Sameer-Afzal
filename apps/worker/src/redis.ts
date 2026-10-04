import { Redis } from "ioredis";

/**
 * Create a Redis connection for BullMQ.
 * Requires REDIS_URL (e.g. redis://127.0.0.1:6379).
 * maxRetriesPerRequest must be null for BullMQ workers.
 */
export function createRedisConnection(redisUrl = process.env.REDIS_URL): Redis {
  if (!redisUrl) {
    throw new Error(
      "REDIS_URL is required to start the worker (e.g. redis://127.0.0.1:6379)",
    );
  }

  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
}
