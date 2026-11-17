import { normalize } from "@/features/feeding/engine/sandbox/catalog";
import type { CuratedItem } from "../nutrition";
import type { FlowProfile } from "./profile";

const ingredientTerms = {pollo:/\b(pollo|aves|ave)\b/,res:/\b(res|bovina|bovino|ternero)\b/,pescado:/\b(pescado|trucha|sardina|salmon|bacalao|mariscos)\b/,cordero:/\bcordero\b/,caballo:/\b(caballo|equina|equino)\b/,huevo:/\bhuevos?\b/,lacteos:/\b(leche|kefir|lacteos|yogur|queso)\b/};

export function avoidsRecordedAllergens(item: CuratedItem, profile: Pick<FlowProfile,"allergies">) {
  const source = normalize(`${item.catalog.name} ${item.catalog.allergy} ${item.catalog.description}`);
  return !profile.allergies.some(allergen => ingredientTerms[allergen].test(source));
}
