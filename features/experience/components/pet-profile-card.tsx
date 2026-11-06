import type { PetSpecies } from "../data/pet-breeds";
import { CatAvatar } from "./cat-avatar";
import { DogAvatar } from "./dog-avatar";
import styles from "./pet-profile-card.module.css";

type PetProfileCardProps = {
  name: string;
  species: PetSpecies;
  breed: string;
  revealed?: boolean;
};

export function PetProfileCard({ name, species, breed, revealed = true }: PetProfileCardProps) {
  return (
    <article className={styles.card} aria-label={`Ficha de ${name}`} data-species={species} data-revealed={revealed}>
      <div className={styles.body}>
        <div className={styles.portrait}>
          {species === "cat" ? <CatAvatar size={80} /> : <DogAvatar size={80} animated revealed={revealed} />}
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
