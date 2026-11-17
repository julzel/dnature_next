import { z } from "zod";
import { inventory, effectivePrice } from "@/features/feeding/engine/catalog/avify/model";
import type { CuratedItem } from "../nutrition";
import { assessProducts, type ProductAssessment } from "./eligibility";
import { saleableOffers, offerMassEstimate, type QuoteLine } from "./purchasing";
import { issue } from "./issues";
import type { BuilderProfile } from "./intake";
export const extraSelectionsSchema=z.array(z.object({catalogId:z.string().min(1),sku:z.string().min(1),quantity:z.number().int().min(1).max(999)})).max(40).refine(items=>new Set(items.map(item=>item.sku)).size === items.length,"Cada presentación debe aparecer una sola vez.");
export type ExtraSelection=z.infer<typeof extraSelectionsSchema>[number];
export function additionalOffers(items:CuratedItem[],profile:BuilderProfile,assessments=assessProducts(items,profile)) {
  return assessments.filter(a=>a.status === "allowed").flatMap(({item,advisories})=>saleableOffers(item).map(variant=>({item,variant,unitPrice:effectivePrice(variant)!,available:inventory(variant).available,advisories})));
}
export type AdditionalOffer=ReturnType<typeof additionalOffers>[number];
export function buildExtras(selections:ExtraSelection[],offers:AdditionalOffer[],petId:string,assessments:ProductAssessment[]=[]) {
  const lines:QuoteLine[]=[];
  const issues=[];
  for(const selection of extraSelectionsSchema.parse(selections)) {
    const offer=offers.find(o=>o.item.catalog.id === selection.catalogId && o.variant.sku === selection.sku);
    if(!offer){
      const assessment=assessments.find(a=>a.item.catalog.id === selection.catalogId);
      const detail=[...(assessment?.reasons.map(r=>r.message) ?? []),...(assessment?.commercial.problems.filter(p=>!p.sku || p.sku === selection.sku).map(p=>p.message) ?? [])].join(" ");
      issues.push(issue("INVALID_EXTRA","EXT-001",`Adicional ${assessment?.item.catalog.name ?? `SKU ${selection.sku}`}: ${detail || "ya no tiene elegibilidad, precio o stock confirmado."} Quita el producto o actualiza la selección.`,{petId,catalogId:selection.catalogId,sku:selection.sku}));continue;
    }
    const massEstimate=offerMassEstimate(offer.item,offer.variant);
    lines.push({item:offer.item,variant:offer.variant,quantity:selection.quantity,unitPrice:offer.unitPrice,grams:null,...(massEstimate ? {massEstimate}:{}),role:"Adicional manual",reason:"Producto añadido por el representante; no modifica la ración y su importe participa en el descuento de la orden."});
    if(massEstimate)issues.push(issue("ESTIMATED_MASS","PRD-WEIGHT-001",`${offer.item.catalog.name}: ${massEstimate.note}`,{petId,catalogId:selection.catalogId,sku:selection.sku,severity:"warning"}));
    for(const message of offer.advisories)issues.push(issue("SUPERVISED_SNACK","SNK-006",`${offer.item.catalog.name}: ${message}`,{petId,catalogId:selection.catalogId,sku:selection.sku,severity:"warning"}));
  }
  return {lines,issues,pending:issues.filter(i=>i.severity === "blocking").map(i=>i.message),subtotal:lines.reduce((sum,l)=>sum+l.quantity*l.unitPrice,0)};
}
export type ExtraResult=ReturnType<typeof buildExtras>;
