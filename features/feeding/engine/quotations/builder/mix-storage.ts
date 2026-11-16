import { prefersSmallMix, smallMixPresentationGrams } from "./mix-presentation";
import { isCookedRecipe } from "./feeding-mode";
import { effectivePrice, inventory } from "@/features/feeding/engine/catalog/avify/model";
import { formulaKind } from "../formula";
import type { CuratedItem } from "../nutrition";
import { offerGrams, saleableOffers } from "./purchasing";
import { completePresentationGrams } from "./ration";
import type { FlowLine } from "./profile";

export const mixStoragePolicy = { thawHours: [24, 36], refrigeratedHours: 72, maxServingDays: 3 } as const;
export const mixStorageNote = "Todas las mezclas: descongelar con 24–36 horas de anticipación. Desde el primer uso, mantener refrigerado y consumir dentro de 72 horas, con hasta tres repartos en total por envase, uno por día. El cambio de recipiente no reinicia ese plazo.";
export type MixDemand = { petId: string; petName: string; gramsByDay: number[] };
export type MixWithdrawal = { day: number; grams: number; pets: { petId: string; petName: string; grams: number }[] };
export type MixContainer = { sku: string; grams: number; firstDay: number; lastDay: number; withdrawals: MixWithdrawal[]; remainingGrams: number };
export type MixStoragePlan = {
  catalogId: string; name: string; demands: MixDemand[]; containers: MixContainer[];
  requiredGrams: number; purchasedGrams: number; remainingGrams: number; subtotal: number;
  lines: FlowLine[]; error: string | null;
};
const precise = (n: number) => Math.round(n * 1e6) / 1e6;
const epsilon = 1e-6;

/** A dated, FIFO plan. A new container may start halfway through a day's ration.
 * Never model an unused day as stopping the refrigeration clock. Leftovers at
 * the third day or block end are unserved purchases, not an extension of the diet.
 */
function isSmallDemand(demand: MixDemand) {
  const servingDays=demand.gramsByDay.filter(grams=>grams > 0);
  return servingDays.length > 0 && servingDays.every(prefersSmallMix);
}

/** Keep the preference per pet when a household contains small and large portions.
 * Reuse one purchase record, with real containers and each cohort's withdrawals.
 * If independent calendars cannot cover demand, the shared planner still checks
 * whether pooling the same recipe can make a valid purchase possible. */
export function planMixStorage(item: CuratedItem, demands: MixDemand[], reserved:ReadonlyMap<string,number>=new Map()): MixStoragePlan {
  const small=demands.filter(isSmallDemand),large=demands.filter(demand=>!isSmallDemand(demand));
  if(small.length && large.length) {
    const smallPlan=planPooledMixStorage(item,small,reserved);
    if(!smallPlan.error) {
      const remaining=new Map(reserved);
      for(const line of smallPlan.lines)remaining.set(line.variant.sku!, (remaining.get(line.variant.sku!) ?? 0)+line.quantity);
      const largePlan=planPooledMixStorage(item,large,remaining);
      if(!largePlan.error) {
        const lines:FlowLine[]=[];
        for(const line of [...smallPlan.lines,...largePlan.lines]) {
          const previous=lines.find(entry=>entry.variant.sku === line.variant.sku);
          if(previous)previous.quantity+=line.quantity;else lines.push({...line});
        }
        return {...smallPlan,demands,lines,containers:[...smallPlan.containers,...largePlan.containers].toSorted((a,b)=>a.firstDay-b.firstDay || a.sku.localeCompare(b.sku)),
          requiredGrams:precise(smallPlan.requiredGrams+largePlan.requiredGrams),purchasedGrams:smallPlan.purchasedGrams+largePlan.purchasedGrams,
          remainingGrams:precise(smallPlan.remainingGrams+largePlan.remainingGrams),subtotal:Math.round((smallPlan.subtotal+largePlan.subtotal)*100)/100};
      }
    }
  }
  return planPooledMixStorage(item,demands,reserved);
}

