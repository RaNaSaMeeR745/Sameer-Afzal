import { z } from "zod";
import { LeadTypeSchema, ModeKeySchema } from "./modes.js";
import { ServiceKeySchema } from "./services.js";

/** Freshness classification for a lead. */
export const FreshnessClassSchema = z.enum(["fresh", "contested", "served"]);
export type FreshnessClass = z.infer<typeof FreshnessClassSchema>;

/** Contact verification status. */
export const ContactVerificationStatusSchema = z.enum([
  "unverified",
  "syntax_ok",
  "mx_ok",
  "verified",
  "invalid",
  "disposable",
  "role",
  "suppressed",
]);
export type ContactVerificationStatus = z.infer<
  typeof ContactVerificationStatusSchema
>;

/** Tenant lead pipeline status. */
export const LeadStatusSchema = z.enum([
  "discovered",
  "enriched",
  "scored",
  "ready",
  "contacted",
  "replied",
  "booked",
  "won",
  "lost",
  "suppressed",
]);
export type LeadStatus = z.infer<typeof LeadStatusSchema>;

/** Membership roles. */
export const MembershipRoleSchema = z.enum([
  "owner",
  "admin",
  "member",
  "viewer",
]);
export type MembershipRole = z.infer<typeof MembershipRoleSchema>;

/** Canonical business, company, or agency. */
export const EntitySchema = z.object({
  id: z.string().uuid(),
  canonicalName: z.string().min(1),
  domain: z.string().min(1).nullable(),
  country: z.string().min(2).max(2).nullable(),
  city: z.string().nullable(),
  category: z.string().nullable(),
  registryIds: z.record(z.string()).default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Entity = z.infer<typeof EntitySchema>;

/** Observed signal attached to an entity. */
export const EntitySignalSchema = z.object({
  id: z.string().uuid(),
  entityId: z.string().uuid(),
  signalType: z.string().min(1),
  source: z.string().min(1),
  evidenceUrl: z.string().url().nullable(),
  observedAt: z.string().datetime(),
  expiresAt: z.string().datetime().nullable(),
  rawPayloadRef: z.string().nullable(),
});
export type EntitySignal = z.infer<typeof EntitySignalSchema>;

/** Public business contact only. */
export const EntityContactSchema = z.object({
  id: z.string().uuid(),
  entityId: z.string().uuid(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  role: z.string().nullable(),
  socials: z.record(z.string()).default({}),
  verificationStatus: ContactVerificationStatusSchema,
  source: z.string().min(1),
});
export type EntityContact = z.infer<typeof EntityContactSchema>;

/** Single audit finding with evidence. */
export const AuditFindingSchema = z.object({
  code: z.string().min(1),
  severity: z.enum(["info", "low", "medium", "high", "critical"]),
  title: z.string().min(1),
  detail: z.string(),
  evidenceUrl: z.string().url().nullable(),
  serviceKeys: z.array(ServiceKeySchema).default([]),
});
export type AuditFinding = z.infer<typeof AuditFindingSchema>;

/** Explainable score breakdown (sums toward 0-100). */
export const ScoreBreakdownSchema = z.object({
  need: z.number().min(0).max(40),
  timing: z.number().min(0).max(25),
  budget: z.number().min(0).max(15),
  reach: z.number().min(0).max(10),
  fit: z.number().min(0).max(10),
  evidenceLinks: z.array(z.string().url()).default([]),
  notes: z.array(z.string()).default([]),
});
export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;

export function totalScore(breakdown: ScoreBreakdown): number {
  return (
    breakdown.need +
    breakdown.timing +
    breakdown.budget +
    breakdown.reach +
    breakdown.fit
  );
}

/** Tenant-scoped lead linked to a global entity. */
export const TenantLeadSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  entityId: z.string().uuid(),
  score: z.number().min(0).max(100),
  scoreBreakdown: ScoreBreakdownSchema,
  freshnessClass: FreshnessClassSchema,
  status: LeadStatusSchema,
  ownerUserId: z.string().uuid().nullable(),
  notes: z.string().nullable(),
  serviceKey: ServiceKeySchema.nullable(),
  modeKeys: z.array(ModeKeySchema).min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type TenantLead = z.infer<typeof TenantLeadSchema>;

/** Saved discovery search configuration. */
export const SearchConfigSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(1),
  leadType: LeadTypeSchema,
  modes: z.array(ModeKeySchema).min(1),
  geography: z.string().min(1),
  niche: z.string().nullable(),
  serviceKey: ServiceKeySchema,
  createdAt: z.string().datetime(),
});
export type SearchConfig = z.infer<typeof SearchConfigSchema>;

/** Agency or vendor credit detected on an entity. */
export const AgencyCreditSchema = z.object({
  id: z.string().uuid(),
  entityId: z.string().uuid(),
  agencyName: z.string().min(1),
  agencyDomain: z.string().nullable(),
  serviceHint: z.string().nullable(),
  evidenceUrl: z.string().url().nullable(),
  observedAt: z.string().datetime(),
});
export type AgencyCredit = z.infer<typeof AgencyCreditSchema>;

/** Outcome used for per-tenant signal re-weighting. */
export const OutcomeSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  leadId: z.string().uuid(),
  result: z.enum(["replied", "call_booked", "won", "lost"]),
  reason: z.string().nullable(),
  recordedAt: z.string().datetime(),
});
export type Outcome = z.infer<typeof OutcomeSchema>;
