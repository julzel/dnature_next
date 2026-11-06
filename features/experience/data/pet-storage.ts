import { MAX_PETS, type PetProfile } from "./pet-profiles";

export const PET_STORAGE_KEY = "dnature.pet-profiles.v1";
export const PET_STORAGE_EVENT = "dnature:pet-profiles-updated";

function isPetProfile(value: unknown): value is PetProfile {
  if (!value || typeof value !== "object") return false;
  const pet = value as Record<string, unknown>;
  return typeof pet.id === "string" && pet.id.trim().length > 0 && pet.id.length <= 100
    && typeof pet.name === "string" && pet.name.trim().length > 0 && pet.name.length <= 60
    && (pet.species === "cat" || pet.species === "dog")
    && typeof pet.breed === "string" && pet.breed.trim().length > 0 && pet.breed.length <= 80;
}

export function parsePetProfiles(raw: string | null): PetProfile[] {
  if (raw === null) return [];
  if (raw.length > 100_000) throw new Error("Invalid pet profiles");
  const stored: unknown = JSON.parse(raw);
  if (!stored || typeof stored !== "object") throw new Error("Invalid pet profiles");
  const { version, pets } = stored as Record<string, unknown>;
  if (version !== 1 || !Array.isArray(pets) || pets.length > MAX_PETS || !pets.every(isPetProfile)
    || new Set(pets.map((pet) => pet.id)).size !== pets.length) {
    throw new Error("Invalid pet profiles");
  }
  return pets.map(({ id, name, species, breed }) => ({ id, name, species, breed }));
}

export function savePetProfiles(pets: PetProfile[]) {
  const serialized = JSON.stringify({ version: 1, pets });
  parsePetProfiles(serialized);
  window.localStorage.setItem(PET_STORAGE_KEY, serialized);
  window.dispatchEvent(new Event(PET_STORAGE_EVENT));
}
