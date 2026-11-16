import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { feedingGroups, type FeedingAnswers } from "../data/questions";
import { FeedingField } from "./feeding-field";
import styles from "./feeding.module.css";

export function PetFeedingFields({ pet, group, answers, onAnswerChange }: { pet: PetProfile; group: number; answers: FeedingAnswers; onAnswerChange: (name: string, value: string) => void }) {
  return <fieldset className={styles.petFields}>
    <legend className="sr-only">{feedingGroups[group].title} de {pet.name}</legend>
    <div className={styles.fields}>{feedingGroups[group].keys.map((key) => <FeedingField key={`${pet.id}.${key}`} onAnswerChange={onAnswerChange} questionKey={key} name={`${pet.id}.${key}`} value={answers[`${pet.id}.${key}`] ?? ""} />)}</div>
  </fieldset>;
}
