import { Worker, type Job } from "bullmq";
import IORedis from "ioredis";
import { QUEUE_NAMES } from "./queues.js";
import {
  runScoreAndPersist,
  type ScoreAndPersistPayload,
} from "./jobs/score-and-persist.js";

export { QUEUE_NAMES } from "./queues.js";
export {
  runScoreAndPersist,
  type ScoreAndPersistPayload,
  type ScoreAndPersistResult,
} from "./jobs/score-and-persist.js";

/**
 * Start BullMQ workers when REDIS_URL is set.
 * score queue runs runScoreAndPersist.
 */
export function startWorkers(): Worker[] {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL is required to start workers");
  }

  const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
  const workers: Worker[] = [];

  const scoreWorker = new Worker(
    QUEUE_NAMES.score,
    async (job: Job<ScoreAndPersistPayload>) => {
      return runScoreAndPersist(job.data);
    },
    { connection },
  );

  scoreWorker.on("failed", (job, err) => {
    console.error(
      `[score] job ${job?.id ?? "unknown"} failed:`,
      err.message,
    );
  });

  workers.push(scoreWorker);
  return workers;
}

/** CLI entry: node dist/index.js */
const isMain =
  process.argv[1]?.endsWith("index.js") ||
  process.argv[1]?.endsWith("index.ts");

if (isMain) {
  const workers = startWorkers();
  console.log(
    `Scoutline worker started: ${workers.map((w) => w.name).join(", ")}`,
  );
}
