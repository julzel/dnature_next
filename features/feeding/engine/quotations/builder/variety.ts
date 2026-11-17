import { prefersSmallMix, smallMixPresentationGrams, smallMixPresentationNote } from "./mix-presentation";
import { isCookedRecipe, type FeedingMode } from "./feeding-mode";
import { formulaKind } from "../formula";
import type { Candidate, FlowLine } from "./profile";
export const varietyLevels=["none","low","medium","high"] as const;
export type VarietyLevel=typeof varietyLevels[number];
export const varietyCounts:Record<VarietyLevel,number>={none:1,low:2,medium:3,high:4};
export const varietyLabels:Record<VarietyLevel,string>={none:"Sin rotación · 1 sabor",low:"Baja · 2 sabores",medium:"Media · 3 sabores",high:"Alta · 4 sabores"};
export const complementVarietyLabels:Record<VarietyLevel,string>={none:"Sin rotación · 1 complemento",low:"Baja · 2 complementos",medium:"Media · 3 complementos",high:"Alta · 4 complementos"};
export type FlavorAllocation={candidate:Candidate;days:number};
export type VarietyPriority=(candidate:Candidate,chosen:readonly FlavorAllocation[])=>number;
export type MixRotation={level:VarietyLevel;requestedFlavors:number;flavors:{catalogId:string;name:string;days:number;targetGrams:number;boughtGrams:number;cost:number}[];note:string;averagePricePerKg:number|null};
export type ComplementRotation={level:VarietyLevel;requestedProducts:number;products:MixRotation["flavors"];note:string};
// Baseline allocation. Mix rotations may move whole days while keeping every
// pair of flavor blocks within two days of each other.
export function flavorDays(days:number,count:number) {return Array.from({length:count},(_,index)=>Math.floor(days/count)+(index < days%count ? 1:0));}
function distributions(days:number,count:number) {
  const result:number[][]=[];
  const visit=(remaining:number,current:number[])=>{
    if(current.length === count-1) {
      if(remaining > 0) {
        const values=[...current,remaining];
        if(Math.max(...values)-Math.min(...values) <= 2)result.push(values);
      }
      return;
    }
    for(let value=1;value<remaining;value++)visit(remaining-value,[...current,value]);
  };
  visit(days,[]);return result;
}
function lineScore(lines:FlowLine[]) {
  const formats=new Set(lines.map(line=>line.grams ?? `sku:${line.variant.sku}`));
  return {nonPreferredGrams:lines.reduce((sum,line)=>sum+(line.grams === smallMixPresentationGrams ? 0:line.quantity*(line.grams ?? 0)),0),containers:lines.reduce((sum,line)=>sum+line.quantity,0),formats:formats.size,cost:lines.reduce((sum,line)=>sum+line.quantity*line.unitPrice,0),purchased:lines.reduce((sum,line)=>sum+line.quantity*(line.grams ?? 0),0)};
}
function comparePlans(a:{lines:FlowLine[];days:number[]},b:{lines:FlowLine[];days:number[]},dailyMixGrams?:number) {
  const x=lineScore(a.lines),y=lineScore(b.lines);
  return (prefersSmallMix(dailyMixGrams ?? Infinity) ? x.nonPreferredGrams-y.nonPreferredGrams:0) || x.containers-y.containers || x.formats-y.formats || x.cost-y.cost || x.purchased-y.purchased || a.days.reduce((result,value,index)=>result || b.days[index]-value,0);
}
export function optimizeFlavorDays(allocations:FlavorAllocation[],days:number,dailyGrams:number,linesFor:(candidate:Candidate,target:number)=>FlowLine[]) {
  if(allocations.length <= 1)return allocations;
  const plans=distributions(days,allocations.length).flatMap(values=>{
    const lineGroups=allocations.map(({candidate},index)=>linesFor(candidate,dailyGrams*values[index]));
    return lineGroups.every(lines=>lines.length) ? [{days:values,lines:lineGroups.flat()}]:[];
  }).toSorted((a,b)=>comparePlans(a,b,dailyGrams));
  const best=plans[0];
  return best ? allocations.map(({candidate},index)=>({candidate,days:best.days[index]})):allocations;
}
export function planVariety(candidates:Candidate[],preferredId:string|undefined,level:VarietyLevel,days:number,dailyGrams:number,linesFor:(candidate:Candidate,target:number)=>FlowLine[],component:"mix"|"complement"="mix",feedingMode:FeedingMode="standard",priorityFor?:VarietyPriority) {
  const baseLabel=feedingMode === "cooked_monoprotein" ? "monoproteicas cocinadas":"Complete";
  const requested=varietyCounts[level];
  const complete=component === "mix" ? candidates.filter(c=>feedingMode === "cooked_monoprotein" ? isCookedRecipe(c.item.catalog):formulaKind(c.item.catalog) === "complete"):candidates;
  const preferred=preferredId ? complete.find(c=>c.item.catalog.id === preferredId):undefined;
  if(preferredId && !preferred)return {allocations:[] as FlavorAllocation[],warning:null,error:component === "mix" ? `La rotación usa recetas ${baseLabel}. El sabor principal seleccionado no es elegible; elige otra receta o Sin rotación.`:"El complemento principal seleccionado no es elegible para la porción diaria. Vuelve a seleccionarlo."};
  for(let count=requested;count>=1;count--) {
    const allocations:FlavorAllocation[]=[];
    for(const [slot,dayCount] of flavorDays(days,count).entries()) {
      const unused=slot === 0 && preferred ? [preferred]:complete.filter(c=>!allocations.some(a=>a.candidate.item.catalog.id === c.item.catalog.id));
      const plans=unused.map(candidate=>({candidate,lines:linesFor(candidate,dailyGrams*dayCount)})).filter(p=>p.lines.length);
      plans.sort((a,b)=>Number(a.candidate.pending.length>0)-Number(b.candidate.pending.length>0) ||
        (priorityFor?.(a.candidate,allocations) ?? 0)-(priorityFor?.(b.candidate,allocations) ?? 0) ||
        Number(b.candidate.breedAffinity)-Number(a.candidate.breedAffinity) || (component === "mix" ? comparePlans({lines:a.lines,days:[dayCount]},{lines:b.lines,days:[dayCount]},dailyGrams):a.lines.reduce((s,l)=>s+l.quantity*l.unitPrice,0)-b.lines.reduce((s,l)=>s+l.quantity*l.unitPrice,0)));
      if(!plans.length)break;
      allocations.push({candidate:plans[0].candidate,days:dayCount});
    }
    if(allocations.length === count)return {allocations:component === "mix" ? optimizeFlavorDays(allocations,days,dailyGrams,linesFor):allocations,error:null,warning:count < requested ? component === "mix" ? `Variedad solicitada: ${requested} sabores. Solo ${count} ${count === 1 ? `sabor de ${baseLabel} puede`:`sabores de ${baseLabel} pueden`} cubrir la rotación con los filtros, presentaciones y stock actuales.`:`Variedad solicitada: ${requested} complementos. Solo ${count} pueden cubrir la rotación con la porción diaria, los filtros, presentaciones y stock actuales.`:null};
  }
  return {allocations:[] as FlavorAllocation[],warning:null,error:component === "complement" ? preferredId ? "El complemento principal seleccionado no tiene precio, presentación o stock suficiente para la rotación. Vuelve a seleccionarlo.":"No hay complementos con precio, presentación y stock suficientes para cubrir la rotación.":preferredId ? "El sabor principal seleccionado no tiene precio, presentación o stock suficiente para la rotación. Vuelve a seleccionarlo.":`No hay sabores de ${baseLabel} con precio, presentación y stock suficientes para cubrir la rotación.`};
}
export function rotationDetails(level:VarietyLevel,allocations:FlavorAllocation[],dailyGrams:number,lines:FlowLine[],component:"mix"|"complement"="mix"):MixRotation {
  const flavors=allocations.map(({candidate,days})=>{
    const bought=lines.filter(l=>l.component === component && l.item.catalog.id === candidate.item.catalog.id);
    return {catalogId:candidate.item.catalog.id,name:candidate.item.catalog.name,days,targetGrams:dailyGrams*days,boughtGrams:bought.reduce((s,l)=>s+l.quantity*(l.grams ?? 0),0),cost:bought.reduce((s,l)=>s+l.quantity*l.unitPrice,0)};
  });
  const boughtGrams=flavors.reduce((s,f)=>s+f.boughtGrams,0),cost=flavors.reduce((s,f)=>s+f.cost,0);
  return {level,requestedFlavors:varietyCounts[level],flavors,averagePricePerKg:boughtGrams ? cost/(boughtGrams/1000):null,note:flavors.length > 1 ? `Rotación de ${flavors.length} sabores en bloques de días consecutivos: ${flavors.map(f=>`${f.name} (${f.days} días)`).join("; ")}. Los días se mantienen equilibrados, con una diferencia máxima de dos. ${prefersSmallMix(dailyGrams) && component === "mix" ? smallMixPresentationNote:"Se ajustan para usar menos tarros y formatos antes de comparar el precio."} No se mezclan sabores dentro de una porción. La ración diaria se mantiene; los sobrantes no aumentan el consumo.`:flavors.length ? `Un sabor durante ${flavors[0].days} días: ${flavors[0].name}.${prefersSmallMix(dailyGrams) && component === "mix" ? ` ${smallMixPresentationNote}`:""}`:"Rotación pendiente: no se encontró una base válida."};
}
export function complementRotationDetails(level:VarietyLevel,allocations:FlavorAllocation[],dailyGrams:number,lines:FlowLine[]):ComplementRotation {
  const {flavors:products}=rotationDetails(level,allocations,dailyGrams,lines,"complement");
  return {level,requestedProducts:varietyCounts[level],products,note:dailyGrams === 0 ? "Sin complementos de fórmula en este paquete.":products.length ? `Complementos en días alternos: ${products.map(p=>`${p.name} (${p.days} días)`).join("; ")}. Un complemento por día, ${dailyGrams} g en total; la variedad no aumenta el 20% permitido ni la ración diaria.`:"Rotación de complementos pendiente: no se encontró una opción válida."};
}
