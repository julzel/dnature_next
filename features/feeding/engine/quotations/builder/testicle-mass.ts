import { normalize } from "@/features/feeding/engine/sandbox/catalog";
import type { AvifyProduct, AvifyVariant } from "@/features/feeding/engine/catalog/avify/model";
import type { CuratedItem } from "../nutrition";

export type MassEstimate={gramsPerPack:number;note:string};

/** Sales-approved estimate for the two-unit bag only. Explicit measurements
 * take precedence in purchasing; other counts or units do not inherit 400 g. */
export function testiclePackEstimate(item:CuratedItem,offer:AvifyProduct|AvifyVariant):MassEstimate|undefined {
  if(item.catalog.row !== 122 || normalize(item.catalog.name) !== "testiculos" || !/^2\s*unidades$/.test(normalize(item.catalog.presentation)))return undefined;
  const labels=[offer.name ?? "",...("attributes" in offer ? offer.attributes.map(a=>a.value):[])].map(normalize);
  if(labels.some(label=>/\d\s*(?:kg|k|g|ml|l|litros?|cap(?:s(?:ulas?)?)?)\b/.test(label)))return undefined;
  const counts=labels.flatMap(label=>[...label.matchAll(/\b(\d+(?:[.,]\d+)?)\s*(?:unidades?|uds?)\b/g)].map(match=>Number(match[1].replace(",","."))));
  if(!counts.length && labels.some(label=>/\d/.test(label)))return undefined;
  if(counts.length ? counts.some(count=>count !== 2):item.avify.children.length > 0)return undefined;
  return {gramsPerPack:400,note:"Peso estimado: aproximadamente 400 g por bolsa de 2 unidades. El peso real varía; verificar al preparar el pedido."};
}
