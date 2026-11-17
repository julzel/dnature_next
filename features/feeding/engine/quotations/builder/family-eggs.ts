import type { DoseAssessment } from "./dosing";
import type { FlowLine } from "./profile";
import type { PetResult } from "./model";
import { planEggs, eggPeriodNote, eggsPerBox, eggStorageWeeks } from "./egg-policy";
import { packagePrice } from "./pricing";

export type EggAllocation={familyId:string;petId:string;petName:string;weightKg:number|null;subtotal:number;dose:DoseAssessment;message:string};
export type FamilyEggPurchase={id:string;name:string;line:FlowLine;requiredUnits:number;purchasedUnits:number;leftoverUnits:number;weeklyUnits:number;budgetWeeks:2|4;storageWeeks:number;subtotal:number;allocations:EggAllocation[];message:string};

export function familyEggForAllocation(purchases:FamilyEggPurchase[],allocation?:EggAllocation) {
  return allocation ? purchases.find(purchase=>purchase.id === allocation.familyId) : undefined;
}

/** Only selected packages participate. Real boxes live here; per-pet costs are allocations, not fractional boxes. */
export function allocateFamilyEggs(pets:PetResult[]):{pets:PetResult[];familyEggs:FamilyEggPurchase[]} {
  const groups=new Map<string,{pet:PetResult;line:FlowLine}[]>();
  for(const pet of pets) {
    const pack=pet.result?.packages.find(pack=>pack.id === pet.choice);
    const line=pack?.lines.find(line=>line.component === "egg" && line.dose?.status === "calculated" && line.dose.egg);
    if(!line)continue;
    // Distinct products/SKUs are never pooled, including explicit product choices.
    const key=JSON.stringify([line.item.catalog.id,line.variant.sku,line.unitPrice]);
    groups.set(key,[...(groups.get(key) ?? []),{pet,line}]);
  }
  const familyEggs:FamilyEggPurchase[]=[];
  for(const [id,unsorted] of groups) {
    const members=unsorted.toSorted((a,b)=>a.pet.id.localeCompare(b.pet.id));
    const weeks=members[0].line.dose!.egg!.budgetWeeks;
    const plan=planEggs(members.map(({line})=>line.dose!.egg!.weeklyOptions),weeks);
    if(!plan)continue;
    const base=members[0].line;
    const cents=Math.round(plan.boxes*base.unitPrice*100);
    const shares=members.map((member,index)=>{
      const required=plan.weekly[index]*weeks;
      const numerator=cents*required;
      return {member,index,required,cents:Math.floor(numerator/plan.requiredUnits),remainder:numerator%plan.requiredUnits};
    });
    let remainder=cents-shares.reduce((sum,share)=>sum+share.cents,0);
    for(const share of shares.toSorted((a,b)=>b.remainder-a.remainder || a.index-b.index))if(remainder-- > 0)share.cents++;
    const allocations=shares.map(({member,index,required,cents:shareCents}):EggAllocation=>{
      const weeklyUnits=plan.weekly[index];
      const message=`${weeklyUnits} huevos por semana; ${required} huevos para ${weeks} semanas. ${eggPeriodNote(weeks,base.dose!.periodDays)} Almacenamiento máximo recomendado: ${eggStorageWeeks} semanas. Cajas compartidas con la familia; los sobrantes no aumentan la cantidad semanal.`;
      const standaloneBoxes=Math.ceil(required/eggsPerBox);
      const dose={...member.line.dose!,egg:{...member.line.dose!.egg!,weeklyUnits,requiredUnits:required,standaloneBoxes,standaloneLeftoverUnits:standaloneBoxes*eggsPerBox-required},message};
      return {familyId:id,petId:member.pet.id,petName:member.pet.name,weightKg:member.pet.profile?.weight ?? null,subtotal:shareCents/100,dose,message};
    });
    const message=`${plan.boxes} cajas de ${eggsPerBox} huevos para la familia: ${plan.requiredUnits} presupuestados y ${plan.leftoverUnits} sobrantes. ${eggPeriodNote(weeks,base.dose!.periodDays)} Almacenamiento máximo recomendado: ${eggStorageWeeks} semanas. Importe distribuido en los paquetes según los huevos presupuestados para cada mascota.`;
    familyEggs.push({id,name:base.item.catalog.name,line:{...base,quantity:plan.boxes,dose:undefined,reason:message},requiredUnits:plan.requiredUnits,purchasedUnits:plan.purchasedUnits,leftoverUnits:plan.leftoverUnits,weeklyUnits:plan.weeklyTotal,budgetWeeks:weeks,storageWeeks:eggStorageWeeks,subtotal:cents/100,allocations,message});
  }
  return {familyEggs,pets:pets.map(pet=>{
    const allocation=familyEggs.flatMap(group=>group.allocations).find(allocation=>allocation.petId === pet.id);
    if(!allocation || !pet.result)return pet;
    return {...pet,result:{...pet.result,packages:pet.result.packages.map(pack=>{
      // Egg product/dose is constant across all four tiers; keep their comparison coherent.
      const lines=pack.lines.filter(line=>line.component !== "egg");
      const subtotal=Math.round((lines.reduce((sum,line)=>sum+line.quantity*line.unitPrice,0)+allocation.subtotal)*100)/100;
      return {...pack,lines,eggAllocation:allocation,...packagePrice(subtotal)};
    })}};
  })};
}
