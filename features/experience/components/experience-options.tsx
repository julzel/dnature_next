import { SectionEyebrow } from "@/components/section-eyebrow";
import { ArrowCta } from "@/components/arrow-cta";
import { AnimatedIllustration } from "./animated-illustration";
import { ExperienceChoiceImage } from "./experience-choice-image";
import styles from "./experience-options.module.css";

export function ExperienceOptions() {
  return (
    <section id="experiencia" className={styles.section} aria-label="A tu manera" tabIndex={-1}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>
          <SectionEyebrow label="A tu manera" />
        </div>
        <div className={styles.option}>
          <AnimatedIllustration><ExperienceChoiceImage experience="guided" /></AnimatedIllustration>
          <h2 className={styles.heading}>
            <ArrowCta className={styles.cta} href="#experiencia-personalizada" label="Visita guiada" />
          </h2>
          <p className={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className={styles.option}>
          <AnimatedIllustration><ExperienceChoiceImage experience="explore" /></AnimatedIllustration>
          <h2 className={styles.heading}>
            <ArrowCta className={styles.cta} href="#explorar" label="Explorar por mi cuenta" />
          </h2>
          <p className={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </section>
  );
}
