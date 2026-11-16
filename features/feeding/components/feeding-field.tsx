import { useId } from "react";
import { feedingQuestions, type FeedingKey } from "../data/questions";
import styles from "./feeding.module.css";

export function FeedingField({ questionKey, name, value }: { questionKey: FeedingKey; name: string; value: string }) {
  const id = useId();
  const question = feedingQuestions[questionKey];
  const optional = questionKey === "meals";
  return <div className={styles.field}>
    <label htmlFor={id}>{question.label}{optional && <span className={styles.optional}>Opcional</span>}</label>
    {"options" in question ? <select id={id} name={name} defaultValue={value} required={!optional}>
      <option value="" disabled={!optional}>{optional ? "Aún no lo he definido" : "Seleccioná una opción"}</option>
      {question.options.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
    </select> : <>
      <input id={id} name={name} type="number" inputMode="decimal" min={question.min} max={question.max} step="0.01" defaultValue={value} placeholder={question.placeholder} required aria-describedby={`${id}-help`} />
      <small id={`${id}-help`}>{question.help}</small>
    </>}
  </div>;
}
