import type { PetResult, QuoteSummary } from "./model";
import { issue, type QuoteIssue } from "./issues";
import { stockIssuesFor } from "./stock";
import type { FamilyEggPurchase } from "./family-eggs";
import { roundMoney } from "./pricing";
import { allocateOrderDiscount, priceOrder, type CustomerDiscountOptions } from "./discounts";
import { quotedWeights, sumQuotedWeights } from "./weights";
import type { FamilyMixPurchase } from "./family-mixes";
import type { FamilyProductPurchase } from "./family-products";
export function aggregateQuote(pets:PetResult[],catalogState:"ready"|"loading"|"error",familyEggs:FamilyEggPurchase[]=[],options:CustomerDiscountOptions={firstPurchase:false},familyMixes:FamilyMixPurchase[]=[],familyProducts:FamilyProductPurchase[]=[]):QuoteSummary {
  const selections=pets.flatMap(entry=>{const pack=entry.result?.packages.find(p=>p.id === entry.choice);return pack ? [{entry,pack,extras:entry.extraResult,subtotal:roundMoney(pack.subtotal+entry.extraResult.subtotal)}]:[];});
  const pricing=priceOrder(roundMoney(selections.reduce((sum,s)=>sum+s.subtotal,0)),options);
  const shares=allocateOrderDiscount(pricing.discount,selections.map(s=>({id:s.entry.id,subtotal:s.subtotal})));
  const selected=selections.map((s,index)=>{const weights=quotedWeights(s.pack.lines,s.extras.lines);weights.mix.grams+=(s.pack.mixAllocations ?? []).reduce((sum,a)=>sum+a.purchasedGrams,0);
    for(const allocation of s.pack.productAllocations ?? [])if(allocation.line.component === "complement"){
      const group=familyProducts.find(group=>group.id===allocation.familyId);if(group)weights.complement.grams+=group.purchased*allocation.required/group.required;
    }
    return {...s,weights,discount:shares[index],total:roundMoney(s.subtotal-shares[index])};});
  const issues:QuoteIssue[]=pets.flatMap(p=>p.issues);
  for(const entry of pets) {
    if(entry.status !== "draft" && !entry.result?.referral && !selected.some(s=>s.entry.id === entry.id))issues.push(issue("PACKAGE_REQUIRED","PKG-001","Elegir un paquete.",{petId:entry.id}));
  }
  for(const s of selected)issues.push(...s.pack.issues,...s.extras.issues);
  const stock=stockIssuesFor([...selected.flatMap(s=>[...s.pack.lines,...s.extras.lines]),...familyEggs.map(group=>group.line),...familyMixes.flatMap(group=>group.lines),...familyProducts.flatMap(group=>group.lines)]);issues.push(...stock);
  if(catalogState !== "ready")issues.push(issue("CATALOG_NOT_READY","BUY-002",catalogState === "loading" ? "Actualizar el catálogo y el stock antes de compartir la cotización.":"No se pudo actualizar el catálogo y el stock. El total conservado es una estimación interna."));
  const blocking=issues.filter(i=>i.severity === "blocking");
  const warnings=[...new Set([...pets.flatMap(p=>p.issues.filter(i=>i.severity === "warning").map(i=>`${p.name}: ${i.message}`)),...selected.flatMap(s=>[...s.pack.issues,...s.extras.issues].filter(i=>i.severity === "warning").map(i=>`${s.entry.name}: ${i.message}`))])];
  const pending=[...new Set(blocking.map(i=>{const pet=pets.find(p=>p.id === i.petId);return pet ? `${pet.name}: ${i.message}`:i.message;}))];
  const ready=selected.length === pets.length && pets.length > 0 && !blocking.length && catalogState === "ready";
  const review=blocking.some(i=>!["PROFILE_REQUIRED","PACKAGE_REQUIRED","CATALOG_NOT_READY"].includes(i.code)) || catalogState === "error";
  return {selected,familyEggs,familyMixes,familyProducts,weights:sumQuotedWeights(selected.map(s=>s.weights)),issues,pending,warnings,stockIssues:stock.map(i=>i.message),ready,status:ready ? "ready":review ? "review":"draft",...pricing};
}
