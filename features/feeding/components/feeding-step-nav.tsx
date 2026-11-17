import type { MouseEvent } from "react";
import { feedingGroups } from "../data/questions";
import styles from "./feeding.module.css";

export function FeedingStepNav({ group, onSelect }: { group: number; onSelect: (group: number) => void }) {
  function handleSelect(event: MouseEvent<HTMLButtonElement>) { onSelect(Number(event.currentTarget.dataset.group)); }
  return <nav aria-label="Pasos de esta mascota"><ol className={styles.groupSteps}>{feedingGroups.map((item, index) => <li key={item.title}>
    <button type="button" data-group={index} onClick={handleSelect} aria-current={index === group ? "step" : undefined}><span className={styles.stepNumber}>0{index + 1}</span><span>{item.title}</span></button>
  </li>)}</ol></nav>;
}
