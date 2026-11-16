import { dailyPortionOverrideSchema } from "./daily-portion";
import { naturalCoverage as calculateNaturalCoverage, type NaturalCoverage } from "./natural-coverage";
import { isUnderweightComplement, underweightComplement } from "../complement-portions";
import { complementPriority } from "./complement-priority";
import { prefersSmallMix } from "./mix-presentation";
import { cookedFormulaNote, isCookedBase, isCookedRecipe, usesCookedBase } from "./feeding-mode";
import { avoidsRecordedAllergens } from "./allergens";
import { normalize } from "@/features/feeding/engine/sandbox/catalog";
import { effectivePrice, inventory } from "@/features/feeding/engine/catalog/avify/model";
import { calculatePortion } from "../portion";
import { isCompleteRecipe, type CuratedItem, type PetProfile } from "../nutrition";
import { packRecipe, saleableOffers, eggBoxOffers, offerGrams as mass, offerMassEstimate, weighedItem as weighed, type QuoteLine } from "./purchasing";
import { breedAffinity } from "../breeds";
import { complementFitsPortion, formulaKind } from "../formula";
import { roles, roleLabels, packageDefinitions, type FlowProfile, type FlowOptions, type Candidate, type Role, type FlowLine, type FlowPackage } from "./profile";
import { completePresentationGrams, roundDailyRation, splitRation } from "./ration";
import type { QuotePeriod } from "../period";
import { stockIssuesFor } from "./stock";
import { planVariety, optimizeFlavorDays, rotationDetails, complementRotationDetails, type FlavorAllocation } from "./variety";
import { assessProducts, type ProductAssessment } from "./eligibility";
import { assessSnack, snackDecision } from "./snacks";
import { assessProductDose, withDoseCoverage } from "./dosing";
import { packagePrice } from "./pricing";
import { purchaseSupplement, type SupplementMode } from "./supplement-purchasing";
import { isKitProduct, kitCandidates, kitRequirements } from "./supplement-kit";
import { supplementKitDecision } from "./supplement-context";
import { buildSnackKit } from "./snack-kit";
import { snackProductPolicy, snackRows } from "./snack-policy";

