import { smallMixPresentationGrams } from "./mix-presentation";
import { effectivePrice, inventory, type AvifyVariant, type AvifyProduct } from "@/features/feeding/engine/catalog/avify/model";
import { normalize } from "@/features/feeding/engine/sandbox/catalog";
import type { CuratedItem } from "../nutrition";
import { testiclePackEstimate, type MassEstimate } from "./testicle-mass";
type Saleable = AvifyVariant | AvifyProduct;
export type PurchaseObjective = "cost" | "containers" | "small-mix";
export type QuoteLine = { item: CuratedItem; variant: Saleable; quantity: number; unitPrice: number; role: string; reason: string; grams: number | null; massEstimate?:MassEstimate };
export function gramsInLabel(label: string) {
  const match = normalize(label).match(/^(\d+(?:[.,]\d+)?)\s*(kg|k|g)$/);
  const grams = match ? Number(match[1].replace(",", ".")) * (match[2] === "g" ? 1 : 1000) : null;
  return grams !== null && grams > 0 ? grams : null;
}
export function saleableOffers(item: CuratedItem) {
  return (item.avify.children.length ? item.avify.children : [item.avify]).filter(v => {
    const stock = inventory(v); const price = effectivePrice(v);
    return ![item.avify.status,v.status].some(status => status && status !== "active") && Boolean(v.sku) && price !== null && price >= 0 && (stock.state === "available" || stock.state === "on-demand");
  });
}
export function eggBoxOffers(item:CuratedItem) {
  return saleableOffers(item).filter(offer=>{
    const values=[offer.name ?? "",...("attributes" in offer ? offer.attributes.map(a=>a.value):[])].map(normalize);
    const amounts=values.flatMap(value=>[...value.matchAll(/\b(\d+)\s*(?:unidades?|uds?|huevos?)\b/g)].map(match=>Number(match[1])));
    if(amounts.length)return amounts.every(amount=>amount === 10);
    if(values.some(value=>/\d\s*(?:g|kg|ml|l)\b/.test(value)))return false;
    return item.avify.children.length === 0 && /^10\s*(?:unidades?|uds?|huevos?)$/.test(normalize(item.catalog.presentation));
  });
}
function measuredOfferGrams(item:CuratedItem,v:AvifyProduct|AvifyVariant):number|null {
  const values=[v.name ?? "",...("attributes" in v ? v.attributes.map(attribute=>attribute.value):[])];
  const hasOtherUnit=values.some(value=>/\d\s*(ml|l|litros?|cap(?:s(?:ulas?)?)?|unidades?|uds?)\b/.test(normalize(value)));
  // Conflicting mass/volume/unit metadata requires review, never a density assumption.
  if(hasOtherUnit)return null;
  const label=gramsInLabel(v.name ?? "");if(label !== null)return label;
  if("attributes" in v) for(const attribute of v.attributes) {const grams=gramsInLabel(attribute.value);if(grams !== null)return grams;}
  // A presentation embedded in an unrecognized name must not silently inherit a different catalog size.
  if(values.some(value=>/\d\s*(kg|k|g)\b/.test(normalize(value))))return null;
  return item.avify.children.length === 0 ? gramsInLabel(item.catalog.presentation) : null;
}
export function offerMassEstimate(item:CuratedItem,v:AvifyProduct|AvifyVariant) {
  return measuredOfferGrams(item,v) === null ? testiclePackEstimate(item,v):undefined;
}
export function offerGrams(item:CuratedItem,v:AvifyProduct|AvifyVariant):number|null {
  return measuredOfferGrams(item,v) ?? testiclePackEstimate(item,v)?.gramsPerPack ?? null;
}
export function weighedItem(item:CuratedItem) {
  return {...item,avify:{...item.avify,...(item.avify.children.length ? {children:item.avify.children.map(v => ({...v,name:offerGrams(item,v) === null ? "" : `${offerGrams(item,v)}g`}))} : {name:offerGrams(item,item.avify) === null ? "" : `${offerGrams(item,item.avify)}g`})}};
}
function line(item: CuratedItem, variant: Saleable, quantity: number, role: string, reason: string): QuoteLine {
  return { item, variant, quantity, role, reason, unitPrice: effectivePrice(variant)!, grams: gramsInLabel(variant.name ?? "") };
}
export function packRecipe(item: CuratedItem, target: number | null, allowedGrams?:readonly number[], objective:PurchaseObjective="cost"): QuoteLine[] {
  if (target !== null && (!Number.isFinite(target) || target <= 0)) return [];
  const choices = saleableOffers(item).filter(v => {
    const grams=gramsInLabel(v.name ?? "");
    return Number.isInteger(grams) && (!allowedGrams || allowedGrams.includes(grams!));
  });
  if (!choices.length) return [];
  if (target === null) {
    const best = choices.toSorted((a,b) => effectivePrice(a)! / gramsInLabel(a.name!)! - effectivePrice(b)! / gramsInLabel(b.name!)!)[0];
    return [line(item, best, 1, "Receta completa", "Una presentación para empezar; cantidad diaria por confirmar.")];
  }
  return optimizePacks(choices.map(offer=>({offer,amount:gramsInLabel(offer.name!)!})),target,objective)
    .map(({offer,quantity})=>line(item,offer,quantity,"Receta completa","Presentaciones combinadas para cubrir su ración estimada."));
}

