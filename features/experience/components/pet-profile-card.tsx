import { getBreedArtwork, type PetSpecies } from "../data/pet-breeds";
import { PetSpeciesImage } from "@/components/pet-species-image";
import styles from "./pet-profile-card.module.css";

type PetProfileCardProps = {
  name: string;
  species: PetSpecies;
  breed: string;
  revealed?: boolean;
  animated?: boolean;
};

export function PetProfileCard({ name, species, breed, revealed = true, animated = true }: PetProfileCardProps) {
  return (
    <article className={styles.card} aria-label={`Ficha de ${name}`} data-species={species} data-revealed={revealed} data-animated={animated}>
      <div className={styles.body}>
        <div className={styles.portrait}>
          <PetSpeciesImage species={species} src={getBreedArtwork(species, breed)} alt="" size={160} variant="engraving" animated={animated} revealed={revealed} />
        </div>
        <dl className={styles.details}>
          <div><dt>Nombre:</dt><dd>{name}</dd></div>
          <div><dt>Especie:</dt><dd>{species === "cat" ? "Gato" : "Perro"}</dd></div>
          <div><dt>Raza:</dt><dd>{breed}</dd></div>
        </dl>
      </div>
    </article>
  );
}
