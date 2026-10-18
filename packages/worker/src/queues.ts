/** BullMQ queue names for the lead pipeline. */
export const QUEUE_NAMES = {
  discover: "scoutline-discover",
  enrich: "scoutline-enrich",
  audit: "scoutline-audit",
  score: "scoutline-score",
  prove: "scoutline-prove",
  message: "scoutline-message",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
