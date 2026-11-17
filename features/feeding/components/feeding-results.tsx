import { useState, type Ref } from "react";
import { Pencil } from "lucide-react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { Select } from "@/components/select";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import type { FeedingAnswers } from "../data/questions";
import type { QuoteResponse } from "../lib/result";
import { PetFeedingResult } from "./pet-feeding-result";
import styles from "./feeding-results.module.css";

type Props = {
  result: QuoteResponse;
  pets: PetProfile[];
  answers: FeedingAnswers;
  headingRef: Ref<HTMLHeadingElement>;
  onEdit: () => void;
};

export function FeedingResults({ result, pets, answers, headingRef, onEdit }: Props) {
  const [activeId, setActiveId] = useState(result.pets[0].id);
  const active = result.pets.find((pet) => pet.id === activeId) ?? result.pets[0];
  const profile = pets.find((pet) => pet.id === active.id)!;
  const multiple = result.pets.length > 1;

  function handlePetChange(id: string) { setActiveId(id); }

  return <div className={styles.results}>
    <header className={styles.header}>
      <SectionEyebrow label="Su porción y sus paquetes" />
      <h1 ref={headingRef} tabIndex={-1}>{multiple ? "Cada mascota, su propio plan." : <>Hecho para <span>{active.name}.</span></>}</h1>
      <div className={styles.headerBottom}>
        <p>{multiple ? "Cada perfil tiene su propio punto de partida. Descubrí la propuesta de cada uno." : "Sus datos nos dieron el punto de partida. Ahora, encontremos una forma de alimentar su esencia."}</p>
        <button className={styles.edit} type="button" onClick={onEdit} aria-label="Editar respuestas y recalcular"><Pencil size={18} aria-hidden="true" /><span>Editar sus datos</span></button>
      </div>
    </header>
    {multiple && <div className={styles.petSwitch}>
      <Select label="Ver la propuesta de" value={active.id} options={result.pets.map((pet) => ({ value: pet.id, label: pet.name }))} onValueChange={handlePetChange} autocomplete={result.pets.length > 6} />
      <p>Cada mascota tiene su propia cotización.</p>
      <span className="sr-only" role="status">Mostrando la propuesta de {active.name}.</span>
    </div>}
    <PetFeedingResult key={active.id} result={active} days={result.days} pet={profile} answers={answers} />
  </div>;
}
