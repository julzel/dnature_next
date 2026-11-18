import { z } from "zod";

const dogSchema = z.object({
  id: z.string().trim().min(1).max(100), name: z.string().trim().min(1).max(60),
  species: z.literal("dog"), breed: z.string().trim().min(1).max(100),
  age: z.number().finite().min(0).max(30), weight: z.number().finite().min(.1).max(100),
  lifeStage: z.enum(["adult", "growing"]), neutered: z.enum(["yes", "no"]),
  body: z.enum(["thin", "ideal", "overweight"]), activity: z.enum(["calm", "normal", "active"]),
  health: z.enum(["healthy", "condition", "unsure", "reproductive"]),
  allergyStatus: z.enum(["no", "yes", "unknown"]),
  goal: z.enum(["wellness", "digestion", "skin", "joints", "energy", "weight"]),
  behavior: z.enum(["unknown", "calm", "anxious", "training", "destructive", "energetic", "other"]),
  brachycephaly: z.enum(["yes", "no", "unknown"]), meals: z.number().int().min(1).max(4).nullable().default(null),
}).strict();
export const feedingPetSchema = z.discriminatedUnion("species", [dogSchema, z.object({ id: z.string().trim().min(1).max(100), name: z.string().trim().min(1).max(60), species: z.literal("cat"), breed: z.string().trim().min(1).max(100) }).strict()]);
export const quoteRequestSchema = z.object({
  days: z.union([z.literal(14), z.literal(28)]),
  pets: z.array(feedingPetSchema).min(1).max(24),
}).strict().refine((value) => new Set(value.pets.map((pet) => pet.id)).size === value.pets.length, "Los perfiles deben ser distintos.");
export type FeedingPet = z.infer<typeof feedingPetSchema>;
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export const DRAFT_KEY = "dnature.feeding-intake.v1";

export function reviewReason(pet: FeedingPet): string | null {
  if (pet.species !== "dog") return "La estimación automática de esta visita es para perros. Nuestro equipo puede ayudarte con un plan para tu gato.";
  if (pet.lifeStage === "growing" || pet.age < 1) return "Durante el crecimiento, la porción y los productos necesitan una revisión individual.";
  if (pet.health !== "healthy") return "Antes de estimar su alimentación, revisemos su estado de salud, gestación o lactancia con un profesional.";
  if (pet.allergyStatus === "yes") return "Indicás que tiene alergias o restricciones alimentarias. El equipo necesita revisar los ingredientes antes de estimar su porción y recomendar paquetes.";
  if (pet.allergyStatus === "unknown") return "Marcaste «No lo sé» en alergias o restricciones alimentarias. Antes de estimar su porción y recomendar paquetes, revisemos qué ingredientes puede comer.";
  return null;
}
