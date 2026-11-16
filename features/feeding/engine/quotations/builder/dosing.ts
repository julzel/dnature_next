import { catalogValue, normalize, type Product } from "@/features/feeding/engine/sandbox/catalog";
import { ruleReference, type RuleId, type RuleReference } from "./issues";
import { eggBudgetWeeks, eggWeeklyOptions, planEggs, eggPeriodNote, eggStorageWeeks } from "./egg-policy";
import type { QuotePeriod } from "../period";
export const kefirGramsPerMl = 1 as const;

export type DoseSource = {
  sheet: "BASE SIN MODIF";
  row: number;
  quantityCell: string;
  frequencyCell: string;
  quantity: string;
  frequency: string;
};
export type DoseAssessment = {
  status: "calculated" | "review";
  source: DoseSource;
  rule?: RuleReference;
  dailyGrams: number | null;
  requiredGrams: number | null;
  periodDays: QuotePeriod;
  purchasedGrams?: number;
  excessGrams?: number;
  measure?: {unit:"ml"|"capsules";required:number;daily?:number;dailyRange?:readonly [number,number];weekly?:number;purchased?:number;excess?:number;gramsPerMl?:1};
  purchaseMode?: "starter"|"period";
  coverageConfirmed?: boolean;
  egg?: {weeklyOptions:number[];weeklyUnits:number;requiredUnits:number;budgetWeeks:2|4;storageWeeks:number;standaloneBoxes:number;standaloneLeftoverUnits:number};
  message: string;
};

type ProductDosePolicy = {
  row: number;
  name: string;
  quantity: string;
  frequency: string;
  // CR confirmed inclusive upper bounds: 1–5, >5–10, >10–20, >20 kg.
  dailyGrams?: readonly [number, number, number, number];
  dailyMl?: readonly [number, number, number, number];
  dailyMlRanges?: readonly (readonly [number,number])[];
  weeklyCapsules?: readonly [number,number,number,number];
  ruleId?: RuleId;
  reviewReason?: string;
};
const frequency = "revisar cantidad recomendada";

// Explicit, reviewed translations of source cells. Never execute catalog text or
// the documentary rule registry. A changed source requires a policy review.
export const productDosePolicies: readonly ProductDosePolicy[] = [
  {
    row: 72, name: "Levadura nutricional", frequency, ruleId: "PRD-YEAST-001",
    quantity: "1-5kg: 0.5g al día / 5-10kg: 1g al día / 10-20kg: 2g al día / +20kg: 4g al día",
    dailyGrams: [0.5, 1, 2, 4],
  },
  {
    row: 95, name: "Polen", frequency, ruleId: "PRD-POLLEN-002",
    quantity: "1-5kg: 0.5g al día / 5-10kg: 1g al día / 10-20kg: 2g al día / +20kg: 3g al día",
    dailyGrams: [0.5, 1, 2, 3],
  },
  {
    row: 75, name: "Mejillon de Labio Verde en polvo", frequency, ruleId: "PRD-MUSSEL-003",
    quantity: "1-5kg: 0.5g al día / 5-10kg: 1g al día / 10-20kg: 2g al día / +20kg: 4g al día",
    dailyGrams: [0.5, 1, 2, 4],
  },
  {
    row: 66, name: "Huevos de codorniz (10)", frequency: "2-4 veces por semana", ruleId:"PRD-EGG-002",
    quantity: "1-5kg: 1-2 unidades por semana| 5-10kg: 2-4 unidades por semana | 10-20kg: 4-6 unidades por semana| +20kg: 6-8 unidades por semana",
  },
  {
    row: 67, name: "Kefir de leche de cabra", frequency, ruleId:"PRD-KEFIR-001",
    quantity: "1-5kg: 1/2 cucharaditas al día/5-10kg: 1 cucharaditas al día/10-20kg: 1  cucharada al día /+20kgs: 2 cucharadas al día",
    dailyMl: [2.5,5,15,30],
  },
  {
    row: 15, name: "Caldo hueso", frequency, ruleId:"PRD-BROTH-001",
    quantity: "1-5kg: 1–2 cucharadas al día/5-10kg: 2-4 cucharadas al día/10-20kg: ¼–½ taza al día/+20kgs: ½–1 taza al día",
    dailyMlRanges: [[15,30],[30,60],[62.5,125],[125,250]],
  },
  {
    row: 74, name: "Mejillón de Labio Verde", frequency, ruleId:"PRD-MUSSEL-002",
    quantity: "1-5kg: 1/2 cap 2 VXS | 5-10kg: 1 cap 2 VXS | 10-20+kg: 1 cap 3VXS | ",
    weeklyCapsules: [1,2,3,3],
  },
  {
    row: 119, name: "Suplemento senior", frequency, ruleId:"PRD-SENIOR-001",
    quantity: "1g por cada 10kg de peso",
  },
];

function sameText(a: string, b: string) {
  return normalize(a).replace(/\s+/g, " ") === normalize(b).replace(/\s+/g, " ");
}

