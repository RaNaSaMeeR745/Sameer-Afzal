import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";

/** Canonical business, company, or agency (shared across tenants). */
export const entities = pgTable(
  "entities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    canonicalName: text("canonical_name").notNull(),
    domain: text("domain"),
    country: text("country"),
    city: text("city"),
    category: text("category"),
    registryIds: jsonb("registry_ids").$type<Record<string, string>>().default({}).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [{
    domainIdx: index("entities_domain_idx").on(t.domain),
    countryIdx: index("entities_country_idx").on(t.country),
  }],
);

/** Observed signal on an entity. */
export const entitySignals = pgTable(
  "entity_signals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityId: uuid("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    signalType: text("signal_type").notNull(),
    source: text("source").notNull(),
    evidenceUrl: text("evidence_url"),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    rawPayloadRef: text("raw_payload_ref"),
  },
  (t) => [{
    entityIdx: index("entity_signals_entity_idx").on(t.entityId),
    typeIdx: index("entity_signals_type_idx").on(t.signalType),
  }],
);

/** Public business contact only. */
export const entityContacts = pgTable(
  "entity_contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityId: uuid("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    email: text("email"),
    phone: text("phone"),
    role: text("role"),
    socials: jsonb("socials").$type<Record<string, string>>().default({}).notNull(),
    verificationStatus: text("verification_status").notNull().default("unverified"),
    source: text("source").notNull(),
  },
  (t) => [{
    entityIdx: index("entity_contacts_entity_idx").on(t.entityId),
    emailIdx: index("entity_contacts_email_idx").on(t.email),
  }],
);

/** Audit findings batch for an entity crawl. */
export const entityAudits = pgTable(
  "entity_audits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityId: uuid("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    findings: jsonb("findings").$type<unknown[]>().default([]).notNull(),
    crawledAt: timestamp("crawled_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [{
    entityIdx: index("entity_audits_entity_idx").on(t.entityId),
  }],
);

/** Detected agency or vendor credit on an entity. */
export const agencyCredits = pgTable(
  "agency_credits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityId: uuid("entity_id")
      .notNull()
      .references(() => entities.id, { onDelete: "cascade" }),
    agencyName: text("agency_name").notNull(),
    agencyDomain: text("agency_domain"),
    serviceHint: text("service_hint"),
    evidenceUrl: text("evidence_url"),
    observedAt: timestamp("observed_at", { withTimezone: true }).notNull(),
  },
  (t) => [{
    entityIdx: index("agency_credits_entity_idx").on(t.entityId),
  }],
);
