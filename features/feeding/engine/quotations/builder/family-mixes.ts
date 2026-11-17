import type { PetResult, PackageResult } from "./model";
import type { MixDemand, MixStoragePlan } from "./mix-storage";
import { planMixStorage } from "./mix-storage";
import { issue } from "./issues";
import { packagePrice } from "./pricing";

export type MixAllocation = { familyId:string; petId:string; petName:string; name:string; requiredGrams:number; purchasedGrams:number; subtotal:number };
export type FamilyMixPurchase = MixStoragePlan & { allocations:MixAllocation[] };

export function familyMixForAllocation(purchases:FamilyMixPurchase[],allocation:MixAllocation) {
  return purchases.find(purchase=>purchase.catalogId === allocation.familyId);
}

/** Split the pet's allocated family cost across the physical purchase rows without fractional packages. */
export function allocatedMixLineSubtotals(purchase:FamilyMixPurchase,subtotal:number) {
  const target=Math.round(subtotal*100);
  const total=Math.round(purchase.lines.reduce((sum,line)=>sum+line.quantity*line.unitPrice,0)*100);
  if(!total)return purchase.lines.map(()=>0);
  const raw=purchase.lines.map(line=>target*Math.round(line.quantity*line.unitPrice*100)/total);
  const cents=raw.map(Math.floor);let remaining=target-cents.reduce((sum,value)=>sum+value,0);
  for(const index of raw.map((_,index)=>index).sort((a,b)=>(raw[b]-cents[b])-(raw[a]-cents[a]) || a-b))if(remaining-- > 0)cents[index]++;
  return cents.map(value=>value/100);
}

function demand(pet:PetResult,pack:PackageResult,catalogId:string,days:number):MixDemand {
  let offset=0;
  const gramsByDay=Array<number>(days).fill(0);
  for(const flavor of pack.mixRotation.flavors) {
    if(flavor.catalogId === catalogId)for(let i=offset;i<Math.min(days,offset+flavor.days);i++)gramsByDay[i]=pack.mixDailyGrams;
    offset+=flavor.days;
  }
  return {petId:pet.id,petName:pet.name,gramsByDay};
}

function finish(pack:PackageResult):PackageResult {
  const subtotal=pack.lines.reduce((sum,line)=>sum+line.quantity*line.unitPrice,0)+(pack.eggAllocation?.subtotal ?? 0)+(pack.mixAllocations ?? []).reduce((s,a)=>s+a.subtotal,0);
  const flavors=pack.mixRotation.flavors.map(flavor=>{
    const allocation=pack.mixAllocations?.find(a=>a.familyId === flavor.catalogId);
    const plan=pack.mixStorage?.find(p=>p.catalogId === flavor.catalogId && !p.error);
    return {...flavor,boughtGrams:allocation?.purchasedGrams ?? plan?.purchasedGrams ?? flavor.boughtGrams,cost:allocation?.subtotal ?? plan?.subtotal ?? flavor.cost};
  });
  const mass=flavors.reduce((sum,f)=>sum+f.boughtGrams,0),cost=flavors.reduce((sum,f)=>sum+f.cost,0);
  return {...pack,...packagePrice(Math.round(subtotal*100)/100),mixRotation:{...pack.mixRotation,flavors,averagePricePerKg:mass ? cost/(mass/1000):null},
    pending:pack.issues.filter(i=>i.severity === "blocking" && !["MISSING_COMPONENT","INSUFFICIENT_STOCK"].includes(i.code)).map(i=>i.message),
    warnings:pack.issues.filter(i=>i.severity === "warning").map(i=>i.message),ready:!pack.issues.some(i=>i.severity === "blocking")};
}

function replacePlan(pet:PetResult,pack:PackageResult,plan:MixStoragePlan,allocation?:MixAllocation):PackageResult {
  const id=plan.catalogId;
  const previous=pack.lines.filter(l=>l.component === "mix" && l.item.catalog.id === id);
  const issues=pack.issues.filter(i=>!(i.catalogId === id && ["MIX_STORAGE_REQUIRED","MIX_REMAINDER"].includes(i.code)));
  const context={petId:pet.id,packageId:pack.id,catalogId:id};
  if(plan.error)issues.push(issue("MIX_STORAGE_REQUIRED","BUY-010",plan.error,context));
  else if(plan.remainingGrams > 0)issues.push(issue("MIX_REMAINDER","BUY-010",`${plan.name}: ${plan.remainingGrams} g comprados quedan sin asignar al cerrar envases o cambiar de sabor. No aumentan la ración ni prolongan el plazo de 72 horas; no se cuentan como alimento servido.`,{...context,severity:"warning"}));
  const lines=pack.lines.filter(l=>l.component !== "mix" || l.item.catalog.id !== id);
  if(plan.error)lines.push(...previous);
  else if(!allocation)lines.push(...plan.lines.map(line=>({...line,pending:previous[0]?.pending ?? [],breedAffinity:previous[0]?.breedAffinity ?? false})));
  return finish({...pack,lines,issues,mixStorage:[...(pack.mixStorage ?? []).filter(p=>p.catalogId !== id),plan],
    mixAllocations:[...(pack.mixAllocations ?? []).filter(a=>a.familyId !== id),...(allocation ? [allocation]:[])]});
}

