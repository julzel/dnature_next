import type { ChangeEvent } from "react";
import { Check } from "lucide-react";
import { PetSpeciesImage } from "@/components/pet-species-image";
import { getBreedArtwork } from "@/features/experience/data/pet-breeds";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { answerLabel, type FeedingAnswers } from "../data/questions";
import { missingGroup } from "../lib/feeding-draft";
import styles from "./feeding.module.css";

export function FeedingPetSidebar({ pets, petIndex, answers, onSelect }: { pets: PetProfile[]; petIndex: number; answers: FeedingAnswers; onSelect: (index: number) => void }) {
  const pet = pets[petIndex];
  const completed = pets.filter((item) => item.species === "dog" && missingGroup(item, answers) === null).length;
  const dogs = pets.filter((item) => item.species === "dog").length;
  function handleSelect(event: ChangeEvent<HTMLSelectElement>) { onSelect(Number(event.target.value)); }
  return <aside className={styles.petSidebar} aria-label={`Perfil de ${pet.name}`}>
    {pets.length > 1 && <label className={styles.petSwitcher}>Tu tribu · mascota {petIndex + 1} de {pets.length}
      <select value={petIndex} onChange={handleSelect} aria-label="Cambiar mascota">{pets.map((item, index) => <option key={item.id} value={index}>{item.name}{item.species === "dog" && missingGroup(item, answers) === null ? " · Datos completos" : item.species === "cat" ? " · Atención personalizada" : ""}</option>)}</select>
    </label>}
    <div className={styles.petIdentity}>
      <PetSpeciesImage species={pet.species} src={getBreedArtwork(pet.species, pet.breed)} alt="" size={240} />
      <div><p className={styles.kicker}>{pet.species === "dog" ? "Su plan empieza con" : "También cuidamos de"}</p><h2>{pet.name}</h2><p className={styles.breed}>{pet.breed}</p></div>
    </div>
    {pet.species === "dog" && <dl className={styles.petFacts}>
      <div><dt>Edad</dt><dd>{answerLabel("age", answers[`${pet.id}.age`])}</dd></div>
      <div><dt>Peso</dt><dd>{answerLabel("weight", answers[`${pet.id}.weight`])}</dd></div>
      <div><dt>Etapa</dt><dd>{answerLabel("lifeStage", answers[`${pet.id}.lifeStage`])}</dd></div>
    </dl>}
    {dogs > 0 && <p className={styles.tribeProgress}><Check size={16} aria-hidden="true" />{completed} de {dogs} {dogs === 1 ? "perfil completo" : "perfiles completos"}</p>}
  </aside>;
}
