import { Check } from "lucide-react";
import styles from "./pet-questionnaire-progress.module.css";

const steps = ["Especie", "Nombre", "Raza"];

export function PetQuestionnaireProgress({ step }: { step: number }) {
  return (
    <ol className={styles.progress} aria-label="Preguntas del perfil">
      {steps.map((label, index) => (
        <li key={label} aria-current={step === index ? "step" : undefined} data-complete={step > index || undefined}>
          <span className={styles.number} aria-hidden="true">{step > index ? <Check size={16} /> : `0${index + 1}`}</span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}
