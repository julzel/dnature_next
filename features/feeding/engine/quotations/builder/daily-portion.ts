import { z } from "zod";

/** Operational input limit, not a nutritional recommendation. */
export const maximumDailyPortionGrams = 10_000;
export const dailyPortionOverrideSchema = z.object({
  grams: z.number().finite().int().min(1).max(maximumDailyPortionGrams),
  reason: z.string().trim().min(1).max(300),
});
export type DailyPortionOverride = z.infer<typeof dailyPortionOverrideSchema>;
export type DailyPortionAdjustment = DailyPortionOverride & {
  automaticRawDailyGrams: number;
  automaticDailyGrams: number;
};

export function dailyPortionNote(adjustment: DailyPortionAdjustment): string {
  return `Porción personalizada: ${adjustment.grams} g/día como referencia completa. Referencia automática: ${adjustment.automaticDailyGrams} g/día (antes del redondeo: ${adjustment.automaticRawDailyGrams} g/día). Motivo: ${adjustment.reason}`;
}
