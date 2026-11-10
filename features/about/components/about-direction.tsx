import { SectionEyebrow } from "@/components/section-eyebrow";
import { DirectionExplorer } from "./direction-explorer";
import styles from "./about.module.css";

export function AboutDirection() {
  return (
    <section id="direccion" className={`${styles.section} ${styles.direction}`} aria-labelledby="direction-title">
      <div className={styles.container}>
        <SectionEyebrow label="Misión y visión" tone="light" />
        <h2 id="direction-title" className={styles.sectionTitle}>Un propósito que nos mueve.<br />Un horizonte compartido.</h2>
        <DirectionExplorer />
      </div>
    </section>
  );
}