function planPooledMixStorage(item: CuratedItem, demands: MixDemand[], reserved:ReadonlyMap<string,number>): MixStoragePlan {
  const preferSmall=demands.length > 0 && demands.every(isSmallDemand);
  const days = Math.max(0, ...demands.map(d => d.gramsByDay.length));
  const daily = Array.from({ length: days }, (_, day) => precise(demands.reduce((s, d) => s + (d.gramsByDay[day] ?? 0), 0)));
  const prefix = [0]; daily.forEach(g => prefix.push(precise(prefix.at(-1)! + g)));
  const target = prefix.at(-1)!;
  const empty: MixStoragePlan = { catalogId: item.catalog.id, name: item.catalog.name, demands, containers: [], requiredGrams: target, purchasedGrams: 0, remainingGrams: 0, subtotal: 0, lines: [], error: null };
  const fail = (detail: string): MixStoragePlan => ({ ...empty, error: `${item.catalog.name}: ${detail} Revisar presentación o receta; no aumentar la ración.` });
  if (!target || daily.some(g => !Number.isFinite(g) || g < 0)) return fail("no se pudo verificar el calendario de consumo.");
  const offers = saleableOffers(item).flatMap(offer => {
    const amount = offerGrams(item, offer);
    return amount !== null && Number.isInteger(amount) && amount > 0 &&
      (formulaKind(item.catalog) !== "complete" || completePresentationGrams.some(grams=>grams === amount))
      ? [{ offer, amount, price: effectivePrice(offer)! * 100, available: inventory(offer).available === null ? null : Math.max(0,inventory(offer).available!-(reserved.get(offer.sku!) ?? 0)) }] : [];
  }).sort((a,b) => a.amount-b.amount || a.price-b.price || a.offer.sku!.localeCompare(b.offer.sku!));
  if (!offers.length) return fail("sin presentación verificable con precio y disponibilidad.");
  const dayAt = (position: number) => daily.findIndex((grams, day) => grams > 0 && prefix[day+1] > position+epsilon);
  // A partial first day can leave a small remainder at the deadline. It is
  // counted as purchased but unserved, never carried to a fourth serving day.
  // Do not recommend a pack larger than three full daily portions in the first
  // place, even if it is unusually cheap.
  const usable = (position: number, amount: number) => {
    const first=dayAt(position);
    if(first < 0 || amount > daily[first]*3+epsilon)return 0;
    return precise(Math.min(amount,prefix[Math.min(days,first+3)]-position));
  };
  // A discarded remainder can require another pack. At most one such deadline
  // can end on a given day; target/size alone is not a safe inventory bound.
  const bounded = offers.map(o => o.available !== null && o.available < Math.ceil(target/o.amount)+days);
  type State = { position: number; purchased: number; cents: number; counts: number[]; packs: number; nonPreferredGrams: number; order: number[] };
  const states = new Map<number, Map<string,State>>([[0,new Map([["",{ position:0,purchased:0,cents:0,counts:offers.map(()=>0),packs:0,nonPreferredGrams:0,order:[] }]])]]);
  let best: State | undefined; let visited = 0;
  const formats=(state:State)=>state.counts.filter(Boolean).length;
  const compare = (a: State, b: State) => (preferSmall ? a.nonPreferredGrams-b.nonPreferredGrams:0) ||
    a.packs-b.packs || formats(a)-formats(b) || a.cents-b.cents || a.purchased-b.purchased;
  const better = (a: State, b: State) => compare(a,b) < 0;
  const pending=[0];const queued=new Set([0]);
  const enqueue=(position:number)=>{
    if(queued.has(position))return;queued.add(position);
    let low=0,high=pending.length;
    while(low<high){const mid=(low+high)>>>1;if(pending[mid]<position)low=mid+1;else high=mid;}
    pending.splice(low,0,position);
  };
  while(pending.length) {
    const position=pending.shift()!;
    const bucket=states.get(position); if(!bucket)continue;
    for(const state of bucket.values()) {
      if(++visited > 150000)return fail("el plan necesita una revisión de envases por su complejidad.");
      for(const [index, choice] of offers.entries()) {
        if(choice.available !== null && state.counts[index] >= choice.available)continue;
        const served=usable(position,choice.amount);if(served <= epsilon)continue;
        const counts=[...state.counts];counts[index]++;
        const next:State={position:precise(position+served),purchased:state.purchased+choice.amount,cents:state.cents+choice.price,counts,packs:state.packs+1,nonPreferredGrams:precise(state.nonPreferredGrams+(choice.amount === smallMixPresentationGrams ? 0:served)),order:[...state.order,index]};
        if(next.position+epsilon >= target) { if(!best || better(next,best))best=next; continue; }
        if(best && (preferSmall ? next.nonPreferredGrams > best.nonPreferredGrams+epsilon ||
          (Math.abs(next.nonPreferredGrams-best.nonPreferredGrams) <= epsilon && next.packs >= best.packs) : next.packs >= best.packs))continue;
        const key=counts.filter((_,i)=>bounded[i]).join(",");
        const nextBucket=states.get(next.position) ?? new Map<string,State>();
        const previous=nextBucket.get(key);
        if(!previous || better(next,previous))nextBucket.set(key,next);
        states.set(next.position,nextBucket);enqueue(next.position);
      }
    }
    states.delete(position);
  }
  if(!best)return fail("ninguna combinación disponible permite repartir cada envase en un máximo de tres días consecutivos.");
  let position=0;
  const containers=best.order.map(index => {
    const {offer,amount}=offers[index]; const start=position; const end=precise(start+usable(start,amount));
    const withdrawals:MixWithdrawal[]=[];
    for(let day=dayAt(start);day < days && prefix[day] < end-epsilon;day++) {
      const grams=precise(Math.max(0,Math.min(end,prefix[day+1])-Math.max(start,prefix[day])));
      if(!grams)continue;
      // Allocate each day's withdrawal to each pet proportionally; the final
      // member receives the numeric remainder so sums stay exact.
      const members=demands.filter(d=>(d.gramsByDay[day] ?? 0)>0);let allocated=0;
      const pets=members.map((d,i)=>{const share=i === members.length-1 ? precise(grams-allocated):precise(grams*d.gramsByDay[day]/daily[day]);allocated+=share;return {petId:d.petId,petName:d.petName,grams:share};});
      withdrawals.push({day:day+1,grams,pets});
    }
    position=end;
    return {sku:offer.sku!,grams:amount,firstDay:withdrawals[0].day,lastDay:withdrawals.at(-1)!.day,withdrawals,remainingGrams:precise(amount-(end-start))};
  });
  const lines=offers.flatMap(({offer,amount},index):FlowLine[] => best!.counts[index] ? [{item,variant:offer,quantity:best!.counts[index],unitPrice:effectivePrice(offer)!,grams:amount,component:"mix",role:isCookedRecipe(item.catalog) ? "Base cocinada":"Mezcla completa",reason:"Envases con calendario de uso de hasta tres días por envase.",pending:[],breedAffinity:false}]:[]);
  return {...empty,containers,lines,purchasedGrams:best.purchased,remainingGrams:precise(best.purchased-target),subtotal:Math.round(best.cents)/100};
}
