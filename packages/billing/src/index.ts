export const PACKAGE_NAME = "@scoutline/billing" as const;

export {
  PLANS,
  getPlan,
  isValidPlanKey,
  type PlanKey,
  type PlanDefinition,
} from "./plans.js";

export {
  balanceFromLedger,
  hasEvent,
  trySpendCredits,
  grantCredits,
  type CreditEntryKind,
  type CreditLedgerEntry,
  type SpendResult,
} from "./credits.js";

export {
  verifyPaddleSignature,
  parsePaddleEvent,
  PADDLE_SUBSCRIPTION_EVENTS,
  type PaddleWebhookEvent,
} from "./paddle.js";
