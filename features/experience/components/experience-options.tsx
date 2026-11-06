import { SectionEyebrow } from "@/components/section-eyebrow";
import { ArrowCta } from "@/components/arrow-cta";
import { AnimatedIllustration } from "./animated-illustration";
import { PersonalizeIllustration } from "./personalize-illustration";
import { ExploreIllustration } from "./explore-illustration";
import styles from "./experience-options.module.css";

export function ExperienceOptions() {
  return (
    <section id="experiencia" className={styles.section} aria-label="A tu manera" tabIndex={-1}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>
          <SectionEyebrow label="A tu manera" />
        </div>
        <div className={styles.option}>
          <AnimatedIllustration><PersonalizeIllustration /></AnimatedIllustration>
          <h2 className={styles.heading}>
            <ArrowCta className={styles.cta} href="#experiencia-personalizada" label="Experiencia personalizada" />
          </h2>
          <p className={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className={styles.option}>
          <AnimatedIllustration><ExploreIllustration /></AnimatedIllustration>
          <h2 className={styles.heading}>
            <ArrowCta className={styles.cta} href="#explorar" label="Explorar por mi cuenta" />
          </h2>
          <p className={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </section>
  );
}
