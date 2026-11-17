import type { PetSpecies } from "./pet-breeds";

export const MAX_PETS = 24;

export type PetProfile = {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
};

export function upsertPet(profiles: PetProfile[], pet: PetProfile): PetProfile[] {
  if (profiles.some((profile) => profile.id === pet.id)) {
    return profiles.map((profile) => profile.id === pet.id ? pet : profile);
  }
  return profiles.length < MAX_PETS ? [...profiles, pet] : profiles;
}
