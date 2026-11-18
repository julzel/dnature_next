import Link from "next/link";
import { SectionEyebrow } from "@/components/section-eyebrow";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import type { SavedFeedingPlan } from "../lib/saved-feeding-plans";
import { SavedPetPlanRow } from "./saved-pet-plan-row";
import styles from "./saved-pet-plans.module.css";

export function SavedPetPlans({ pets, plans, onEdit }: { pets: PetProfile[]; plans: SavedFeedingPlan[]; onEdit: (pet: PetProfile) => void }) {
  return <section className={styles.dashboard} aria-labelledby="saved-pets-title">
    <header className={styles.header}>
      <div>
        <SectionEyebrow label="Mi DNAture" />
        <h1 id="saved-pets-title" tabIndex={-1}>Mis mascotas</h1>
        <p>Consultá sus porciones y propuestas, o actualizá sus datos si algo cambió.</p>
      </div>
      <Link className={styles.textLink} href="/#experiencia-personalizada">Editar o agregar mascotas</Link>
    </header>
    <ul className={styles.pets} aria-label="Tus mascotas">
      {pets.map((pet) => <SavedPetPlanRow key={pet.id} pet={pet} plan={plans.find(({ pet: saved }) => saved.id === pet.id)} onEdit={onEdit} />)}
    </ul>
  </section>;
}
