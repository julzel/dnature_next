import { inventory } from "@/features/feeding/engine/catalog/avify/model";
import type { QuoteLine } from "./purchasing";
import { issue } from "./issues";
export function stockIssuesFor(lines:QuoteLine[],petId?:string,packageId?:string) {
  const totals=new Map<string,{quantity:number;available:number|null;name:string}>();
  for(const line of lines) {
    const sku=line.variant.sku!;const previous=totals.get(sku);const available=inventory(line.variant).available;
    totals.set(sku,{quantity:(previous?.quantity ?? 0)+line.quantity,available:previous?.available !== undefined && previous.available !== null && available !== null ? Math.min(previous.available,available):available,name:line.item.catalog.name});
  }
  return [...totals].filter(([,v])=>v.available !== null && v.quantity > v.available).map(([sku,v])=>issue("INSUFFICIENT_STOCK","BUY-005",`${v.name}: la cantidad conjunta supera el stock disponible.`,{sku,petId,packageId}));
}
