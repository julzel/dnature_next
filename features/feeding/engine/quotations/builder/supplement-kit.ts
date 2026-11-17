import { normalize, type Product } from "@/features/feeding/engine/sandbox/catalog";
import type { FlowProfile, Candidate, Role } from "./profile";

const names:Record<number,string>={15:"Caldo hueso",67:"Kefir de leche de cabra",72:"Levadura nutricional",95:"Polen",74:"Mejillón de Labio Verde",75:"Mejillon de Labio Verde en polvo",119:"Suplemento senior"};
export function isKitProduct(product:Product,row:number) {return product.row === row && normalize(product.name) === normalize(names[row]);}
export function musselFormAllowed(product:Product,pet:{species:string;weight?:number}) {
  if(pet.species !== "dog" || pet.weight === undefined)return true;
  if(isKitProduct(product,75))return pet.weight <= 7;
  if(isKitProduct(product,74))return pet.weight > 7;
  return true;
}
/** Product-specific threshold; does not change the ration calculator's life stages. */
export function seniorKitStatus(pet:Pick<FlowProfile,"age"|"weight">):"yes"|"no"|"review" {
  if(pet.age === undefined || pet.weight === undefined)return "review";
  return pet.age >= (pet.weight > 10 ? 7.5:8) ? "yes":"no";
}
export function kitRequirements(profile:FlowProfile) {
  const senior=seniorKitStatus(profile);
  return {senior,products:[72,95,senior === "yes" ? 119:profile.weight! <= 7 ? 75:74,15,67].map(row=>({row,name:names[row],role:(row === 67 ? "probiotic":"supplement") as Role}))};
}
export function kitCandidates(candidates:Candidate[],profile:FlowProfile) {
  const {products}=kitRequirements(profile);
  return products.flatMap(product=>candidates.filter(c=>isKitProduct(c.item.catalog,product.row)));
}