export function assessProductDose(product: Product, weight: number, days: QuotePeriod): DoseAssessment | null {
  const policy = productDosePolicies.find(p => p.row === product.row && sameText(p.name, product.name));
  if (!policy) return null;
  const source: DoseSource = {
    sheet: "BASE SIN MODIF", row: product.row,
    quantityCell: `O${product.row}`, frequencyCell: `L${product.row}`,
    quantity: catalogValue(product, 13), frequency: product.frequency,
  };
  const review = (message: string): DoseAssessment => ({
    status: "review", source, ...(policy.ruleId ? {rule:ruleReference(policy.ruleId)}:{}), dailyGrams: null, requiredGrams: null, periodDays: days, message,
  });
  if (!sameText(source.quantity, policy.quantity) || !sameText(source.frequency, policy.frequency)) {
    return review("La pauta fuente cambió o está incompleta. Revisar la regla del producto antes de calcular su consumo.");
  }
  if(policy.row === 66) {
    const weeklyOptions=eggWeeklyOptions(weight);
    const plan=planEggs([weeklyOptions],eggBudgetWeeks(days));
    if(!plan)return review("El catálogo no define una pauta de huevos para este peso.");
    return {status:"calculated",source,rule:ruleReference("PRD-EGG-002"),dailyGrams:null,requiredGrams:null,periodDays:days,
      egg:{weeklyOptions,weeklyUnits:plan.weekly[0],requiredUnits:plan.requiredUnits,budgetWeeks:plan.budgetWeeks,storageWeeks:eggStorageWeeks,standaloneBoxes:plan.boxes,standaloneLeftoverUnits:plan.leftoverUnits},
      message:`${plan.weekly[0]} huevos por semana; ${plan.requiredUnits} huevos para ${plan.budgetWeeks} semanas. ${eggPeriodNote(plan.budgetWeeks,days)} Almacenamiento máximo recomendado: ${eggStorageWeeks} semanas. La compra se agrupa por familia; los sobrantes no aumentan la cantidad semanal.`};
  }
  if (!Number.isFinite(weight) || weight < 1) return review("El catálogo no define una pauta para este peso.");
  const band = weight <= 5 ? 0 : weight <= 10 ? 1 : weight <= 20 ? 2 : 3;
  const common={status:"calculated" as const,source,rule:policy.ruleId ? ruleReference(policy.ruleId):undefined,dailyGrams:null,requiredGrams:null,periodDays:days};
  if(policy.row === 119) {
    const dailyGrams=weight/10,requiredGrams=Math.round(dailyGrams*days*10000)/10000;
    return {...common,dailyGrams,requiredGrams,message:`Senior Active (Suplemento senior): ${dailyGrams} g/día, a razón de 1 g por cada 10 kg. Necesidad para ${days} días: ${requiredGrams} g.`};
  }
  if(policy.dailyMl || policy.dailyMlRanges) {
    const daily=policy.dailyMl?.[band] ?? policy.dailyMlRanges![band][0];
    const dailyRange=policy.dailyMlRanges?.[band];
    return {...common,measure:{unit:"ml",daily,required:daily*days,...(dailyRange ? {dailyRange}:{}),...(policy.row === 67 ? {gramsPerMl:kefirGramsPerMl}:{})},
      message:dailyRange ? `Rango confirmado: ${dailyRange[0]}–${dailyRange[1]} ml/día. Se ajusta a los envases dentro de ese rango.`:policy.row === 67 ? `Pauta confirmada: ${daily} ml/día (${daily*kefirGramsPerMl} g/día); ${daily*days} ml (${daily*days*kefirGramsPerMl} g) para ${days} días. Para este kéfir se aplica la equivalencia confirmada de 1 g = 1 ml. Cucharadita: 5 ml; cucharada: 15 ml.`:`Pauta confirmada: ${daily} ml/día; ${daily*days} ml para ${days} días. Cucharadita: 5 ml; cucharada: 15 ml.`};
  }
  if(policy.weeklyCapsules) {
    const weekly=policy.weeklyCapsules[band];
    const required=Math.ceil(weekly*days/7);
    return {...common,measure:{unit:"capsules",weekly,required},message:`${band === 0 ? "½ cápsula, 2 veces":band === 1 ? "1 cápsula, 2 veces":"1 cápsula, 3 veces"} por semana. Presupuesto proporcional para ${days} días: ${required} cápsulas enteras. Confirmar los días de administración; no es una dosis diaria ni usa las cuatro semanas de los huevos.`};
  }
  if (!policy.dailyGrams) return review(policy.reviewReason!);
  const dailyGrams = policy.dailyGrams[band];
  const requiredGrams = dailyGrams * days;
  return {
    status: "calculated", source, rule:ruleReference(policy.ruleId!), dailyGrams, requiredGrams, periodDays: days,
    message: `Pauta del catálogo: ${dailyGrams} g/día. Necesidad para ${days} días: ${requiredGrams} g.`,
  };
}

/** A calculated source dose becomes a covered purchase only after measuring the actual offers. */
export function withDoseCoverage(dose: DoseAssessment, purchasedGrams: number): DoseAssessment {
  return {...dose, coverageConfirmed:purchasedGrams >= dose.requiredGrams!, purchasedGrams, excessGrams: purchasedGrams - dose.requiredGrams!,
    message: `${dose.message} Compra: ${purchasedGrams} g; ${purchasedGrams >= dose.requiredGrams! ? "sobrante":"faltante"}: ${Math.abs(purchasedGrams - dose.requiredGrams!)} g. El sobrante no aumenta la dosis.`};
}

export function doseSummaries(lines: readonly {item: {catalog: Pick<Product, "id" | "name">}; dose?: DoseAssessment}[]) {
  return [...new Map(lines.filter(line=>line.dose).map(line=>[line.item.catalog.id, {
    id: line.item.catalog.id, name: line.item.catalog.name, dose: line.dose!,
  }])).values()];
}
