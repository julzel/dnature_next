import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { FeedingField } from "./feeding-field";
import styles from "./feeding.module.css";

const questions = [
  { key: "lifeStage", label: "Etapa de vida", options: [["adult", "Adulto"], ["growing", "En crecimiento"]] },
  { key: "neutered", label: "¿Está esterilizado?", options: [["yes", "Sí"], ["no", "No"]] },
  { key: "body", label: "Condición corporal", options: [["thin", "Delgado"], ["ideal", "Peso ideal"], ["overweight", "Sobrepeso"]] },
  { key: "activity", label: "Actividad diaria", options: [["calm", "Tranquila"], ["normal", "Moderada"], ["active", "Alta"]] },
  { key: "health", label: "Estado de salud", options: [["healthy", "Sano, sin condiciones conocidas"], ["condition", "Tiene una condición o tratamiento"], ["reproductive", "Gestación o lactancia"], ["unsure", "No estoy seguro"]] },
  { key: "allergyStatus", label: "¿Tiene alergias o restricciones alimentarias?", options: [["no", "No"], ["yes", "Sí"], ["unknown", "No lo sé"]] },
  { key: "brachycephaly", label: "¿Tiene el hocico achatado (braquicéfalo)?", options: [["no", "No"], ["yes", "Sí"], ["unknown", "No lo sé"]] },
  { key: "goal", label: "¿Qué querés acompañar con su alimentación?", options: [["wellness", "Bienestar diario"], ["digestion", "Digestión"], ["skin", "Piel y pelaje"], ["joints", "Movilidad"], ["energy", "Energía"], ["weight", "Control de peso"]] },
  { key: "behavior", label: "Comportamiento habitual", options: [["calm", "Tranquilo"], ["training", "En entrenamiento"], ["anxious", "Ansioso"], ["destructive", "Masticador intenso"], ["energetic", "Muy enérgico"], ["other", "Otro"], ["unknown", "No lo sé"]] },
] as const;

export function PetFeedingFields({ pet, defaults }: { pet: PetProfile; defaults: Record<string, string> }) {
  const prefix = `${pet.id}.`;
  return <fieldset className={styles.petFields}><legend>{pet.name} <span>· {pet.species === "dog" ? "Perro" : "Gato"} · {pet.breed}</span></legend>
    <div className={styles.fields}>
      <label>Edad en años<input name={`${prefix}age`} type="number" min="0" max="30" step="0.01" required defaultValue={defaults[`${prefix}age`] ?? ""} placeholder="Ej. 3" /></label>
      <label>Peso actual en kg<input name={`${prefix}weight`} type="number" min="0.1" max="100" step="0.01" required defaultValue={defaults[`${prefix}weight`] ?? ""} placeholder="Ej. 12,5" /></label>
      {questions.map((question) => <FeedingField key={question.key} name={`${prefix}${question.key}`} label={question.label} options={question.options} initial={defaults[`${prefix}${question.key}`] ?? ""} />)}
      <FeedingField name={`${prefix}meals`} label="Comidas al día para repartir la porción" initial={defaults[`${prefix}meals`] ?? "2"} options={[["1", "1 comida"], ["2", "2 comidas"], ["3", "3 comidas"], ["4", "4 comidas"]]} />
    </div>
  </fieldset>;
}
