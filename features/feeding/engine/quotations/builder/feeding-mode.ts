import { z } from "zod";
import type { Product } from "@/features/feeding/engine/sandbox/catalog";
import type { CuratedItem } from "../nutrition";

export const feedingModeSchema = z.enum(["standard", "cooked_monoprotein"]);
export type FeedingMode = z.infer<typeof feedingModeSchema>;
export const feedingModeLabels: Record<FeedingMode, string> = {
  standard: "Alimentación estándar",
  cooked_monoprotein: "Alimentación cocinada · monoproteicas",
};

// Explicit sales exception: row AND name must still match the imported catalog.
// Never infer cooked eligibility from a substring or enable raw monoproteins.
export const cookedRecipes = [
  { row: 77, name: "Monoproteica de Caballo cocinada" },
  { row: 79, name: "Monoproteica de Pollo cocinada" },
  { row: 81, name: "Monoproteica de Res cocinada" },
] as const;
export function isCookedRecipe(product: Pick<Product, "row" | "name" | "category">) {
  return product.category === "base" && cookedRecipes.some(recipe => recipe.row === product.row && recipe.name === product.name);
}
export function usesCookedBase(mode: FeedingMode | undefined, species: string) {
  return mode === "cooked_monoprotein" && species === "dog";
}
export function isCookedBase(item: CuratedItem, mode: FeedingMode | undefined, species: string) {
  return usesCookedBase(mode, species) && isCookedRecipe(item.catalog);
}
export const cookedFormulaNote = "Alimentación cocinada: la monoproteica sustituye la base del paquete y conserva la ración y el reparto cotizados. La monoproteica por sí sola no es una dieta completa; se ofrece como parte de una alimentación completa y equilibrada.";
