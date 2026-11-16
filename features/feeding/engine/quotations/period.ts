import { z } from "zod";

export const quotePeriodSchema = z.union([z.literal(14), z.literal(28), z.literal(30)]);
export type QuotePeriod = z.infer<typeof quotePeriodSchema>;
export const newQuotePeriods = [14, 28] as const;
export const defaultQuotePeriod = 28;
