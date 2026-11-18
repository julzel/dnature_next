import { z } from "zod";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { feedingGroups, type FeedingAnswers } from "../data/questions";
import { feedingPetSchema, type FeedingPet } from "./intake";
import type { QuoteResponse } from "./result";

export const FEEDING_PLANS_KEY = "dnature.feeding-plans.v1";
export const feedingPlanDate = new Intl.DateTimeFormat("es-CR", { dateStyle: "medium", timeZone: "America/Costa_Rica" });

const packageSchema = z.object({
  id: z.string(), name: z.string(), ready: z.boolean(),
  mixDailyGrams: z.number().nonnegative(), complementDailyGrams: z.number().nonnegative(),
  subtotal: z.number().nonnegative(), iva: z.number().nonnegative(), total: z.number().nonnegative(),
  issues: z.array(z.string()), notes: z.array(z.string()),
  lines: z.array(z.object({
    sku: z.string(), name: z.string(), presentation: z.string(), href: z.string().regex(/^\/producto\/[^/?#\\]+$/),
    quantity: z.number().int().positive(), price: z.number().nonnegative(), role: z.string(), note: z.string(),
  })),
});

const planSchema = z.object({
  pet: feedingPetSchema,
  days: z.union([z.literal(14), z.literal(28)]),
  calculatedAt: z.iso.datetime(),
  result: z.object({
    id: z.string(), name: z.string(), review: z.string().min(1).nullable(),
    rawDailyGrams: z.number().positive().nullable(), dailyGrams: z.number().positive().nullable(),
    meals: z.number().int().min(0).max(4).nullable(), packages: z.array(packageSchema).max(4),
  }),
}).refine(({ pet, result }) => pet.id === result.id && (result.review === null
  ? pet.species === "dog" && result.dailyGrams !== null && result.rawDailyGrams !== null && result.packages.length === 4
  : result.dailyGrams === null && result.rawDailyGrams === null && result.packages.length === 0));

export type SavedFeedingPlan = z.infer<typeof planSchema>;

export function readFeedingPlans(pets: PetProfile[]) {
  try {
    const raw = localStorage.getItem(FEEDING_PLANS_KEY);
    const records: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(records)) throw new Error("Invalid feeding plans");
    let valid = true;
    let hasCompleted = false;
    const plans = records.flatMap((record) => {
      const parsed = planSchema.safeParse(record);
      if (!parsed.success) { valid = false; return []; }
      const pet = pets.find((profile) => profile.id === parsed.data.pet.id);
      if (pet) hasCompleted = true;
      if (!pet || pet.species !== parsed.data.pet.species || pet.breed !== parsed.data.pet.breed) return [];
      return [{ ...parsed.data, pet: { ...parsed.data.pet, name: pet.name }, result: { ...parsed.data.result, name: pet.name } }];
    });
    return { plans, hasCompleted, error: valid ? "" : "Algunas propuestas guardadas no se pudieron recuperar. Podés completar el perfil para volver a estimarlas." };
  } catch {
    return { plans: [], hasCompleted: false, error: "No pudimos leer tus propuestas guardadas en este navegador." };
  }
}

export function saveFeedingPlans(pets: PetProfile[], updated: SavedFeedingPlan[]) {
  const plans = new Map(readFeedingPlans(pets).plans.map((plan) => [plan.pet.id, plan]));
  for (const plan of updated) plans.set(plan.pet.id, planSchema.parse(plan));
  const saved = [...plans.values()];
  localStorage.setItem(FEEDING_PLANS_KEY, JSON.stringify(saved));
  return saved;
}

export function answersFromPlans(plans: SavedFeedingPlan[]): FeedingAnswers {
  const answers: FeedingAnswers = {};
  for (const { pet } of plans) {
    if (pet.species !== "dog") continue;
    for (const { keys } of feedingGroups) {
      for (const key of keys) answers[`${pet.id}.${key}`] = String(pet[key] ?? "");
    }
  }
  return answers;
}

export function reusablePlan(pet: FeedingPet, plans: SavedFeedingPlan[]) {
  const plan = plans.find((saved) => saved.pet.id === pet.id);
  if (!plan) return undefined;
  // A name or meal schedule change does not change the portion or package quantities.
  const quoteInputs = (profile: FeedingPet) => JSON.stringify(profile, (key, value) => key === "name" || key === "meals" ? undefined : value);
  if (quoteInputs(pet) !== quoteInputs(plan.pet)) return undefined;
  return {
    ...plan,
    pet,
    result: { ...plan.result, name: pet.name, meals: pet.species === "dog" ? pet.meals : 0 },
  };
}

export function plansFromQuote(quote: QuoteResponse, pets: FeedingPet[]): SavedFeedingPlan[] {
  return pets.map((pet) => planSchema.parse({
    pet, days: quote.days, calculatedAt: quote.calculatedAt,
    result: quote.pets.find((result) => result.id === pet.id),
  }));
}
