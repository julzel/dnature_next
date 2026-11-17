import { z } from "zod";
import { calculatePortion } from "./portion";
import { normalize, type Product } from "@/features/feeding/engine/sandbox/catalog";
import type { AvifyProduct } from "@/features/feeding/engine/catalog/avify/model";
import { breedRestriction } from "./breeds";
import { formulaKind } from "./formula";

export const petProfileSchema = z.object({
  id: z.string().min(1), name: z.string().trim().min(1).max(60), species: z.enum(["dog", "cat"]),
  age: z.coerce.number().min(0).max(30), weight: z.coerce.number().min(.1).max(100),
  lifeStage: z.enum(["adult", "growing"]), size: z.enum(["small", "medium", "large"]),
  breed: z.string().max(100), sex: z.enum(["female", "male"]), neutered: z.boolean(),
  activity: z.enum(["calm", "normal", "active"]), body: z.enum(["thin", "ideal", "overweight"]),
  goal: z.enum(["wellness", "digestion", "skin", "joints", "energy", "weight"]),
  behavior: z.enum(["calm", "training", "anxious"]), health: z.enum(["healthy", "condition", "unsure"]),
  allergies: z.array(z.enum(["pollo", "res", "pescado", "cordero", "caballo", "huevo", "lacteos"])).max(7),
});
export type PetProfile = z.infer<typeof petProfileSchema>;
export type CuratedItem = { catalog: Product; avify: AvifyProduct };
export const goalLabels = { wellness: "Bienestar diario", digestion: "Digestión feliz", skin: "Piel y pelaje", joints: "Movilidad", energy: "Más energía", weight: "Control de peso" };
export function petSize(pet: Pick<PetProfile, "weight" | "species">) {
  if (pet.species === "cat") return pet.weight <= 5 ? "pequeno" : "mediano";
  return pet.weight <= 5 ? "mini" : pet.weight <= 10 ? "pequeno" : pet.weight <= 25 ? "mediano" : "grande";
}
export function assessment(pet: PetProfile) {
  if (pet.lifeStage === "growing" || pet.age < 1) return "Está creciendo. Nuestro equipo debe revisar su alimentación antes de cotizar.";
  if (pet.health !== "healthy") return "Sus necesidades de salud merecen una revisión individual con nuestro equipo.";
  if (calculatePortion(pet) === null) return "Necesitamos revisar esta combinación de condición corporal y actividad antes de cotizar.";
  return null;
}
const allergens: Record<string, string[]> = {
  pollo: ["pollo", "aves", "ave"], res: ["res", "bovina", "bovino", "ternero"], pescado: ["pescado", "trucha", "sardina", "salmon", "mariscos"],
  cordero: ["cordero"], caballo: ["caballo", "equina", "equino"], huevo: ["huevo", "huevos"], lacteos: ["leche", "kefir", "lacteos"],
};
export function filterCatalog(items: CuratedItem[], pet: Pick<PetProfile, "species"> & Partial<PetProfile>) {
  const species = pet.species === "dog" ? "perro" : "gato";
  const stage = pet.lifeStage === "growing" || (pet.age !== undefined && pet.age < 1) ? "cachorro" : pet.age !== undefined ? pet.age >= 8 ? "senior" : "adulto" : pet.lifeStage === "adult" ? "adulto" : null;
  const speciesItems = items.filter(({ catalog: c }) => c.species.includes(species));
  const size = pet.weight === undefined ? null : petSize({ species: pet.species, weight: pet.weight });
  const lifeItems = speciesItems.filter(({ catalog: c }) => (!stage || c.stages.includes(stage)) && (!size || c.sizes.includes(size)));
  const compatible = lifeItems.filter(({ catalog: c }) => {
    if (c.review || normalize(c.risk).includes("alta")) return false;
    const source = normalize([c.name, c.allergy, c.description].join(" "));
    if (breedRestriction(c, pet)) return false;
    if (pet.allergies?.length && /revisar componentes|alergias especificas/.test(normalize(c.allergy))) return false;
    return !pet.allergies?.some(a => (allergens[a] ?? [a]).some(word => new RegExp(`\\b${word}\\b`).test(source)));
  });
  return { items: compatible, funnel: [items.length, speciesItems.length, lifeItems.length, compatible.length] };
}
export function isCompleteRecipe(item: CuratedItem) {
  return item.catalog.category === "base" && ["complete","wild"].includes(formulaKind(item.catalog))
    && !/no es una dieta completa/.test(normalize(item.catalog.note)) && /^dnature /i.test(item.catalog.name);
}
export function nutritionPlan(pet: PetProfile, days: number) {
  const dailyGrams = assessment(pet) ? null : calculatePortion(pet);
  return { dailyGrams, monthlyGrams: dailyGrams === null ? null : dailyGrams * days,
    complementMaxGrams: dailyGrams === null ? null : Math.floor(dailyGrams * .2),
    reason: `${pet.name}: ${goalLabels[pet.goal].toLowerCase()}, ${pet.activity === "active" ? "una rutina activa" : pet.activity === "calm" ? "una rutina tranquila" : "actividad moderada"}${pet.age >= 8 ? " y etapa senior" : ""}.` };
}
