import { z } from "zod";
import { dailyPortionNote, type DailyPortionAdjustment } from "./daily-portion";

export const naturalCoveragePercentSchema = z.union([z.literal(100), z.literal(75), z.literal(50)]);
export type NaturalCoveragePercent = z.infer<typeof naturalCoveragePercentSchema>;
export type NaturalCoverage = {
  percent: NaturalCoveragePercent;
  fullRawDailyGrams: number;
  fullDailyGrams: number;
  quotedDailyGrams: number;
  note: string;
  portionOverride?: DailyPortionAdjustment;
};
const precise = (grams: number) => Math.round(grams * 1e6) / 1e6;
const grams = (value: number) => new Intl.NumberFormat("es-CR", { maximumFractionDigits: 6 }).format(value);

/** Scale the full proposed ration, never the pet's weight. Do not re-round the
 * reduced ration: 50% and 75% must remain exact fractions of the same reference. */
export function naturalCoverage(fullRawDailyGrams: number, fullDailyGrams: number, value: unknown = 100, portionOverride?: DailyPortionAdjustment): NaturalCoverage {
  const percent = naturalCoveragePercentSchema.parse(value);
  const quotedDailyGrams = percent === 100 ? fullDailyGrams : precise(fullDailyGrams * percent / 100);
  return { percent, fullRawDailyGrams, fullDailyGrams, quotedDailyGrams,
    ...(portionOverride ? {portionOverride}:{}),
    note: `${portionOverride ? `${dailyPortionNote(portionOverride)} `:""}Alimentación natural cotizada: ${percent}% de la ración natural completa de referencia (${grams(fullDailyGrams)} g/día): ${grams(quotedDailyGrams)} g/día. ${portionOverride ? "Se conserva el peso real de la mascota.":"El cálculo usa el peso real."} La cantidad de croquetas se define aparte según el alimento utilizado. Huevos, suplementos y snacks conservan sus pautas por peso y edad.` };
}
export function naturalCoverageLabel(percent: NaturalCoveragePercent = 100) {
  return `${percent}% de alimentación natural`;
}
