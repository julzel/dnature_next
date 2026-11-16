import { effectivePrice, inventory } from "@/features/feeding/engine/catalog/avify/model";
import { catalogValue, normalize } from "@/features/feeding/engine/sandbox/catalog";
import { assessSnack, snackDecision } from "./snacks";
import { saleableOffers, offerGrams } from "./purchasing";
import type { Candidate, FlowLine, FlowProfile } from "./profile";
import { roundMoney } from "./pricing";
import { snackBudget, snackKitRoleLabel, snackKitRoles, snackProductPolicy, snackRows, snackSafetyNotes, type SnackRole } from "./snack-policy";
import type { QuotePeriod } from "../period";

export type SnackKitDetails={
  weightKg:number;days:QuotePeriod;monthlyBudget:number;budget:number;subtotal:number;remaining:number;excess:number;
  complete:boolean;withinBudget:boolean;note:string;
  items:{role:SnackRole;label:string;catalogId:string;sku:string;name:string;quantity:number;subtotal:number}[];
};
type Choice={candidate:Candidate;offer:ReturnType<typeof saleableOffers>[number];price:number;affinity:number};

export function buildSnackKit(candidates:Candidate[],profile:FlowProfile,days:QuotePeriod,selected?:string) {
  const weight=profile.weight!;
  const rows=snackRows(weight,days);
  const kitRoles=snackKitRoles(days);
  const budget=snackBudget(weight,days);
  const choices=Object.fromEntries(kitRoles.map(role=>[role,candidates.flatMap<Choice>(candidate=>{
    const c=candidate.item.catalog;
    if(!rows[role].includes(c.row) || !snackProductPolicy(c)?.valid)return [];
    return saleableOffers(candidate.item).filter(offer=>{
      if((inventory(offer).available ?? 1) < 1)return false;
      // The confirmed medium-dog kit uses a LARGE hairless ear, not an unidentified size.
      if(c.row === 85)return [offer.name ?? "",...("attributes" in offer ? offer.attributes.map(a=>a.value):[])].some(value=>/\bgrande\b/.test(normalize(value)));
      return true;
    }).map(offer=>({candidate,offer,price:effectivePrice(offer)!,affinity:Math.max(0,assessSnack(c,profile.behavior)?.priority ?? 0)}));
  })])) as Record<SnackRole,Choice[]>;
  const selectedCandidate=selected ? candidates.find(c=>c.item.catalog.id === selected):undefined;
  const selectedRoles=selectedCandidate ? kitRoles.filter(role=>rows[role].includes(selectedCandidate.item.catalog.row)):[];
  const invalidSelection=Boolean(selected && (!selectedRoles.length || !kitRoles.some(role=>choices[role].some(c=>c.candidate.item.catalog.id === selected))));

  type Cart={entries:{role:SnackRole;choice:Choice}[];subtotal:number;affinity:number;breed:number;key:string};
  const carts:Cart[]=[];
  function visit(index:number,entries:Cart["entries"]) {
    if(index === kitRoles.length) {
      if(selected && !entries.some(e=>e.choice.candidate.item.catalog.id === selected))return;
      carts.push({entries,subtotal:roundMoney(entries.reduce((s,e)=>s+e.choice.price,0)),affinity:entries.reduce((s,e)=>s+e.choice.affinity,0),breed:entries.filter(e=>e.choice.candidate.breedAffinity).length,key:entries.map(e=>`${e.role}:${e.choice.candidate.item.catalog.row}:${e.choice.offer.sku}`).join("|")});
      return;
    }
    const role=kitRoles[index];
    for(const choice of choices[role]) {
      if(entries.some(e=>e.choice.candidate.item.catalog.id === choice.candidate.item.catalog.id || e.choice.offer.sku === choice.offer.sku))continue;
      visit(index+1,[...entries,{role,choice}]);
    }
    visit(index+1,entries);
  }
  if(!invalidSelection)visit(0,[]);
  const best=carts.toSorted((a,b)=>b.entries.length-a.entries.length || Number(b.subtotal <= budget.limit)-Number(a.subtotal <= budget.limit) || (a.subtotal > budget.limit ? a.subtotal-b.subtotal : b.affinity-a.affinity || b.breed-a.breed || a.subtotal-b.subtotal) || a.key.localeCompare(b.key,"en"))[0];
  const entries=best?.entries ?? [];
  const subtotal=best?.subtotal ?? 0;
  const missing=kitRoles.filter(role=>!entries.some(e=>e.role === role)).map(role=>`Kit de snacks: falta ${snackKitRoleLabel(role,weight,days).toLowerCase()} compatible, distinto de los otros roles, con precio, stock y presentación identificada.`);
  if(invalidSelection)missing.push("Kit de snacks: la selección anterior no pertenece al kit por peso o dejó de estar disponible. Retírala o vuelve a seleccionarla; no se sustituye automáticamente.");
  if(subtotal > budget.limit) {
    const money=(value:number)=>new Intl.NumberFormat("es-CR",{style:"currency",currency:"CRC",maximumFractionDigits:2}).format(value);
    missing.push(`Kit de snacks: los ${kitRoles.length === 2 ? "dos":"tres"} productos superan el presupuesto del período antes de descuentos. Costo adicional: ${money(roundMoney(subtotal-budget.limit))} (costo del kit: ${money(subtotal)}; presupuesto: ${money(budget.limit)}). Requiere revisión; no se omite un producto ni se cobra el presupuesto como tarifa fija.`);
  }
  const lines:FlowLine[]=entries.map(({role,choice:{candidate,offer,price}})=>{
    const product=candidate.item.catalog;
    const assessment=assessSnack(product,profile.behavior) ?? {behavior:profile.behavior ?? "unknown",match:"general" as const,priority:0,reason:"Rol confirmado para el kit por peso.",evidence:[]};
    const decision=snackDecision(product,assessment,selected === product.id);
    const label=snackKitRoleLabel(role,weight,days);
    const reason=`Kit por peso (${weight} kg): ${label.toLowerCase()}. Un envase de compra; no es una dosis ni garantiza cobertura del período.`;
    return {item:candidate.item,variant:offer,quantity:1,unitPrice:price,grams:offerGrams(candidate.item,offer),component:"snack",role:`Snack · ${label}`,pending:candidate.pending,breedAffinity:candidate.breedAffinity,reason,snackDecision:{...decision,reason,fallback:false,kitRole:role,usageNotes:[...snackSafetyNotes(product),`Referencia del catálogo: ${catalogValue(product,13) || "cantidad pendiente"}. Frecuencia: ${product.frequency || "pendiente"}. Confirmar la porción y frecuencia de uso; no ofrecer todos los productos a la vez.`]}};
  });
  const note=`Kit inicial de snacks: un envase por rol y ${kitRoles.length === 2 ? "dos":"tres"} productos distintos. El presupuesto es un tope antes de descuentos, no una dosis ni un cargo fijo. La compra no acredita cobertura de ${days} días; cantidad y frecuencia de uso requieren confirmación. Los snacks no aumentan la ración calculada.`;
  const details:SnackKitDetails={weightKg:weight,days,monthlyBudget:budget.monthly,budget:budget.limit,subtotal,remaining:roundMoney(Math.max(0,budget.limit-subtotal)),excess:roundMoney(Math.max(0,subtotal-budget.limit)),complete:entries.length === kitRoles.length,withinBudget:subtotal <= budget.limit,note,items:entries.map(({role,choice})=>({role,label:snackKitRoleLabel(role,weight,days),catalogId:choice.candidate.item.catalog.id,sku:choice.offer.sku!,name:choice.candidate.item.catalog.name,quantity:1,subtotal:choice.price}))};
  return {lines,missing,details};
}
