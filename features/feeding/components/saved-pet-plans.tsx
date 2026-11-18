import type { MouseEvent } from "react";
import { Plus } from "lucide-react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { MAX_PETS, type PetProfile } from "@/features/experience/data/pet-profiles";
import type { SavedFeedingPlan } from "../lib/saved-feeding-plans";
import { SavedPetPlanRow } from "./saved-pet-plan-row";
import styles from "./saved-pet-plans.module.css";

export function SavedPetPlans({ pets, plans, onAdd, onEditProfile, onEditFeeding }: {
  pets: PetProfile[];
  plans: SavedFeedingPlan[];
  onAdd: () => void;
  onEditProfile: (pet: PetProfile) => void;
  onEditFeeding: (pet: PetProfile) => void;
}) {
  function handleAdd(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.focus({ preventScroll: true });
    onAdd();
  }

  return <section className={styles.dashboard} aria-labelledby="saved-pets-title">
    <header className={styles.header}>
      <div>
        <SectionEyebrow label="Mi DNAture" />
        <h1 id="saved-pets-title" tabIndex={-1}>Mis mascotas</h1>
        <p>Consultá sus porciones y propuestas, o actualizá sus datos si algo cambió.</p>
      </div>
      {pets.length < MAX_PETS ? <button type="button" className={styles.add} onClick={handleAdd}><Plus size={20} aria-hidden="true" />Agregar mascota</button>
        : <p>Alcanzaste el máximo de {MAX_PETS} mascotas.</p>}
    </header>
    <ul className={styles.pets} aria-label="Tus mascotas">
      {pets.map((pet) => <SavedPetPlanRow key={pet.id} pet={pet} plan={plans.find(({ pet: saved }) => saved.id === pet.id)}
        onEditProfile={onEditProfile} onEditFeeding={onEditFeeding} />)}
    </ul>
  </section>;
}