/** Unit-independent purchasing: callers must supply amounts in ONE verified unit. */
export function optimizePacks(offers:{offer:Saleable;amount:number}[],target:number,objective:PurchaseObjective="cost") {
  if(!Number.isFinite(target) || target <= 0)return [];
  const measured=offers.filter(({amount})=>Number.isInteger(amount) && amount > 0);
  const choices=measured.map(({offer})=>offer);
  if(!choices.length)return [];
  const amounts=measured.map(({amount})=>amount);
  // Bounded knapsack: minimize cost covering the requested grams using actual saleable packs.
  const largest = Math.max(...amounts);
  const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
  const unit = amounts.reduce(gcd);
  const cap = Math.ceil((target + largest) / unit);
  type State = { cost: number; counts: number[]; packs: number; nonPreferredGrams: number };
  let states: (State | undefined)[] = Array(cap + 1);
  states[0] = { cost: 0, counts: choices.map(() => 0), packs: 0, nonPreferredGrams: 0 };
  choices.forEach((variant, index) => {
    const nextStates = [...states];
    const step = amounts[index] / unit;
    const limit = Math.min(inventory(variant).available ?? cap, Math.floor(cap / step));
    if (!Number.isInteger(step)) return;
    states.forEach((previous, amount) => {
      if (!previous) return;
      for (let quantity = 1; quantity <= limit && amount + quantity * step <= cap; quantity++) {
        const next = amount + quantity * step;
        const cost = previous.cost + quantity * effectivePrice(variant)!;
        const packs = previous.packs + quantity;
        const nonPreferredGrams = previous.nonPreferredGrams + (amounts[index] === smallMixPresentationGrams ? 0 : quantity * amounts[index]);
        const existing = nextStates[next];
        const better = !existing || (objective === "small-mix"
          ? nonPreferredGrams - existing.nonPreferredGrams || packs - existing.packs || cost - existing.cost
          : objective === "containers" ? packs - existing.packs || cost - existing.cost
          : cost - existing.cost || packs - existing.packs) < 0;
        if (better) {
          const counts = [...previous.counts]; counts[index] = quantity;
          nextStates[next] = { cost, counts, packs, nonPreferredGrams };
        }
      }
    });
    states = nextStates;
  });
  const candidates = states.map((s,i) => ({ s, grams: i * unit })).filter(c => c.s && c.grams >= target)
    .sort((a,b) => objective === "small-mix"
      ? a.s!.nonPreferredGrams-b.s!.nonPreferredGrams || a.s!.packs-b.s!.packs || a.s!.cost-b.s!.cost || a.grams-b.grams
      : objective === "containers"
      ? a.s!.packs-b.s!.packs || a.s!.cost-b.s!.cost || a.grams-b.grams
      : a.s!.cost-b.s!.cost || a.s!.packs-b.s!.packs || a.grams-b.grams);
  const best = candidates[0]?.s;
  return best ? choices.flatMap((offer,i) => best.counts[i] ? [{offer,quantity:best.counts[i],amount:amounts[i]}] : []) : [];
}

type OfferProblem={code:"INACTIVE_OFFER"|"MISSING_PRICE"|"UNKNOWN_AVAILABILITY"|"INSUFFICIENT_STOCK";message:string;catalogId:string;sku?:string};
export function offerProblems(item:CuratedItem):OfferProblem[] {
  return (item.avify.children.length ? item.avify.children:[item.avify]).flatMap<OfferProblem>(variant=>{
    const context={catalogId:item.catalog.id,...(variant.sku ? {sku:variant.sku}:{})};
    if([item.avify.status,variant.status].some(status=>status && status !== "active"))return [{...context,code:"INACTIVE_OFFER" as const,message:`${item.catalog.name}: la oferta está inactiva.`}];
    if(effectivePrice(variant) === null || effectivePrice(variant)! < 0)return [{...context,code:"MISSING_PRICE" as const,message:`${item.catalog.name}: precio pendiente de confirmar.`}];
    const stock=inventory(variant);
    if(stock.state === "unknown")return [{...context,code:"UNKNOWN_AVAILABILITY" as const,message:`${item.catalog.name}: existencias desconocidas para la ubicación consultada.`}];
    if(stock.state === "unavailable")return [{...context,code:"INSUFFICIENT_STOCK" as const,message:`${item.catalog.name}: no hay existencias disponibles.`}];
    return [];
  });
}
