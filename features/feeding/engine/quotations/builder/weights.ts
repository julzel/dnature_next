import { isCookedRecipe } from "./feeding-mode";
import { isFormulaComplement } from "../formula";
import { isCompleteRecipe } from "../nutrition";
import type { FlowLine } from "./profile";
import { offerGrams, type QuoteLine } from "./purchasing";

type QuotedMass = { grams: number; unmeasuredUnits: number };
export type QuotedWeights = { mix: QuotedMass; complement: QuotedMass };

export function sumQuotedWeights(weights: QuotedWeights[]): QuotedWeights {
  return weights.reduce((total, weight) => ({
    mix: { grams: total.mix.grams + weight.mix.grams, unmeasuredUnits: total.mix.unmeasuredUnits + weight.mix.unmeasuredUnits },
    complement: { grams: total.complement.grams + weight.complement.grams, unmeasuredUnits: total.complement.unmeasuredUnits + weight.complement.unmeasuredUnits },
  }), { mix: { grams: 0, unmeasuredUnits: 0 }, complement: { grams: 0, unmeasuredUnits: 0 } });
}

/** Purchased mass only: additions and packaging surplus never change the daily ration. */
export function quotedWeights(lines: FlowLine[], extras: QuoteLine[]): QuotedWeights {
  const weights = sumQuotedWeights([]);
  const add = (line: QuoteLine, role: keyof QuotedWeights) => {
    const grams = offerGrams(line.item, line.variant);
    if (grams === null) weights[role].unmeasuredUnits += line.quantity;
    else weights[role].grams += grams * line.quantity;
  };
  for (const line of lines) {
    if (line.component === "mix" || line.component === "complement") add(line, line.component);
  }
  for (const line of extras) {
    if (isCompleteRecipe(line.item) || isCookedRecipe(line.item.catalog)) add(line, "mix");
    else if (isFormulaComplement(line.item.catalog)) add(line, "complement");
  }
  return weights;
}
