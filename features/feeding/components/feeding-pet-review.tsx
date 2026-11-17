import type { MouseEvent } from "react";
import { Pencil } from "lucide-react";
import { PetSpeciesImage } from "@/components/pet-species-image";
import { getBreedArtwork } from "@/features/experience/data/pet-breeds";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { answerLabel, feedingGroups, feedingQuestions, type FeedingAnswers } from "../data/questions";
import styles from "./feeding.module.css";

export function FeedingPetReview({ pet, index, answers, onEdit }: { pet: PetProfile; index: number; answers: FeedingAnswers; onEdit: (petIndex: number, group: number) => void }) {
  function handleEdit(event: MouseEvent<HTMLButtonElement>) { onEdit(index, Number(event.currentTarget.dataset.group)); }
  return <article className={styles.reviewPet} aria-label={`Información de ${pet.name}`}>
    <header className={styles.reviewIdentity}><PetSpeciesImage species={pet.species} src={getBreedArtwork(pet.species, pet.breed)} alt="" size={160} /><div><p className={styles.kicker}>{pet.species === "dog" ? "Perro" : "Gato"} · Tu tribu</p><h2>{pet.name}</h2><p>{pet.breed}</p></div></header>
    {pet.species === "cat" ? <p className={styles.notice}>Para {pet.name}, nuestro equipo te ayudará a definir su alimentación. La estimación automática es para perros.</p> : <div className={styles.reviewGroups}>{feedingGroups.map((group, groupIndex) => <section key={group.title}>
      <div className={styles.reviewGroupTitle}><h3>{group.title}</h3><button type="button" className={styles.editButton} data-group={groupIndex} onClick={handleEdit} aria-label={`Editar ${group.title.toLowerCase()} de ${pet.name}`}><Pencil size={18} aria-hidden="true" /><span>Editar</span></button></div>
      <dl>{group.keys.map((key) => <div key={key}><dt>{feedingQuestions[key].label}</dt><dd data-missing={!answers[`${pet.id}.${key}`] && key !== "meals" || undefined}>{answerLabel(key, answers[`${pet.id}.${key}`])}</dd></div>)}</dl>
    </section>)}</div>}
  </article>;
}
