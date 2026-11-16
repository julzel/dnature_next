import { normalize, type Product } from "@/features/feeding/engine/sandbox/catalog";
import type { PetProfile } from "./nutrition";

export type ComplementPortionProfile=Pick<PetProfile,"species"> & Partial<Pick<PetProfile,"body"|"weight">>;

export const underweightTesticleRules = [
  { row: 121, name: "Testiculo trozos crudos", minimumGrams: 20, inclusive: true },
  { row: 122, name: "Testiculos", minimumGrams: 20, inclusive: true },
] as const;

export function underweightComplement(profile:ComplementPortionProfile|undefined) {
  if(profile?.species !== "dog" || profile.body !== "thin" || !Number.isFinite(profile.weight) || profile.weight! <= 0)return undefined;
  return underweightTesticleRules[profile.weight! < 20 ? 0:1];
}

export function isUnderweightComplement(product:Pick<Product,"row"|"name">,profile:ComplementPortionProfile|undefined) {
  const rule=underweightComplement(profile);
  return !!rule && rule.row === product.row && normalize(rule.name) === normalize(product.name);
}

// Sales-approved daily complement portions. Match both source row and name:
// a presentation size or a similar product name cannot grant eligibility.
export const complementPortionRules = [
  { row: 22, name: "Corazon de cordero", minimumGrams: 20, inclusive: true },
  { row: 23, name: "Corazón de caballo", minimumGrams: 20, inclusive: true },
  { row: 24, name: "Corazon de res", minimumGrams: 20, inclusive: true },
  { row: 29, name: "Corazon de ternero", minimumGrams: 20, inclusive: true },
  { row: 70, name: "Lengua de Cordero", minimumGrams: 20, inclusive: true },
  { row: 94, name: "Pechuga de pollo en trozos", minimumGrams: 20, inclusive: true },
  { row: 91, name: "Patas de pollo crudas", minimumGrams: 20, inclusive: true },
  { row: 135, name: "Truchas crudas (cabezas)", minimumGrams: 50, inclusive: true },
  { row: 117, name: "Sardinas crudas", minimumGrams: 50, inclusive: true },
  { row: 31, name: "Cuellos de Pollo crudos", minimumGrams: 50, inclusive: true },
  { row: 3, name: "Alas de Pollo", minimumGrams: 100, inclusive: true },
  { row: 19, name: "Codorniz cruda", minimumGrams: 100, inclusive: true },
  { row: 11, name: "Caballo en trozos", minimumGrams: 200, inclusive: false },
  { row: 99, name: "Proteína de Res 500g", minimumGrams: 200, inclusive: false },
  { row: 100, name: "Proteina de res y caballo", minimumGrams: 200, inclusive: false },
  { row: 93, name: "Pechuga", minimumGrams: 200, inclusive: false },
] as const;

export function complementPortionRule(product: Pick<Product, "row" | "name">,profile?:ComplementPortionProfile) {
  return complementPortionRules.find(rule => rule.row === product.row && normalize(rule.name) === normalize(product.name)) ??
    (isUnderweightComplement(product,profile) ? underweightComplement(profile):undefined);
}