/** All alternatives get independent conservation checks. Only chosen packages
 * share real purchases; costs and purchased mass are allocated without turning
 * fractional shares into stock quantities. Manual extras are never food demand.
 */
export function allocateFamilyMixes(input:PetResult[],days:number):{pets:PetResult[];familyMixes:FamilyMixPurchase[]} {
  const cache=new Map<string,MixStoragePlan>();
  const pets=input.map(pet=>!pet.result ? pet : {...pet,result:{...pet.result,packages:pet.result.packages.map(original=>{
    let pack=original;
    for(const flavor of pack.mixRotation.flavors) {
      const candidate=pet.result!.candidates.mix.find(c=>c.item.catalog.id === flavor.catalogId);
      if(!candidate)continue; // A policy exclusion or explicit invalid choice is never bypassed.
      const needs=demand(pet,pack,flavor.catalogId,days);
      const key=JSON.stringify([flavor.catalogId,needs]);
      const plan=cache.get(key) ?? planMixStorage(candidate.item,[needs]);cache.set(key,plan);
      pack=replacePlan(pet,pack,plan);
    }
    return pack;
  })}});
  const reserved=new Map<string,number>();
  for(const pet of pets)if(pet.choice)for(const line of pet.extraResult.lines)reserved.set(line.variant.sku!, (reserved.get(line.variant.sku!) ?? 0)+line.quantity);
  const groups=new Map<string,{pet:PetResult;pack:PackageResult;demand:MixDemand}[]>();
  for(const pet of pets) {
    const pack=pet.result?.packages.find(p=>p.id === pet.choice);if(!pack)continue;
    for(const flavor of pack.mixRotation.flavors) {
      if(!pet.result!.candidates.mix.some(c=>c.item.catalog.id === flavor.catalogId))continue;
      groups.set(flavor.catalogId,[...(groups.get(flavor.catalogId) ?? []),{pet,pack,demand:demand(pet,pack,flavor.catalogId,days)}]);
    }
  }
  const familyMixes:FamilyMixPurchase[]=[];
  for(const [id,unsorted] of groups) {
    const members=unsorted.toSorted((a,b)=>a.pet.id.localeCompare(b.pet.id));
    const item=members[0].pet.result!.candidates.mix.find(c=>c.item.catalog.id === id)!.item;
    const plan=planMixStorage(item,members.map(m=>m.demand),reserved);
    if(members.length === 1 || plan.error) {
      for(const member of members) {
        // A failed joint plan does not erase independent valid estimates.
        const replacement=members.length === 1 ? plan : {...member.pack.mixStorage!.find(p=>p.catalogId === id)!,error:plan.error};
        const current=member.pet.result!.packages.find(p=>p.id === member.pack.id)!;
        member.pet.result!.packages=member.pet.result!.packages.map(p=>p.id === current.id ? replacePlan(member.pet,current,replacement):p);
      }
      continue;
    }
    const shares=(total:number)=>{
      const raw=members.map(m=>total*m.demand.gramsByDay.reduce((s,g)=>s+g,0)/plan.requiredGrams);
      const result=raw.map(Math.floor);let rest=total-result.reduce((s,v)=>s+v,0);
      for(const i of raw.map((_,i)=>i).sort((a,b)=>(raw[b]-result[b])-(raw[a]-result[a]) || a-b))if(rest-- > 0)result[i]++;
      return result;
    };
    const costs=shares(Math.round(plan.subtotal*100)),weights=shares(plan.purchasedGrams);
    const allocations=members.map((m,i):MixAllocation=>({familyId:id,petId:m.pet.id,petName:m.pet.name,name:plan.name,requiredGrams:m.demand.gramsByDay.reduce((s,g)=>s+g,0),purchasedGrams:weights[i],subtotal:costs[i]/100}));
    familyMixes.push({...plan,allocations});
    for(const [i,member] of members.entries())member.pet.result!.packages=member.pet.result!.packages.map(p=>p.id === member.pack.id ? replacePlan(member.pet,p,plan,allocations[i]):p);
  }
  return {pets,familyMixes};
}