function toPet(profile:FlowProfile):Omit<PetProfile,"sex"|"behavior"> {
  return {...profile,age:profile.age!,weight:profile.weight!,lifeStage:profile.lifeStage!,size:profile.weight! <= 4 ? "small" : profile.weight! <= 25 ? "medium" : "large"};
}
export function gateProfile(profile:FlowProfile) {
  if (profile.health === "condition") return "Tiene una enfermedad. Un asesor debe revisar su alimentación antes de cotizar.";
  if (profile.lifeStage === "growing" || (profile.age !== undefined && profile.age < 1)) return "Es cachorro o gatito. Un asesor debe revisar su alimentación antes de cotizar.";
  return null;
}
function weightedLines(candidate:Candidate,target:number,component:Role,dailyMixGrams?:number):FlowLine[] {
  const item=candidate.item;
  return packRecipe(weighed(item),target,component === "mix" && formulaKind(item.catalog) === "complete" ? completePresentationGrams:undefined,component === "mix" ? prefersSmallMix(dailyMixGrams ?? Infinity) ? "small-mix":"containers":"cost").map(l => {
    const variant=[item.avify,...item.avify.children].find(v => v.sku === l.variant.sku) ?? l.variant;
    const massEstimate=offerMassEstimate(item,variant);
    return {...l,item,variant,...(massEstimate ? {massEstimate}:{}),component,role:component === "mix" && isCookedRecipe(item.catalog) ? "Base cocinada":roleLabels[component],pending:candidate.pending,breedAffinity:candidate.breedAffinity,
      reason:component === "mix" ? "Envases para cubrir la base del período." : "Envases para cubrir el complemento de fórmula; su porción diaria respeta el límite del 20%."};
  });
}
function singleLine(candidate:Candidate,component:Role,manual=false,offers=saleableOffers(candidate.item)):FlowLine|null {
  const v=offers.toSorted((a,b) => effectivePrice(a)!-effectivePrice(b)!)[0];
  const decision=component === "snack" && candidate.snackAssessment ? snackDecision(candidate.item.catalog,candidate.snackAssessment,manual):undefined;
  return v ? {item:candidate.item,variant:v,quantity:1,unitPrice:effectivePrice(v)!,grams:mass(candidate.item,v),component,role:roleLabels[component],pending:candidate.pending,breedAffinity:candidate.breedAffinity,...(decision ? {snackDecision:decision}:{}),reason:decision?.reason ?? "Un envase para comparar el paquete. Uso, frecuencia y dosis por confirmar."} : null;
}
function componentLines(candidate:Candidate,component:Role,profile:FlowProfile,days:QuotePeriod,manual=false,mode:SupplementMode="period"):FlowLine[] {
  const dose=assessProductDose(candidate.item.catalog,profile.weight!,days);
  if(dose?.egg) {
    const offers=eggBoxOffers(candidate.item).toSorted((a,b)=>effectivePrice(a)!-effectivePrice(b)!);
    const offer=offers.find(v=>inventory(v).available === null || inventory(v).available! >= dose.egg!.standaloneBoxes) ?? offers[0];
    if(offer) {
      const line=singleLine(candidate,component,manual,[offer])!;
      return [{...line,grams:null,quantity:dose.egg.standaloneBoxes,dose,reason:dose.message}];
    }
    const line=singleLine(candidate,component,manual);
    const review={...dose,status:"review" as const,egg:undefined,message:"Confirmar una presentación de diez huevos antes de calcular cajas y compartirlas entre mascotas."};
    return line ? [{...line,dose:review,reason:review.message}]:[];
  }
  if(dose && (component === "supplement" || component === "probiotic"))return purchaseSupplement(candidate,component,dose,mode);
  if(dose?.status === "calculated") {
    const measurable=saleableOffers(candidate.item).some(v=>mass(candidate.item,v) !== null);
    if(measurable) {
      const lines=weightedLines(candidate,dose.requiredGrams!,component);
      const coverage=withDoseCoverage(dose,lines.reduce((sum,line)=>sum+(line.grams ?? 0)*line.quantity,0));
      return lines.map(line=>({...line,dose:coverage,reason:coverage.message}));
    }
    const estimate=singleLine(candidate,component,manual);
    const review={...dose,status:"review" as const,message:`${dose.message} Falta confirmar los gramos de la presentación vendida; un envase no acredita cobertura.`};
    return estimate ? [{...estimate,dose:review,reason:review.message}]:[];
  }
  const estimate=singleLine(candidate,component,manual);
  return estimate ? [{...estimate,...(dose ? {dose,reason:`Estimación de un envase. ${dose.message}`}:{})}]:[];
}
function total(lines:QuoteLine[]) {return lines.reduce((sum,l) => sum+l.quantity*l.unitPrice,0);}
function stockIssues(lines:QuoteLine[]) {return stockIssuesFor(lines).map(issue=>issue.message);}
function supplementaryGoal(profile:FlowProfile) {
  return profile.goal === "skin" ? /piel|pelaje/ : profile.goal === "joints" ? /articular|movilidad/ : profile.goal === "digestion" ? /digest|fibra/ : /colageno|piel|palatabilidad/;
}
export function buildPetPackages(items:CuratedItem[],profile:FlowProfile,options:FlowOptions,assessments:ProductAssessment[]=assessProducts(items,profile,options.feedingMode)) {
  if (options.days !== 14 && options.days !== 28 && options.days !== 30) throw new Error("Período no válido.");
  const referral=options.healthPolicy === "advisory" ? null:gateProfile(profile);
  const empty={candidates:{mix:[],complement:[],egg:[],supplement:[],probiotic:[],snack:[]} as Record<Role,Candidate[]>,packages:[] as FlowPackage[],naturalCoverage:null as NaturalCoverage|null,rawDailyGrams:null,dailyGrams:null,split:null,notes:[] as string[]};
  if(referral) return {...empty,referral};
  const override=dailyPortionOverrideSchema.optional().parse(options.dailyPortionOverride);
  if(override && (profile.species !== "dog" || profile.lifeStage !== "adult" || profile.age === undefined || profile.age < 1))throw new Error("La porción personalizada aplica a perros adultos con cotización automática.");
  const pet=toPet(profile);const automaticRawDailyGrams=calculatePortion(pet);
  if(automaticRawDailyGrams === null) return {...empty,referral:"Esta combinación de condición corporal y actividad no está contemplada por el calculador. Revisémosla con un asesor."};
  const automaticDailyGrams=options.days === 30 || profile.species !== "dog" ? automaticRawDailyGrams:roundDailyRation(automaticRawDailyGrams);
  // An explicit portion is exact. Coverage scales it once before every downstream calculation.
  const fullRawDailyGrams=override?.grams ?? automaticRawDailyGrams;
  const fullDailyGrams=override?.grams ?? automaticDailyGrams;
  const naturalCoverage=calculateNaturalCoverage(fullRawDailyGrams,fullDailyGrams,options.naturalCoveragePercent ?? 100,
    override ? {...override,automaticRawDailyGrams,automaticDailyGrams}:undefined);
  const dailyGrams=naturalCoverage.quotedDailyGrams;
  const rawDailyGrams=naturalCoverage.percent === 100 ? fullRawDailyGrams:Math.round(fullRawDailyGrams*naturalCoverage.percent/100*1e6)/1e6;
  const cooked=usesCookedBase(options.feedingMode,profile.species);
  const split=splitRation(dailyGrams,options.complementPercent,cooked ? "cooked_monoprotein":"standard");
  const priorityComplement=underweightComplement(profile);
  // Apply catalog compatibility first, then distinguish known avoided ingredients from uncertain metadata.
  const compatible=assessments.filter(a=>a.status === "allowed").map(a=>a.item);
  const candidates=compatible.flatMap(item => {
    if(formulaKind(item.catalog) === "excluded" && !isCookedBase(item,options.feedingMode,profile.species)) return [];
    if(!avoidsRecordedAllergens(item,profile)) return [];
    return [{item,breedAffinity:breedAffinity(item.catalog,profile),pending:profile.allergies.length ? [`Confirmar ingredientes completos y alérgenos para evitar ${profile.allergies.join(", ")}.`] : []}];
  });
  const supply=(candidate:Candidate) => saleableOffers(candidate.item).length > 0;
  const supplements=candidates.filter(c => c.item.catalog.category === "supplement" && !/kefir|chucrut|caldo|topping|relax|canitabs|calcio|potasio|multivitamin|espirulina/.test(normalize(c.item.catalog.name)));
  const matchGoal=(c:Candidate) => supplementaryGoal(profile).test(normalize(`${c.item.catalog.name} ${c.item.catalog.goal}`));
  const byRole:Record<Role,Candidate[]>={
    mix:candidates.filter(c => cooked ? isCookedBase(c.item,options.feedingMode,profile.species):isCompleteRecipe(c.item)),
    complement:candidates.filter(c => complementFitsPortion(c.item.catalog,split.complement,profile)).map(c =>
      (c.item.avify.children.length ? c.item.avify.children:[c.item.avify]).some(v => mass(c.item,v) !== null) ? c :
        {...c,pending:[...c.pending,"Confirmar el peso en gramos por presentación antes de calcular envases para el complemento."]}),
    egg:candidates.filter(c => formulaKind(c.item.catalog) === "egg"),
    supplement:supplements.toSorted((a,b) => Number(matchGoal(b))-Number(matchGoal(a))),
    probiotic:candidates.filter(c => /kefir|chucrut/.test(normalize(c.item.catalog.name))),
    snack:candidates.flatMap(c=>{const snackAssessment=assessSnack(c.item.catalog,profile.behavior);return profile.species === "dog" ? snackProductPolicy(c.item.catalog)?.valid && Object.values(snackRows(profile.weight!,options.days)).some(rows=>rows.includes(c.item.catalog.row)) ? [{...c,...(snackAssessment ? {snackAssessment}:{})}]:[]:snackAssessment ? [{...c,snackAssessment}]:[];}),
  };
  const goalOrder=(a:Candidate,b:Candidate) => Number(matchGoal(b))-Number(matchGoal(a));
  for(const role of roles) byRole[role]=byRole[role].toSorted((a,b) =>
    (role === "complement" ? Number(isUnderweightComplement(b.item.catalog,profile))-Number(isUnderweightComplement(a.item.catalog,profile)):0) ||
    Number(b.pending.length === 0)-Number(a.pending.length === 0) || Number(supply(b))-Number(supply(a)) ||
    (role === "complement" ? complementPriority(a.item.catalog,split.complement)-complementPriority(b.item.catalog,split.complement):0) ||
    (role === "supplement" && profile.goal !== "wellness" ? goalOrder(a,b) : 0) ||
    (role === "snack" ? (b.snackAssessment?.priority ?? 0)-(a.snackAssessment?.priority ?? 0):0) ||
    (role === "probiotic" && profile.species === "dog" ? Number(/^kefir\b/.test(normalize(b.item.catalog.name)))-Number(/^kefir\b/.test(normalize(a.item.catalog.name))):0) ||
    Number(b.breedAffinity)-Number(a.breedAffinity) || (role === "supplement" ? goalOrder(a,b) : 0));
  const canineKit=profile.species === "dog" ? kitRequirements(profile):null;
  if(canineKit) {
    const members=kitCandidates(candidates,profile);
    byRole.supplement=members.filter(c=>!isKitProduct(c.item.catalog,67));
    byRole.probiotic=members.filter(c=>isKitProduct(c.item.catalog,67));
  }
  const selectedComponent=(role:Role) => {
    const explicit=byRole[role].find(c => c.item.catalog.id === options.selected[role]);
    if(options.selected[role] && !explicit) return [];
    return explicit ? componentLines(explicit,role,profile,options.days,true,options.supplementMode) : byRole[role].map(c => componentLines(c,role,profile,options.days,false,options.supplementMode)).find(lines=>lines.length > 0) ?? [];
  };
  const plansFor=(role:"mix"|"complement",target:number) => {
    const plans=byRole[role].map(c => ({candidate:c,lines:weightedLines(c,target,role,role === "mix" ? target/options.days:undefined)})).filter(p => p.lines.length);
    return plans.toSorted((a,b) => Number(a.candidate.pending.length > 0)-Number(b.candidate.pending.length > 0) || Number(b.candidate.breedAffinity)-Number(a.candidate.breedAffinity) || total(a.lines)-total(b.lines));
  };
  // Hold the recipe constant across tiers so the comparison reflects their added components.
  const wholePlans=plansFor("mix",dailyGrams*options.days);
  const splitPlans=plansFor("mix",split.mix*options.days);
  const autoMix=cooked ? (wholePlans[0] ?? splitPlans[0])?.candidate : wholePlans.find(plan => formulaKind(plan.candidate.item.catalog) === "complete")?.candidate ??
    splitPlans.find(plan => formulaKind(plan.candidate.item.catalog) === "complete")?.candidate ?? wholePlans[0]?.candidate;
  const varietyLevel=profile.species === "cat" ? "none":options.varietyLevel ?? "none";
  const rotation=varietyLevel === "none" ? null:planVariety(byRole.mix,options.selected.mix,varietyLevel,options.days,dailyGrams,(candidate,target)=>weightedLines(candidate,target,"mix",dailyGrams),"mix",options.feedingMode);
  const selectedMix=byRole.mix.find(c => c.item.catalog.id === options.selected.mix) ?? autoMix;
  const wild=varietyLevel === "none" && selectedMix && formulaKind(selectedMix.item.catalog) === "wild";
  const chooseWeight=(role:"mix"|"complement",target:number) => {
    const explicit=byRole[role].find(c => c.item.catalog.id === options.selected[role]);
    if(options.selected[role] && !explicit) return [];
    const candidate=explicit ?? (role === "mix" ? autoMix : plansFor(role,target)[0]?.candidate);
    return candidate ? weightedLines(candidate,target,role,role === "mix" ? target/options.days:undefined) : [];
  };
  const complementVarietyLevel=profile.species === "cat" ? "none":options.complementVarietyLevel ?? "none";
  const priorityCandidate=byRole.complement.find(c=>isUnderweightComplement(c.item.catalog,profile));
  // Anchor the first rotation slot before comparing cost, stock coverage or
  // breed affinity. A missing priority product requires review, not substitution.
  const complementPrincipal=options.selected.complement ?? priorityCandidate?.item.catalog.id;
  // Eligibility thresholds use the full complement allowance on each serving day, never allowance / variety.
  const complementPlan=!wild && split.complement > 0 ? priorityComplement && !options.selected.complement && !priorityCandidate ?
    {allocations:[],warning:null,error:"El primer complemento por bajo peso no es compatible con la porción final o no está disponible en el catálogo."}:
    planVariety(byRole.complement,complementPrincipal,complementVarietyLevel,options.days,split.complement,(candidate,target)=>weightedLines(candidate,target,"complement"),"complement",options.feedingMode,
      (candidate,chosen)=>complementPriority(candidate.item.catalog,split.complement,chosen.map(a=>a.candidate.item.catalog))):null;
  const snacks=profile.species === "dog" ? buildSnackKit(byRole.snack,profile,options.days,options.selected.snack):null;
  const packages:FlowPackage[]=packageDefinitions.map(definition => {
    const requiredRoles:readonly Role[]=definition.roles;
    const complements=requiredRoles.includes("complement");
    const blockedWild=Boolean(complements && wild && split.complement > 0);
    const complementDailyGrams=complements && !wild ? split.complement : 0;
    const mixDailyGrams=dailyGrams-complementDailyGrams;
    const packageMixAllocations=rotation ? optimizeFlavorDays(rotation.allocations,options.days,mixDailyGrams,(candidate,target)=>weightedLines(candidate,target,"mix",mixDailyGrams)):[];
    const portionPlan=complements && !wild && options.complementPercent > 0 ? split:undefined;
    const lines:FlowLine[]=[];const missing:string[]=[];
    const baseFormulaNote=cooked ? cookedFormulaNote : wild ? "Wild ya incorpora sus complementos: se cotiza el 100% de la ración, sin complementos de fórmula adicionales." :
      `Complete cubre ${dailyGrams ? Math.round(mixDailyGrams/dailyGrams*100):100}% de la ración (mínimo 80%). Complementos de fórmula: ${complementDailyGrams} g/día, máximo 20%.`;
    const formulaNote=naturalCoverage.percent === 100 && !override ? baseFormulaNote:`${naturalCoverage.note} ${baseFormulaNote.replace("de la ración", "de la porción natural cotizada")}`;
    if(blockedWild) missing.push("Wild no puede ser la base de un paquete con complementos de fórmula. Elige una receta Complete o un paquete Base/Funcional.");
    for(const role of definition.roles) {
      if(role === "snack" && snacks) {
        lines.push(...snacks.lines);missing.push(...snacks.missing);continue;
      }
      if(canineKit && (role === "supplement" || role === "probiotic")) {
        if(role === "supplement" && canineKit.senior === "review")missing.push("Kit senior: confirmar el límite de tamaño para aplicar la edad de 7,5 u 8 años.");
        for(const requirement of canineKit.products.filter(p=>p.role === role)) {
          const candidate=byRole[role].find(c=>isKitProduct(c.item.catalog,requirement.row));
          const kitDecision=candidate ? supplementKitDecision(candidate,profile):undefined;
          const entries=candidate ? componentLines(candidate,role,profile,options.days,false,options.supplementMode):[];
          if(!entries.length)missing.push(`Kit obligatorio: falta ${requirement.name} compatible, con precio, stock y presentación suficientes. Requiere revisión.`);
          if(entries.some(line=>line.dose?.status !== "calculated"))missing.push(`Kit obligatorio: ${requirement.name} necesita una pauta y un contenido de presentación verificables para recomendar su porción. Un envase estándar no sustituye el cálculo de dosis; requiere revisión.`);
          if((options.supplementMode ?? "period") === "period" && entries.some(line=>line.dose?.coverageConfirmed !== true))missing.push(`Kit para todo el período: no se puede confirmar cobertura de ${requirement.name}.`);
          lines.push(...entries.map(line=>({...line,kitDecision})));
        }
        if(options.selected[role] && !lines.some(l=>l.component === role && l.item.catalog.id === options.selected[role]))missing.push("La selección anterior de suplementos no pertenece al kit obligatorio. Restablece la selección automática para revisar el kit.");
        continue;
      }
      const entries=role === "mix" ? rotation ? packageMixAllocations.flatMap(a=>weightedLines(a.candidate,mixDailyGrams*a.days,"mix",mixDailyGrams)):chooseWeight(role,mixDailyGrams*options.days) : role === "complement" ? complementDailyGrams ? complementPlan?.allocations.flatMap(a=>weightedLines(a.candidate,complementDailyGrams*a.days,"complement")) ?? [] : [] : selectedComponent(role);
      lines.push(...entries.map(line=>role === "complement" && !options.selected.complement && isUnderweightComplement(line.item.catalog,profile) ?
        {...line,reason:`Primer complemento por bajo peso: ${line.item.catalog.name}, según el peso real de la mascota. Se conserva la porción diaria calculada.`}:line));
      if(!entries.length && !(role === "complement" && complementDailyGrams === 0)) missing.push(`${role === "mix" && cooked ? "Base cocinada":roleLabels[role]}: sin producto compatible con precio, stock y presentación suficientes.`);
    }
    if(lines.some(line=>line.component === "egg") && !lines.some(line=>line.component === "egg" && line.dose?.status === "calculated" && line.dose.egg))missing.push("Huevo obligatorio: verificar la pauta por peso y una caja de diez unidades antes de compartir. Un envase estándar no sustituye la cantidad de huevos calculada.");
    if(rotation?.error)missing.push(rotation.error);
    const allocations:FlavorAllocation[]=rotation ? packageMixAllocations:selectedMix && lines.some(l=>l.component === "mix") ? [{candidate:selectedMix,days:options.days}]:[];
    const mixRotation=rotationDetails(varietyLevel,allocations,mixDailyGrams,lines);
    const complementRotation=complementRotationDetails(complementVarietyLevel,complementDailyGrams ? complementPlan?.allocations ?? []:[],complementDailyGrams,lines);
    if(complementDailyGrams && complementPlan?.error)missing.push(complementPlan.error);
    if(complementDailyGrams && priorityComplement && !options.selected.complement && complementPlan?.error)missing.push(`Bajo peso: se requiere ${priorityComplement.name} como primer complemento, con porción mínima de 20 g y presentación en gramos, precio y stock suficientes. Confirmar los datos o seleccionar manualmente otro complemento.`);
    const explicitComplement=byRole.complement.find(c => c.item.catalog.id === options.selected.complement);
    if(complementDailyGrams > 0 && options.selected.complement && !explicitComplement) missing.push("El complemento seleccionado no cumple el Tipo de complemento o el mínimo diario de porción. Vuelve a seleccionarlo.");
    const pending=[...new Set(lines.flatMap(l => l.pending))];const issues=stockIssues(lines);const subtotal=total(lines);
    return {...definition,naturalCoverage,feedingMode:options.feedingMode ?? "standard",...(requiredRoles.includes("snack") && snacks ? {snackKit:snacks.details}:{}),mixRotation,complementRotation,complementVarietyWarning:complementDailyGrams ? complementPlan?.warning ?? null:null,varietyWarning:rotation?.warning ?? null,lines,missing,pending,stockIssues:issues,mixDailyGrams,complementDailyGrams,...packagePrice(subtotal),ready:missing.length === 0 && pending.length === 0 && issues.length === 0,formulaNote,portionPlan};
  });
  const notes=[cooked ? cookedFormulaNote:"Tipo de complemento determina la fórmula: Complete mínimo 80%; complementos de fórmula máximo 20% en conjunto. Wild se cotiza al 100%, sin complementos de fórmula adicionales.","Los mínimos por producto usan los gramos diarios finales de complemento: desde 20, 50 o 100 g inclusive, o más de 200 g según el producto. No se comparan con la ración total ni con el peso del envase. Los productos sin un mínimo aprobado no se seleccionan como complemento.",cooked ? "La modalidad cocinada habilita únicamente las tres monoproteicas cocinadas verificadas. Las demás exclusiones se mantienen. Un complemento sin peso en gramos requiere revisión.":"Productos sin clasificación o marcados No considerar no se usan para completar la fórmula. Un complemento sin peso en gramos requiere revisión; no se infiere su peso por unidad.","Huevo obligatorio en todos los paquetes. Las pautas inequívocas en gramos de levadura nutricional, polen y mejillón en polvo calculan consumo y envases del período. Los componentes sin pauta resoluble conservan una estimación de un envase y requieren confirmar uso, frecuencia y dosis.","El excedente de los envases no aumenta la ración diaria. Precios netos; envío e impuestos pendientes."];
  return {referral:null,naturalCoverage,rawDailyGrams,dailyGrams,split,candidates:byRole,packages,notes};
}
export function familyStockIssues(packages:{lines:QuoteLine[]}[]) {return stockIssues(packages.flatMap(p => p.lines));}
