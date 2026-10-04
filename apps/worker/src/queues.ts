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

/** Default job options: idempotent-friendly retries with exponential backoff. */
export const DEFAULT_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: "exponential" as const,
    delay: 5_000,
  },
  removeOnComplete: {
    count: 200,
  },
  removeOnFail: {
    count: 500,
  },
};

export interface DiscoverJobData {
  tenantId: string;
  searchId: string;
  /** Adapter id, e.g. openstreetmap_overpass. */
  sourceId: string;
  /** Serialized DiscoverInput fields. */
  query?: string;
  categories?: string[];
  bbox?: {
    south: number;
    west: number;
    north: number;
    east: number;
  };
  incorporatedSince?: string;
  limit?: number;
  serviceKey?: string;
}

export interface EnrichJobData {
  tenantId: string;
  entityId: string;
  domain: string | null;
  evidenceUrl: string | null;
}

export interface AuditJobData {
  tenantId: string;
  entityId: string;
  url: string;
  html: string;
  statusCode?: number;
  serviceKeys?: string[];
}

export interface ScoreJobData {
  tenantId: string;
  entityId: string;
  leadId: string;
  freshnessClass: "fresh" | "contested" | "served";
  entityCountry?: string | null;
  entityCategory?: string | null;
}
