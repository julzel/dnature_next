import styles from "./experience-options.module.css";

export function ExperienceOptions() {
  return (
    <section id="experiencia" className={styles.section} aria-label="A tu manera" tabIndex={-1}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>
          <SectionEyebrow number={2} label="A tu manera" />
        </div>
        <div className={styles.option}>
          <h2 className={styles.heading}>Experiencia personalizada</h2>
        </div>
        <div className={styles.option}>
          <h2 className={styles.heading}>Explorar por mi cuenta</h2>
        </div>
      </div>
    </section>
  );
}
import { SectionEyebrow } from "@/components/section-eyebrow";
