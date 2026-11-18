import type { CSSProperties } from "react";
import { PetSpeciesImage } from "@/components/pet-species-image";
import { getBreedArtwork, getBreedSize, type BreedSize } from "../data/pet-breeds";
import type { PetProfile } from "../data/pet-profiles";
import styles from "./pet-group-portrait.module.css";

// Optical ratios, not measurements or nutrition size classes.
export const GROUP_PORTRAIT_SCALES: Record<BreedSize, number> = {
  mini: .45,
  small: .6,
  medium: .78,
  large: .9,
  "extra-large": 1,
};

export function PetGroupPortrait({ pet, proportional = true }: { pet: PetProfile; proportional?: boolean }) {
  const size = getBreedSize(pet.species, pet.breed);
  const displaySize = size ?? (pet.species === "cat" ? "small" : "medium");
  const style = { "--portrait-scale": proportional ? GROUP_PORTRAIT_SCALES[displaySize] : 1 } as CSSProperties;

  return (
    <div className={styles.portrait} style={style} data-breed-size={size ?? "unknown"}>
      <PetSpeciesImage species={pet.species} src={getBreedArtwork(pet.species, pet.breed)} alt="" size={240} />
    </div>
  );
}
