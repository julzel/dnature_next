export const engineVersion="internal-package-builder-v1.26.0";
// This manifest describes executed policies; documentary registry statuses never enable code.
export const implementedRules={
  "INT-002":4,"INT-003":2,"INT-005":2,"CAT-003":1,"CAT-004":3,"CAT-005":2,"CAT-006":1,"CAT-007":1,"CAT-008":3,
  "RAT-001":2,"RAT-002":1,"RAT-003":1,"RAT-004":1,"RAT-005":1,"FOR-001":1,"FOR-002":1,"FOR-003":2,"FOR-004":3,"FOR-005":1,"FOR-006":4,"FOR-008":1,"FOR-009":2,"FOR-010":1,"PRD-WEIGHT-001":2,
  "SUP-001":3,"SUP-002":5,"DOS-001":5,"SNK-001":4,"SNK-002":4,"SNK-003":3,"SNK-004":2,"SNK-005":3,"SNK-006":1,"PRD-EGG-001":2,"PRD-EGG-002":9,"PKG-001":1,"PKG-002":2,"PKG-003":4,"PKG-004":4,"PKG-006":5,"PKG-007":4,"PKG-008":1,"ALG-005":4,
  "PRD-YEAST-001":2,"PRD-POLLEN-002":2,"PRD-MUSSEL-003":2,
  "PRD-MUSSEL-001":2,"PRD-MUSSEL-002":3,"PRD-KEFIR-001":5,"PRD-BROTH-001":3,"PRD-SENIOR-001":2,
  "BUY-001":1,"BUY-002":2,"BUY-003":1,"BUY-004":5,"BUY-005":3,"BUY-008":2,"BUY-009":2,"BUY-010":3,
  "EXT-001":2,"EXT-002":2,"OUT-001":2,"OUT-002":2,"SYS-001":3,"VEN-001":7,"VEN-002":2,"VEN-003":3,"VEN-009":2,
} as const;
export type RuleId=keyof typeof implementedRules;
export type RuleReference={id:RuleId;revision:number};
export type IssueCode="MIX_STORAGE_REQUIRED"|"MIX_REMAINDER"|"PROFILE_REQUIRED"|"PACKAGE_REQUIRED"|"CATALOG_NOT_READY"|"CR_REFERRAL"|"ALLERGY_UNKNOWN"|"MISSING_COMPONENT"|"UNCERTAIN_MASS"|"ESTIMATED_MASS"|"INVALID_SELECTION"|"INVALID_EXTRA"|"INSUFFICIENT_STOCK"|"UNKNOWN_AVAILABILITY"|"MISSING_PRICE"|"INACTIVE_OFFER"|"PILOT_DOSING"|"DOSE_REVIEW"|"VARIETY_REDUCED"|"SNACK_BEHAVIOR_FALLBACK"|"COMPLEMENT_VARIETY_REDUCED"|"MANUAL_PORTIONING"|"EGG_DOSING_REQUIRED"|"SNACK_KIT_REQUIRED"|"SNACK_BUDGET_EXCEEDED"|"SUPERVISED_SNACK"|"SNACK_PURCHASE_ESTIMATE";
export type QuoteIssue={code:IssueCode;rule:RuleReference;severity:"blocking"|"warning";message:string;petId?:string;packageId?:string;catalogId?:string;sku?:string};
export function ruleReference(id:RuleId):RuleReference {return {id,revision:implementedRules[id]};}
export function issue(code:IssueCode,id:RuleId,message:string,context:Omit<Partial<QuoteIssue>,"code"|"rule"|"message">={}):QuoteIssue {
  return {code,rule:ruleReference(id),severity:"blocking",message,...context};
}
