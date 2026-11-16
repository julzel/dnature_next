import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { feedingGroups, type FeedingAnswers } from "../data/questions";
import { DRAFT_KEY, feedingPetSchema } from "./intake";

export function readFeedingDraft(pets: PetProfile[]) {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return { values: {} as FeedingAnswers, step: -1, error: "" };
    if (raw.length > 32_000) throw new Error("Invalid draft");
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || !Object.values(parsed).every((item) => typeof item === "string" && item.length <= 500)) throw new Error("Invalid draft");
    const draft = parsed as FeedingAnswers;
    const values: FeedingAnswers = { days: draft.days === "14" ? "14" : "28" };
    for (const pet of pets) {
      if (draft[`${pet.id}._identity`] !== JSON.stringify(pet)) continue;
      for (const group of feedingGroups) for (const key of group.keys) {
        const name = `${pet.id}.${key}`;
        if (draft[name] !== undefined) values[name] = draft[name];
      }
    }
    const identitiesMatch = pets.every((pet) => draft[`${pet.id}._identity`] === JSON.stringify(pet));
    const step = identitiesMatch && /^\d+$/.test(draft._step ?? "") ? Number(draft._step) : -1;
    return { values, step, error: "" };
  } catch { return { values: {} as FeedingAnswers, step: -1, error: "No pudimos recuperar las respuestas de esta pestaña. Podés completar el formulario para continuar." }; }
}

export function feedingPayload(pet: PetProfile, answers: FeedingAnswers) {
  if (pet.species === "cat") return pet;
  const values = Object.fromEntries(feedingGroups.flatMap(({ keys }) => keys.map((key) => [key, answers[`${pet.id}.${key}`] ?? ""])));
  return { ...pet, ...values, age: values.age === "" ? undefined : Number(values.age), weight: values.weight === "" ? undefined : Number(values.weight), meals: values.meals === "" ? null : Number(values.meals) };
}

export function missingGroup(pet: PetProfile, answers: FeedingAnswers): number | null {
  const parsed = feedingPetSchema.safeParse(feedingPayload(pet, answers));
  if (parsed.success) return null;
  const keys = parsed.error.issues.map((issue) => issue.path[0]);
  return feedingGroups.findIndex((group) => group.keys.some((key) => keys.includes(key)));
}
