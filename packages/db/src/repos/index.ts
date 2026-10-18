export {
  upsertTenantLead,
  listTenantLeads,
  type UpsertLeadInput,
  type ListLeadsOptions,
} from "./leads.js";

export {
  insertClaim,
  listActiveClaimsForEntity,
  type InsertClaimInput,
} from "./claims.js";

export {
  insertOutcome,
  listOutcomeSamplesForTenant,
  type InsertOutcomeInput,
} from "./outcomes.js";

export {
  listCreditEntries,
  getCreditBalance,
  persistGrant,
  persistSpend,
} from "./credits.js";

export {
  ensureEntity,
  type EnsureEntityInput,
} from "./entities.js";

export {
  insertProofAsset,
  getProofByShareToken,
  incrementProofViewCount,
  type InsertProofAssetInput,
} from "./proof.js";
