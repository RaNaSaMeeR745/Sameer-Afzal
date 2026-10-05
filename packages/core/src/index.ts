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

export {
  SCORE_CAPS,
  DEFAULT_WEIGHTS,
  scoreLead,
  deriveWeightsFromOutcomes,
  type ScoringWeights,
  type IcpProfile,
  type ScoreInput,
  type ScoreResult,
} from "./scoring.js";

export {
  buildProofReport,
  type ProofReportInput,
  type ProofReport,
} from "./proof.js";

export {
  DEFAULT_CLAIM_TTL_MS,
  isClaimActive,
  claimsOverlap,
  tryCreateClaim,
  applyClaimsToFreshness,
  activeClaimsForEntity,
  type ExclusivityClaim,
  type ClaimRequest,
  type ClaimDecision,
} from "./claims.js";
