import { dailyPortionOverrideSchema } from "./daily-portion";
import { naturalCoveragePercentSchema } from "./natural-coverage";
import { underweightComplement } from "../complement-portions";
import { feedingModeSchema } from "./feeding-mode";
import { buildManualPackage } from "./manual-package";
import { healthFactors, needsManualPackage } from "./health-factors";
import { z } from "zod";
import {
  builderProfileSchema,
  referralFor,
  allergyWarning,
  dosingWarning,
} from "./intake";
import { additionalOffers, buildExtras } from "./extras";
import { buildPetPackages } from "./packages";
import { aggregateQuote } from "./aggregation";
import { stockIssuesFor } from "./stock";
import { issue, ruleReference, engineVersion, type RuleId } from "./issues";
import type { QuoteBuildInput, QuoteBuildResult, PetResult } from "./model";
import { offerProblems } from "./purchasing";
import { varietyLevels } from "./variety";
import { roles, roleLabels } from "./profile";
import { allocateFamilyEggs } from "./family-eggs";
import { allocateFamilyMixes } from "./family-mixes";
import { allocateFamilyProducts } from "./family-products";
import { assessProducts } from "./eligibility";
import { snackKitRoleLabel, snackKitRoles, snackRows } from "./snack-policy";
import { quotePeriodSchema } from "../period";
export type { ProductAssessment } from "./eligibility";
export type {
  QuoteBuildInput,
  QuoteBuildResult,
  QuoteSummary,
  PetResult,
  PackageResult,
} from "./model";
export type { BuilderProfile } from "./intake";
export type { ExtraSelection, ExtraResult, AdditionalOffer } from "./extras";

