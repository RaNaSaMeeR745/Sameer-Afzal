export const PACKAGE_NAME = "@scoutline/core" as const;

export {
  LeadTypeSchema,
  ModeKeySchema,
  MODES,
  getMode,
  modesForType,
  isValidModeKey,
  type LeadType,
  type ModeKey,
  type ModeDefinition,
} from "./modes.js";

export {
  ServiceKeySchema,
  SERVICES,
  getService,
  servicesForMode,
  isValidServiceKey,
  type ServiceKey,
  type ServiceDefinition,
} from "./services.js";

export {
  FreshnessClassSchema,
  ContactVerificationStatusSchema,
  LeadStatusSchema,
  MembershipRoleSchema,
  EntitySchema,
  EntitySignalSchema,
  EntityContactSchema,
  AuditFindingSchema,
  ScoreBreakdownSchema,
  totalScore,
  TenantLeadSchema,
  SearchConfigSchema,
  AgencyCreditSchema,
  OutcomeSchema,
  type FreshnessClass,
  type ContactVerificationStatus,
  type LeadStatus,
  type MembershipRole,
  type Entity,
  type EntitySignal,
  type EntityContact,
  type AuditFinding,
  type ScoreBreakdown,
  type TenantLead,
  type SearchConfig,
  type AgencyCredit,
  type Outcome,
} from "./types.js";
