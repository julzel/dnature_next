import { normalize } from "@/features/feeding/engine/sandbox/catalog";
import type { CuratedItem } from "../nutrition";
import { effectivePrice } from "@/features/feeding/engine/catalog/avify/model";
import { offerGrams, optimizePacks, saleableOffers } from "./purchasing";
import type { DoseAssessment } from "./dosing";
import { kefirGramsPerMl, withDoseCoverage } from "./dosing";
import { isKitProduct } from "./supplement-kit";
import type { Candidate, FlowLine, Role } from "./profile";
import { roleLabels } from "./profile";

export type SupplementMode="starter"|"period";
type Offer=ReturnType<typeof saleableOffers>[number];
export function offerAmount(item:CuratedItem,offer:Offer,unit:"ml"|"capsules"):number|null {
  const kefirMass=unit === "ml" && isKitProduct(item.catalog,67);
  const values=[offer.name ?? "",...("attributes" in offer ? offer.attributes.map(a=>a.value):[])].map(normalize);
  const parse=(label:string)=>{
    const match=label.match(unit === "ml" ? kefirMass ? /^(\d+(?:[.,]\d+)?)\s*(ml|l|litros?|g|kg)$/ : /^(\d+(?:[.,]\d+)?)\s*(ml|l|litros?)$/ : /^(\d+)\s*(capsulas?|caps?)$/);
    if(!match)return null;
    const amount=Number(match[1].replace(",","."))*(["l","litro","litros","kg"].includes(match[2]) ? 1000:1);
    return ["g","kg"].includes(match[2]) ? amount/kefirGramsPerMl:amount;
  };
  if(values.some(v=>unit === "ml" ? (kefirMass ? /\d\s*(capsulas?|cap|unidades?)\b/:/\d\s*(kg|g|capsulas?|cap|unidades?)\b/).test(v):/\d\s*(kg|g|ml|l|unidades?)\b/.test(v)))return null;
  const amounts=values.map(parse).filter((v):v is number=>v !== null);
  if(amounts.length)return amounts.every(v=>v === amounts[0]) && amounts[0] > 0 ? amounts[0]:null;
  if(values.some(v=>/\d/.test(v)))return null;
  const fallback=item.avify.children.length === 0 ? parse(normalize(item.catalog.presentation)):null;
  return fallback !== null && fallback > 0 ? fallback:null;
}

export function purchaseSupplement(candidate:Candidate,component:Role,dose:DoseAssessment,mode:SupplementMode):FlowLine[] {
  const item=candidate.item;
  const offers=saleableOffers(item);
  const unit=dose.measure?.unit ?? "g";
  const measure=(offer:Offer)=>unit === "g" ? offerGrams(item,offer):offerAmount(item,offer,unit);
  const target=dose.measure?.required ?? dose.requiredGrams;
  const measurable=offers.flatMap(offer=>{const amount=measure(offer);return amount === null ? []:[{offer,amount}];});
  const known=dose.status === "calculated" && target !== null && measurable.length > 0;
  const purchase=mode === "period" && known ? optimizePacks(measurable,target!) : offers.toSorted((a,b)=>effectivePrice(a)!-effectivePrice(b)!).slice(0,1).map(offer=>({offer,quantity:1,amount:measure(offer)}));
  if(!purchase.length)return [];
  let evaluated: DoseAssessment={...dose,purchaseMode:mode};
  const purchased=purchase.every(p=>p.amount !== null) ? purchase.reduce((sum,p)=>sum+p.amount!*p.quantity,0):null;
  if(dose.status === "calculated" && purchased !== null && target !== null) {
    if(dose.measure) {
      const range=dose.measure.dailyRange;
      // Buy the cheapest minimum coverage, then reduce waste within the approved range.
      const daily=range ? Math.max(range[0],Math.floor(Math.min(range[1],purchased/dose.periodDays)*100)/100):dose.measure.daily;
      const required=range ? Math.round(daily!*dose.periodDays*100)/100:target;
      const excess=Math.round((purchased-required)*100)/100;
      evaluated={...evaluated,coverageConfirmed:excess >= 0,measure:{...dose.measure,daily,required,purchased,excess},message:`${dose.message}${range ? ` Cantidad elegida: ${daily} ml/día; ${required} ml en el período.`:""} Compra: ${purchased} ${unit === "ml" ? "ml":"cápsulas"}; ${excess >= 0 ? "sobrante":"faltante"}: ${Math.abs(excess)}. El sobrante no aumenta la dosis.`};
    } else evaluated=withDoseCoverage(evaluated,purchased);
  } else evaluated={...evaluated,status:"review",coverageConfirmed:false,message:`${dose.message} No se acredita cobertura: confirmar pauta y contenido de la presentación en ${unit === "capsules" ? "cápsulas":unit}. ${isKitProduct(item.catalog,67) ? "La equivalencia del kéfir de 1 g = 1 ml no resuelve un contenido ambiguo o contradictorio.":"No se convierten gramos a mililitros."}`};
  if(mode === "starter")evaluated={...evaluated,message:`Kit inicial: un envase por producto; no promete cobertura de todo el período. La porción depende del peso; un envase no es una dosis. ${evaluated.message}`};
  return purchase.map(({offer,quantity})=>({item,variant:offer,quantity,unitPrice:effectivePrice(offer)!,grams:offerGrams(item,offer),component,role:roleLabels[component],pending:candidate.pending,breedAffinity:candidate.breedAffinity,dose:evaluated,reason:evaluated.message}));
}