export function buildQuote(input: QuoteBuildInput): QuoteBuildResult {
  z.object({
    days: quotePeriodSchema,
    complementPercent: z.number().finite().min(0).max(20),
    firstPurchase: z.boolean(),
    referred: z.boolean().optional(),
    supplementMode: z.enum(["starter","period"]).optional(),
  }).parse(input.options);
  const applied = new Set<RuleId>(["SYS-001", "OUT-001", "OUT-002", "INT-003"]);
  const apply = (...ids: RuleId[]) => ids.forEach((id) => applied.add(id));
  if(input.options.days !== 30)apply("VEN-009");
  const items = input.catalog?.items ?? [];
  const catalogState = input.catalog
    ? input.catalogState
    : input.catalogState === "error"
      ? "error"
      : "loading";
  const individualPets: PetResult[] = input.pets.map((entry) => {
    const empty: PetResult = {
      id: entry.id,
      name: entry.name,
      choice: entry.choice,
      profile: null,
      result: null,
      extraResult: { lines: [], issues: [], pending: [], subtotal: 0 },
      offers: [],
      productAssessments: [],
      requiredConfirmations: [],
      issues: [],
      warnings: [],
      status: "draft",
    };
    apply("INT-005");
    const parsed = builderProfileSchema.safeParse(entry.profile);
    if (!parsed.success) {
      empty.issues.push(
        issue(
          "PROFILE_REQUIRED",
          "INT-005",
          "Completar y calcular el perfil, incluyendo la pregunta de alergias.",
          { petId: entry.id },
        ),
      );
      return empty;
    }
    const profile = parsed.data;
    empty.profile = profile;
    empty.name = profile.name;
    if(profile.species === "dog" && input.options.days !== 30)apply("VEN-001");
    if(profile.species === "dog" && input.options.days === 14)apply("VEN-003");
    apply("INT-002", "INT-005");
    const advisory = input.options.healthPolicy === "advisory";
    if (advisory) {
      for (const factor of healthFactors({...profile,allergyNotes:""})) empty.issues.push(issue("CR_REFERRAL", "INT-002", factor, {petId:entry.id,severity:"warning"}));
      if (profile.age === undefined || profile.weight === undefined || !profile.lifeStage) {
        empty.issues.push(issue("PROFILE_REQUIRED","INT-005","Completa la etapa de vida, la edad y el peso para calcular las cantidades.",{petId:entry.id}));
        return empty;
      }
    }
    const referral = advisory ? null : referralFor(profile);
    if (referral) {
      empty.status = "review";
      empty.issues.push(
        issue(
          "CR_REFERRAL",
          profile.allergyStatus === "yes" || profile.allergies.length
            ? "INT-005"
            : "INT-002",
          referral,
          { petId: entry.id },
        ),
      );
      empty.result = {
        referral,
        packages: [],
        dailyGrams: null,
        rawDailyGrams: null,
        naturalCoverage: null,
        split: null,
        candidates: {
          mix: [],
          complement: [],
          egg: [],
          supplement: [],
          probiotic: [],
          snack: [],
        },
        notes: [],
        warnings: [],
      };
      return empty;
    }
    const dailyPortionOverride=dailyPortionOverrideSchema.optional().parse(entry.dailyPortionOverride);
    if(dailyPortionOverride && (profile.species !== "dog" || needsManualPackage(profile)))throw new Error("La porción personalizada aplica a perros adultos con cotización automática.");
    if(dailyPortionOverride)apply("RAT-005");
    const requestedNaturalCoverage=naturalCoveragePercentSchema.parse(entry.naturalCoveragePercent ?? 100);
    const naturalCoveragePercent=needsManualPackage(profile) ? 100:requestedNaturalCoverage;
    if(naturalCoveragePercent !== 100)apply("RAT-004");
    const requestedFeedingMode=feedingModeSchema.parse(entry.feedingMode ?? "standard");
    const feedingMode=needsManualPackage(profile) ? "standard":requestedFeedingMode;
    if(feedingMode === "cooked_monoprotein" && profile.species !== "dog")throw new Error("La alimentación cocinada solo aplica a perros.");
    if(feedingMode === "cooked_monoprotein")apply("FOR-008");
    if(underweightComplement(profile))apply("FOR-009");
    const assessments=assessProducts(items,profile,feedingMode);
    empty.productAssessments=assessments;
    if(advisory && needsManualPackage(profile)) {
      apply("EXT-001","BUY-001","BUY-002","PKG-008");
      return buildManualPackage(empty,items,entry.manualPackage,assessments);
    }
    const confirmationIds=assessments.filter(a=>a.needsBrachycephaly).map(a=>a.item.catalog.id);
    if(confirmationIds.length)empty.requiredConfirmations=[{field:"brachycephaly",catalogIds:confirmationIds}];
    apply("CAT-007","CAT-008");
    for(const assessment of assessments)for(const reason of assessment.reasons)apply(reason.rule.id);
    if(assessments.some(a=>a.advisories.length))apply("SNK-006");
    apply(
      "CAT-003",
      "CAT-004",
      "CAT-005",
      "CAT-006",
      "RAT-001",
      "RAT-002",
      "RAT-003",
      "FOR-001",
      "FOR-002",
      "FOR-003",
      "FOR-004",
      "FOR-005",
      "FOR-006",
      "SUP-001",
      "DOS-001",
      "SNK-001",
      "PRD-EGG-001",
      "PKG-001",
      "PKG-002",
      "PKG-003",
      "PKG-004",
      "ALG-005",
      "BUY-001",
      "BUY-002",
      "BUY-003",
      "BUY-004",
      "BUY-008",
      "BUY-009",
      "EXT-001",
      "EXT-002",
    );
    if (profile.allergyStatus === "unknown")
      empty.issues.push(
        issue("ALLERGY_UNKNOWN", "INT-005", allergyWarning, {
          petId: entry.id,
          severity: "warning",
        }),
      );
    const calculated = buildPetPackages(items, profile, {
      ...input.options,
      selected: entry.selected,
      feedingMode,
      naturalCoveragePercent,
      dailyPortionOverride,
      varietyLevel: z.enum(varietyLevels).parse(entry.varietyLevel ?? "none"),
      complementVarietyLevel: z
        .enum(varietyLevels)
        .parse(entry.complementVarietyLevel ?? "none"),
    },assessments);
    if(calculated.split && calculated.split.complement > 200)apply("FOR-010");
    apply("PKG-006", "PKG-007");
    if(profile.species === "dog")apply("SUP-002","PRD-MUSSEL-001","PRD-MUSSEL-002");
    apply("SNK-004");
    if(profile.species === "dog")apply("SNK-002","SNK-003","SNK-005");
    if (calculated.referral)
      empty.issues.push(
        issue("CR_REFERRAL", "INT-002", calculated.referral, {
          petId: entry.id,
        }),
      );
    const packages = calculated.packages.map((pack) => {
      for (const line of pack.lines) if (line.dose?.rule) apply(line.dose.rule.id);
      const context = { petId: entry.id, packageId: pack.id };
      const issues = pack.missing.map((message) =>
        issue(message.startsWith("Huevo obligatorio:") ? "EGG_DOSING_REQUIRED":message.startsWith("Kit de snacks:") ? message.includes("superan el presupuesto") ? "SNACK_BUDGET_EXCEEDED":"SNACK_KIT_REQUIRED":"MISSING_COMPONENT", message.startsWith("Huevo obligatorio:") ? "PRD-EGG-002":message.startsWith("Kit de snacks:") ? "SNK-005":message.startsWith("Kit") ? "SUP-002":"PKG-001", message, context),
      );
      if(pack.snackKit && !pack.snackKit.complete) {
        for(const role of snackKitRoles(input.options.days).filter(role=>!pack.snackKit!.items.some(item=>item.role === role)))for(const assessment of assessments.filter(a=>snackRows(profile.weight!,input.options.days)[role].includes(a.item.catalog.row))) {
          for(const reason of assessment.reasons)issues.push(issue("SNACK_KIT_REQUIRED",reason.rule.id,`${snackKitRoleLabel(role,profile.weight!,input.options.days)} · ${assessment.item.catalog.name}: ${reason.message}`,{...context,catalogId:assessment.item.catalog.id}));
          if(assessment.status === "allowed")for(const problem of assessment.commercial.problems)issues.push(issue(problem.code,problem.code === "MISSING_PRICE" ? "BUY-001":"BUY-002",`${snackKitRoleLabel(role,profile.weight!,input.options.days)} · ${problem.message}`,{...context,catalogId:problem.catalogId,sku:problem.sku}));
        }
      }
      if(profile.species === "dog" && pack.roles.includes("supplement")) {
        for(const candidate of [...calculated.candidates.supplement,...calculated.candidates.probiotic]) {
          if(pack.lines.some(line=>line.item.catalog.id === candidate.item.catalog.id))continue;
          issues.push(...offerProblems(candidate.item).map(problem=>issue(problem.code,"SUP-002",problem.message,{...context,catalogId:problem.catalogId,sku:problem.sku})));
        }
      }
      for (const role of pack.roles) {
        if (
          pack.lines.some((l) => l.component === role) ||
          (role === "complement" && !pack.complementDailyGrams)
        )
          continue;
        const candidates = calculated.candidates[role].filter(
          (c) =>
            !entry.selected[role] || c.item.catalog.id === entry.selected[role],
        );
        for (const candidate of candidates) {
          issues.push(
            ...candidate.pending.map((message) =>
              issue("UNCERTAIN_MASS", "BUY-003", message, {
                ...context,
                catalogId: candidate.item.catalog.id,
              }),
            ),
          );
          issues.push(
            ...offerProblems(candidate.item).map((problem) =>
              issue(
                problem.code,
                problem.code === "MISSING_PRICE" ? "BUY-001" : "BUY-002",
                problem.message,
                { ...context, catalogId: problem.catalogId, sku: problem.sku },
              ),
            ),
          );
        }
      }
      issues.push(
        ...pack.pending.map((message) =>
          issue("UNCERTAIN_MASS", "BUY-003", message, context),
        ),
      );
      for (const role of roles) {
        if (
          !pack.roles.includes(role) ||
          !entry.selected[role] ||
          (role === "complement" && !pack.complementDailyGrams)
        )
          continue;
        const id = entry.selected[role]!;
        const candidate = calculated.candidates[role].find(
          (c) => c.item.catalog.id === id,
        );
        if (
          !candidate ||
          !pack.lines.some(
            (l) => l.component === role && l.item.catalog.id === id,
          )
        ) {
          const assessment=assessments.find(a=>a.item.catalog.id === id);
          const detail=[...(assessment?.reasons.map(r=>r.message) ?? []),...(assessment?.commercial.problems.map(p=>p.message) ?? [])].join(" ");
          issues.push(
            issue(
              "INVALID_SELECTION",
              "PKG-003",
              `${role === "mix" && feedingMode === "cooked_monoprotein" ? "Base cocinada":roleLabels[role]} seleccionado: ${detail || "ya no cumple las reglas o no tiene precio, stock o presentación suficientes."} Vuelve a seleccionarlo.`,
              { ...context, catalogId: id },
            ),
          );
        }
      }
      issues.push(...stockIssuesFor(pack.lines, entry.id, pack.id));
      if (pack.varietyWarning)
        issues.push(
          issue("VARIETY_REDUCED", "PKG-006", pack.varietyWarning, {
            ...context,
            severity: "warning",
          }),
        );
      if (pack.complementVarietyWarning)
        issues.push(
          issue(
            "COMPLEMENT_VARIETY_REDUCED",
            "PKG-007",
            pack.complementVarietyWarning,
            { ...context, severity: "warning" },
          ),
        );
      if(pack.portionPlan?.adjustment === "manual")
        issues.push(issue("MANUAL_PORTIONING","FOR-006",pack.portionPlan.note,{...context,severity:"warning"}));
      if(pack.snackKit)issues.push(issue("SNACK_PURCHASE_ESTIMATE","SNK-003",pack.snackKit.note,{...context,severity:"warning"}));
      for(const line of pack.lines)for(const warning of assessments.find(a=>a.item.catalog.id === line.item.catalog.id)?.advisories ?? [])issues.push(issue("SUPERVISED_SNACK","SNK-006",`${line.item.catalog.name}: ${warning}`,{...context,catalogId:line.item.catalog.id,sku:line.variant.sku ?? undefined,severity:"warning"}));
      const snack = pack.lines.find((line) => line.component === "snack");
      if (snack?.snackDecision?.fallback)
        issues.push(
          issue("SNACK_BEHAVIOR_FALLBACK", "SNK-004", snack.reason, {
            ...context,
            catalogId: snack.item.catalog.id,
            sku: snack.variant.sku ?? undefined,
            severity: "warning",
          }),
        );
      for (const line of pack.lines.filter(line => line.dose?.status === "review")) {
        issues.push(issue("DOSE_REVIEW", "DOS-001", `${line.item.catalog.name}: ${line.dose!.message}`, {
          ...context, catalogId: line.item.catalog.id, sku: line.variant.sku ?? undefined, severity: "warning",
        }));
      }
      for(const line of pack.lines)if(line.massEstimate)issues.push(issue("ESTIMATED_MASS","PRD-WEIGHT-001",`${line.item.catalog.name}: ${line.massEstimate.note}`,{...context,catalogId:line.item.catalog.id,sku:line.variant.sku ?? undefined,severity:"warning"}));
      issues.push(
        issue("PILOT_DOSING", "PKG-004", dosingWarning, {
          ...context,
          severity: "warning",
        }),
      );
      for(const entry of issues)apply(entry.rule.id);
      const warnings = issues
        .filter((i) => i.severity === "warning")
        .map((i) => i.message);
      const pending = issues
        .filter(
          (i) =>
            i.severity === "blocking" &&
            i.code !== "INSUFFICIENT_STOCK" &&
            i.code !== "MISSING_COMPONENT",
        )
        .map((i) => i.message);
      return {
        ...pack,
        issues,
        warnings,
        pending,
        stockIssues: issues
          .filter((i) => i.code === "INSUFFICIENT_STOCK")
          .map((i) => i.message),
        ready: !issues.some((i) => i.severity === "blocking"),
      };
    });
    empty.result = {
      ...calculated,
      packages,
      warnings: empty.issues
        .filter((i) => i.severity === "warning")
        .map((i) => i.message),
    };
    if (!calculated.referral) {
      empty.offers = additionalOffers(items, profile,assessments);
      empty.extraResult = buildExtras(entry.extras, empty.offers, entry.id,assessments);
      for(const entry of empty.extraResult.issues)apply(entry.rule.id);
    }
    empty.warnings = empty.issues
      .filter((i) => i.severity === "warning")
      .map((i) => i.message);
    empty.status = calculated.referral ? "review" : "ready";
    return empty;
  });
  apply("BUY-005","BUY-008","BUY-009");
  const eggResult=allocateFamilyEggs(individualPets);
  const mixResult=allocateFamilyMixes(eggResult.pets,input.options.days);
  const {familyMixes}=mixResult;
  const {pets,familyProducts}=allocateFamilyProducts(mixResult.pets,[...eggResult.familyEggs.map(group=>group.line),...familyMixes.flatMap(group=>group.lines)]);
  apply("BUY-010");
  const summary = aggregateQuote(pets, catalogState,eggResult.familyEggs,input.options,familyMixes,familyProducts);
  for (const pet of pets)
    if (pet.status !== "draft")
      pet.status = summary.issues.some(
        (i) => i.petId === pet.id && i.severity === "blocking",
      )
        ? "review"
        : !pet.choice
          ? "draft"
          : "ready";
  const source = input.catalog
    ? {
        sourceHash: input.catalog.sourceHash,
        loadedAt: input.catalog.loadedAt,
        stockScope: input.catalog.stockScope,
        catalogCorrections:items.flatMap(item=>item.catalog.descriptionCorrection ? [{id:item.catalog.descriptionCorrection.id,revision:item.catalog.descriptionCorrection.revision,cell:item.catalog.descriptionCorrection.cell,source:item.catalog.descriptionCorrection.source}]:[]),
      }
    : {};
  return {
    pets,
    summary,
    engineVersion,
    appliedRules: [...applied].map(ruleReference),
    source,
  };
}
