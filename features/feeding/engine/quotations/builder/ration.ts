import type { FeedingMode } from "./feeding-mode";
export const completePresentationGrams = [200,500,1000] as const;
/** Round the total daily serving before choosing its mix/complement split. */
export function roundDailyRation(grams:number):number {
  if(!Number.isFinite(grams) || grams <= 0)throw new Error("La ración diaria debe ser positiva.");
  if(grams < 200)return Math.round(grams);
  if(grams <= 500) {
    const rounded=Math.round(grams);
    const base=Math.floor(rounded/100)*100;
    const targets=[base,base+20,base+50,base+80,base+100].filter(value=>value >= 200 && value <= 500);
    const nearest=targets.toSorted((a,b)=>Math.abs(a-rounded)-Math.abs(b-rounded) || Number(b%50 === 0)-Number(a%50 === 0) || a-b)[0];
    return nearest !== undefined && Math.abs(nearest-rounded) <= 10 ? nearest:rounded;
  }
  const step=grams <= 1000 ? 50:100;
  const lower=Math.floor(grams/step)*step;
  return grams-lower > step/2 ? lower+step:lower;
}
export type RationSplit = {
  total:number;mix:number;complement:number;percent:number;actualPercent:number;
  theoreticalMix:number;theoreticalComplement:number;
  adjustment:"none"|"rounded"|"manual";note:string;
};
export function splitRation(total:number,percent:number,feedingMode:FeedingMode="standard"):RationSplit {
  const baseLabel=feedingMode === "cooked_monoprotein" ? "La base cocinada":"Complete";
  if (!Number.isFinite(total) || total <= 0 || !Number.isFinite(percent) || percent < 0 || percent > 20) throw new Error("La ración debe ser positiva y el complemento debe estar entre 0 y 20%.");
  const complement = Math.min(Math.floor(total/5),Math.floor(total*percent/100+1e-9));
  const theoreticalMix=total-complement;
  const base={total,mix:theoreticalMix,complement,percent,actualPercent:complement/total*100,theoreticalMix,theoreticalComplement:complement};
  if(percent === 0)return {...base,adjustment:"none",note:"Sin complementos de fórmula: la mezcla conserva toda la ración calculada."};
  // Round the daily Complete serving upward, never the total ration. Commercial
  // bags still start at 200 g and may cover multiple days; that package size is
  // not a minimum daily serving.
  const mix=Math.ceil(theoreticalMix/50)*50;
  if(mix >= total)return {...base,adjustment:"manual",note:`Porcionamiento manual: no cabe un múltiplo de 50 g de ${feedingMode === "cooked_monoprotein" ? "base cocinada":"Complete"} con complemento positivo sin aumentar la ración o superar el porcentaje permitido. Se conserva el reparto exacto anterior; usa una báscula y reparte las bolsas entre días. No aumentes la comida para usar una bolsa entera.`};
  const adjustedComplement=total-mix;
  return {...base,mix,complement:adjustedComplement,actualPercent:adjustedComplement/total*100,adjustment:mix === theoreticalMix ? "none":"rounded",
    note:`Reparto práctico: ${mix} g de mezcla + ${adjustedComplement} g de complemento al día. ${baseLabel} se ajusta hacia arriba en pasos de 50 g, conservando los ${total} g diarios. El ${percent}% es un máximo sobre la ración total. ${feedingMode === "cooked_monoprotein" ? "Las presentaciones verificadas":"Las bolsas de 200 g, 500 g y 1 kg"} se compran según precio y stock; una bolsa puede cubrir varios días.`};
}
