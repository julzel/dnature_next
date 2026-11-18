import type { MouseEvent } from "react";
import { ArrowUpRight, ChevronDown, Pencil, Utensils } from "lucide-react";
import { ArrowCta } from "@/components/arrow-cta";
import { PetSpeciesImage } from "@/components/pet-species-image";
import contact from "@/features/contact/data/contact.json";
import { getBreedArtwork } from "@/features/experience/data/pet-breeds";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { answerLabel, feedingGroups, feedingQuestions } from "../data/questions";
import { feedingPlanDate, type SavedFeedingPlan } from "../lib/saved-feeding-plans";
import { FeedingPackageSection } from "./feeding-package-section";
import styles from "./saved-pet-plans.module.css";

export function SavedPetPlanRow({ pet, plan, onEditProfile, onEditFeeding }: {
  pet: PetProfile;
  plan?: SavedFeedingPlan;
  onEditProfile: (pet: PetProfile) => void;
  onEditFeeding: (pet: PetProfile) => void;
}) {
  const result = plan?.result;
  const savedDog = plan?.pet.species === "dog" ? plan.pet : undefined;
  const grams = result?.dailyGrams;
  const meals = result?.meals;
  const perMeal = grams && meals ? Math.round(grams / meals * 10) / 10 : null;
  const editLabel = plan ? "Actualizar datos" : "Completar perfil";

  function handleEditProfile(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.focus({ preventScroll: true });
    onEditProfile(pet);
  }
  function handleEditFeeding(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.focus({ preventScroll: true });
    onEditFeeding(pet);
  }

  return <li className={styles.pet}>
    <article id={`saved-pet-${pet.id}`} tabIndex={-1} aria-label={`Perfil de ${pet.name}`}>
      <div className={styles.summary}>
        <div className={styles.identity}>
          <PetSpeciesImage species={pet.species} src={getBreedArtwork(pet.species, pet.breed)} alt="" size={104} />
          <div><h2>{pet.name}</h2><p>{pet.breed}</p>
            <button type="button" className={styles.editProfile} aria-label={`Editar perfil de ${pet.name}`} onClick={handleEditProfile}>
              <Pencil size={16} aria-hidden="true" /><span>Editar perfil</span>
            </button>
          </div>
        </div>
        <div className={styles.portion}>
          {grams ? <>
            <p className={styles.label}>Porción diaria estimada</p>
            <p><strong>{grams} g</strong> al día</p>
            {perMeal !== null && <p className={styles.secondary}>{perMeal} g por comida · {meals} {meals === 1 ? "comida" : "comidas"}</p>}
          </> : <>
            <p className={styles.status}>{result?.review ? "Revisión individual" : "Perfil de alimentación pendiente"}</p>
            <p className={styles.secondary}>{result?.review ?? "Completá sus datos para conocer el siguiente paso."}</p>
          </>}
        </div>
        <div className={styles.actions}>
          {pet.species !== "cat" || !plan ? <button type="button" className={styles.edit} aria-label={`${editLabel} de ${pet.name}`} onClick={handleEditFeeding}>
            <Utensils size={18} aria-hidden="true" /><span>{editLabel}</span>
          </button> : null}
          {result?.review && <ArrowCta href={contact.whatsapp.url} label="Consultar con DNAture" target="_blank" rel="noopener noreferrer" />}
        </div>
      </div>
      {savedDog && <details className={styles.details}>
        <summary>Ver datos de alimentación <ChevronDown size={18} aria-hidden="true" /></summary>
        <dl className={styles.facts}>{feedingGroups.flatMap(({ keys }) => keys.map((key) => <div key={key}>
          <dt>{feedingQuestions[key].label}</dt><dd>{answerLabel(key, String(savedDog[key] ?? ""))}</dd>
        </div>))}</dl>
      </details>}
      {plan && grams && <details className={styles.details}>
        <summary>Ver paquetes guardados <ChevronDown size={18} aria-hidden="true" /></summary>
        <FeedingPackageSection result={plan.result} days={plan.days} savedDate={feedingPlanDate.format(new Date(plan.calculatedAt))} />
      </details>}
      {result?.review && <a className={styles.textLink} href="/alianzas">Conocer profesionales aliados <ArrowUpRight size={16} aria-hidden="true" /></a>}
    </article>
  </li>;
}
