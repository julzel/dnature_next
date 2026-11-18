import { useState, type Ref } from "react";
import { Pencil } from "lucide-react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { Select } from "@/components/select";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import type { FeedingAnswers } from "../data/questions";
import { feedingPlanDate, type SavedFeedingPlan } from "../lib/saved-feeding-plans";
import { PetFeedingResult } from "./pet-feeding-result";
import styles from "./feeding-results.module.css";

type Props = {
  plans: SavedFeedingPlan[];
  freshIds: string[];
  pets: PetProfile[];
  answers: FeedingAnswers;
  headingRef: Ref<HTMLHeadingElement>;
  onEdit: () => void;
  onEditAllergies: (petId: string) => void;
  initialPetId?: string;
  onShowPets: () => void;
};

export function FeedingResults({ plans, freshIds, pets, answers, headingRef, onEdit, onEditAllergies, initialPetId, onShowPets }: Props) {
  const [activeId, setActiveId] = useState(initialPetId ?? plans[0].pet.id);
  const plan = plans.find(({ pet }) => pet.id === activeId) ?? plans[0];
  const active = plan.result;
  const profile = pets.find((pet) => pet.id === active.id)!;
  const multiple = plans.length > 1;
  const savedDate = freshIds.includes(active.id) ? undefined : feedingPlanDate.format(new Date(plan.calculatedAt));
  const allergyStatus = answers[`${active.id}.allergyStatus`];
  const canEditAllergies = profile.species === "dog" && (allergyStatus === "yes" || allergyStatus === "unknown");

  function handlePetChange(id: string) { setActiveId(id); }
  function handleEditAllergies() { onEditAllergies(active.id); }

  return <div className={styles.results}>
    <header className={styles.header}>
      <SectionEyebrow label="Su porción y sus paquetes" />
      <h1 ref={headingRef} tabIndex={-1}>{multiple ? "Cada mascota, su propio plan." : <>Hecho para <span>{active.name}.</span></>}</h1>
      <div className={styles.headerBottom}>
        <p>{multiple ? "Cada perfil tiene su propio punto de partida. Descubrí la propuesta de cada uno." : "Sus datos nos dieron el punto de partida. Ahora, encontremos una forma de alimentar su esencia."}</p>
        <div className={styles.headerActions}>
          <button className={styles.edit} type="button" onClick={onEdit} aria-label="Editar respuestas y recalcular"><Pencil size={18} aria-hidden="true" /><span>Editar sus datos</span></button>
          <button className={styles.savedPetsLink} type="button" onClick={onShowPets}>Ver mis mascotas</button>
        </div>
      </div>
    </header>
    {multiple && <div className={styles.petSwitch}>
      <Select label="Ver la propuesta de" value={active.id} options={plans.map(({ pet }) => ({ value: pet.id, label: pet.name }))} onValueChange={handlePetChange} autocomplete={plans.length > 6} />
      <p>Elegí una mascota para ver su estimación o saber si necesita una revisión.</p>
      <span className="sr-only" role="status">{active.review ? `${active.name} necesita una revisión individual.` : `Mostrando la propuesta de ${active.name}.`}</span>
    </div>}
    <PetFeedingResult key={active.id} result={active} days={plan.days} savedDate={savedDate} pet={profile} answers={answers} onEditAllergies={canEditAllergies ? handleEditAllergies : undefined} />
  </div>;
}
