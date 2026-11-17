import { normalize, type Product } from "@/features/feeding/engine/sandbox/catalog";
import { complementPortionRule, type ComplementPortionProfile } from "./complement-portions";

export type FormulaKind = "complete" | "wild" | "portionable" | "over-50g" | "over-100g" | "egg" | "excluded" | "unclassified";
const kinds:Record<string,FormulaKind> = {
  "base principal equivalente a minimo el 80% de la dieta":"complete",
  "no requiere complementos":"wild",
  "complemento para formula":"portionable",
  "complemento para porciones mayor a 50g":"over-50g",
  "complemento para porciones mayor a 100g":"over-100g",
  obligatorio:"egg", "no considerar":"excluded",
};
export function formulaKind(product:Pick<Product,"complementType">):FormulaKind {
  return kinds[normalize(product.complementType).replace(/\s+/g," ")] ?? "unclassified";
}
export function isFormulaComplement(product:Pick<Product,"complementType">) {
  return ["portionable","over-50g","over-100g"].includes(formulaKind(product));
}
export function complementFitsPortion(product:Pick<Product,"complementType"|"row"|"name">,dailyGrams:number,profile?:ComplementPortionProfile) {
  if(!Number.isFinite(dailyGrams) || !isFormulaComplement(product))return false;
  const rule=complementPortionRule(product,profile);
  return !!rule && (rule.inclusive ? dailyGrams >= rule.minimumGrams:dailyGrams > rule.minimumGrams);
}
