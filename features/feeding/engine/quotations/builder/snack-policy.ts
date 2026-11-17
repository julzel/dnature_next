import { catalogValue, normalize, type Product } from "@/features/feeding/engine/sandbox/catalog";
import type { QuotePeriod } from "../period";

export const snackRoles=["training","chew","recreation"] as const;
export type SnackRole=typeof snackRoles[number];
export const snackRoleLabels:Record<SnackRole,string>={training:"Entrenamiento",chew:"Masticable",recreation:"Recreativo de larga duración"};
const products=[
  {row:102,name:"Pulmon deshidratado de res"},
  {row:140,name:"Pulmon deshidratado de caballo"},
  {row:32,name:"Cuellos de Pollo deshidratados"},
  {row:50,name:"Esofago Deshidratado",supervised:true},
  {row:92,name:"Patas de pollo deshidratadas"},
  {row:85,name:"Oreja de res sin pelo deshidratada",supervised:true},
  {row:129,name:"Traqueas de Res deshidratadas",supervised:true},
  {row:142,name:"Traqueas de caballo deshidratadas",supervised:true},
  {row:8,name:"Bully sticks deshidratados",supervised:true},
  {row:65,name:"Huesos"},
] as const;

export function snackProductPolicy(product:Product) {
  const policy=products.find(p=>p.row === product.row || normalize(p.name) === normalize(product.name));
  if(!policy)return null;
  const valid=policy.row === product.row && normalize(policy.name) === normalize(product.name) && product.category === "chew";
  return {policy,valid,supervised:valid && "supervised" in policy && policy.supervised && normalize(product.risk) === "alta" && normalize(catalogValue(product,17)) === "alta" && /obligatoria/.test(normalize(product.supervision))};
}

export function snackKitRoles(days:QuotePeriod):readonly SnackRole[] {return days === 14 ? ["training","recreation"]:snackRoles;}
export function snackKitRoleLabel(role:SnackRole,weight:number,days:QuotePeriod) {
  if(days === 14)return role === "training" ? "Pulmón deshidratado":weight < 10 ? "Esófago deshidratado":"Tráquea deshidratada";
  return snackRoleLabels[role];
}

export function snackRows(weight:number,days:QuotePeriod=30):Record<SnackRole,readonly number[]> {
  if(days === 14)return weight < 10 ? {training:[102,140],chew:[],recreation:[50]}:{training:[102,140],chew:[],recreation:[129,142]};
  return weight < 10 ? {training:[102,140],chew:[32],recreation:[50]}:
    weight <= 20 ? {training:[102,140],chew:[92,129,142],recreation:[85,129,142]}:
    {training:[102,140],chew:[129,142],recreation:[8,65]};
}

export function snackBudget(weight:number,days:QuotePeriod) {
  const monthly=weight < 10 ? 8000:weight <= 25 ? 10000:15000;
  return {monthly,limit:days === 14 ? monthly/2:days === 28 ? monthly:Math.round(monthly*days/30*100)/100};
}

export function snackSafetyNotes(product:Product) {
  const supervised=snackProductPolicy(product)?.supervised;
  return [
    ...(supervised ? ["Riesgo de atragantamiento alto indicado en el catálogo. Ofrecer siempre bajo supervisión directa y elegir el tamaño adecuado para sus características y hábitos de masticación."]:[]),
    ...(product.supervision ? [`Supervisión indicada: ${product.supervision}.`]:[]),
    ...(product.note ? [product.note]:[]),
    ...(catalogValue(product,12) ? [`No recomendado para: ${catalogValue(product,12)}.`]:[]),
  ];
}
