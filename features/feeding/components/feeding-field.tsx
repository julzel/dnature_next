import { useId } from "react";
import { Select } from "@/components/select";
import { feedingQuestions, type FeedingKey } from "../data/questions";
import styles from "./feeding.module.css";

export function FeedingField({ questionKey, name, value, onAnswerChange }: { questionKey: FeedingKey; name: string; value: string; onAnswerChange: (name: string, value: string) => void }) {
  const id = useId();
  const question = feedingQuestions[questionKey];
  const optional = questionKey === "meals";
  function handleSelection(selected: string) { onAnswerChange(name, selected); }
  if ("options" in question) return <Select id={id} name={name} label={question.label} value={value} required={!optional} optional={optional} onValueChange={handleSelection} options={[
    ...(optional ? [{ value: "", label: "Aún no lo he definido" }] : []),
    ...question.options.map(([value, label]) => ({ value, label })),
  ]} />;
  return <div className={styles.field}>
    <label htmlFor={id}>{question.label}</label>
    <input id={id} name={name} type="number" inputMode="decimal" min={question.min} max={question.max} step="0.01" defaultValue={value} placeholder={question.placeholder} required aria-describedby={`${id}-help`} />
    <small id={`${id}-help`}>{question.help}</small>
  </div>;
}
