import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { entities } from "./global.js";

/** Workspace (agency account). */
export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/** User membership in a tenant. */
export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull(),
    role: text("role").notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("memberships_tenant_idx").on(t.tenantId),
    uniqueIndex("memberships_tenant_user_uidx").on(t.tenantId, t.userId),
  ],
);

/** Invitation to join a tenant. */
export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role").notNull().default("member"),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("invitations_tenant_idx").on(t.tenantId)],
);

/** What the tenant sells and their ICP. */
export const offerProfiles = pgTable(
  "offer_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    services: jsonb("services").$type<string[]>().default([]).notNull(),
    icp: jsonb("icp").$type<Record<string, unknown>>().default({}).notNull(),
    targetGeography: text("target_geography"),
    priceRange: text("price_range"),
    caseStudies: jsonb("case_studies").$type<unknown[]>().default([]).notNull(),
    tone: text("tone"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("offer_profiles_tenant_idx").on(t.tenantId)],
);

/** Saved discovery search configuration. */
export const searches = pgTable(
  "searches",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    leadType: text("lead_type").notNull(),
    modes: jsonb("modes").$type<string[]>().notNull(),
    geography: text("geography").notNull(),
    niche: text("niche"),
    serviceKey: text("service_key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("searches_tenant_idx").on(t.tenantId)],
);

/** Tenant-scoped lead linked to a global entity. */
export const tenantLeads = pgTable(
  "tenant_leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    entityId: uuid("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "restrict" }),
    score: integer("score").notNull().default(0),
    scoreBreakdown: jsonb("score_breakdown")
      .$type<Record<string, unknown>>()
      .notNull(),
    freshnessClass: text("freshness_class").notNull().default("fresh"),
    status: text("status").notNull().default("discovered"),
    ownerUserId: uuid("owner_user_id"),
    notes: text("notes"),
    serviceKey: text("service_key"),
    modeKeys: jsonb("mode_keys").$type<string[]>().default([]).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("tenant_leads_tenant_idx").on(t.tenantId),
    index("tenant_leads_entity_idx").on(t.entityId),
    index("tenant_leads_score_idx").on(t.score),
    uniqueIndex("tenant_leads_tenant_entity_uidx").on(t.tenantId, t.entityId),
  ],
);

/** Proof report asset for a lead. */
export const proofAssets = pgTable(
  "proof_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => tenantLeads.id, { onDelete: "cascade" }),
    htmlRef: text("html_ref"),
    pdfRef: text("pdf_ref"),
    shareToken: text("share_token").notNull().unique(),
    viewCount: integer("view_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("proof_assets_tenant_idx").on(t.tenantId),
    index("proof_assets_lead_idx").on(t.leadId),
  ],
);

/** Outreach message draft or sent step. */
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => tenantLeads.id, { onDelete: "cascade" }),
    channel: text("channel").notNull(),
    step: integer("step").notNull().default(1),
    body: text("body").notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    outcome: text("outcome"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("messages_tenant_idx").on(t.tenantId),
    index("messages_lead_idx").on(t.leadId),
  ],
);

/** Outcome used for per-tenant learning. */
export const outcomes = pgTable(
  "outcomes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => tenantLeads.id, { onDelete: "cascade" }),
    result: text("result").notNull(),
    reason: text("reason"),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("outcomes_tenant_idx").on(t.tenantId),
    index("outcomes_lead_idx").on(t.leadId),
  ],
);

/** Exclusivity claim on an entity. */
export const claims = pgTable(
  "claims",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    entityId: uuid("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    niche: text("niche"),
    geography: text("geography"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("claims_tenant_idx").on(t.tenantId),
    index("claims_entity_idx").on(t.entityId),
  ],
);

/** Do-not-contact suppression. */
export const suppressions = pgTable(
  "suppressions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    email: text("email"),
    domain: text("domain"),
    entityId: uuid("entity_id").references(() => entities.id, {
      onDelete: "set null",
    }),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("suppressions_tenant_idx").on(t.tenantId),
    index("suppressions_email_idx").on(t.email),
    index("suppressions_domain_idx").on(t.domain),
  ],
);

/** Append-only credit ledger. */
export const creditsLedger = pgTable(
  "credits_ledger",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    delta: integer("delta").notNull(),
    reason: text("reason").notNull(),
    referenceId: uuid("reference_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("credits_ledger_tenant_idx").on(t.tenantId)],
);

/** API keys for the public API. */
export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    keyHash: text("key_hash").notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("api_keys_tenant_idx").on(t.tenantId)],
);

/** Webhook endpoints. */
export const webhooks = pgTable(
  "webhooks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    events: jsonb("events").$type<string[]>().default([]).notNull(),
    secretEncrypted: text("secret_encrypted"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("webhooks_tenant_idx").on(t.tenantId)],
);

/** Tenant integrations with encrypted secrets. */
export const integrations = pgTable(
  "integrations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    configEncrypted: text("config_encrypted"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("integrations_tenant_idx").on(t.tenantId),
    uniqueIndex("integrations_tenant_provider_uidx").on(
      t.tenantId,
      t.provider,
    ),
  ],
);

/** Audit log for sensitive actions. */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    actorUserId: uuid("actor_user_id"),
    action: text("action").notNull(),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("audit_log_tenant_idx").on(t.tenantId)],
);

/** Subscription record. */
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    plan: text("plan").notNull(),
    status: text("status").notNull(),
    externalId: text("external_id"),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("subscriptions_tenant_idx").on(t.tenantId),
    uniqueIndex("subscriptions_tenant_uidx").on(t.tenantId),
  ],
);

/** Idempotent billing webhook events. */
export const billingEvents = pgTable(
  "billing_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").references(() => tenants.id, {
      onDelete: "set null",
    }),
    externalEventId: text("external_event_id").notNull().unique(),
    eventType: text("event_type").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [index("billing_events_tenant_idx").on(t.tenantId)],
);
