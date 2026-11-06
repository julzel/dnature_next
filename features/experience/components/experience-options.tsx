import Image from "next/image";
import { SectionEyebrow } from "@/components/section-eyebrow";
import styles from "./experience-options.module.css";

export function ExperienceOptions() {
  return (
    <section id="experiencia" className={styles.section} aria-label="A tu manera" tabIndex={-1}>
      <div className={styles.container}>
        <div className={styles.eyebrow}>
          <SectionEyebrow number={2} label="A tu manera" />
        </div>
        <div className={styles.option}>
          <Image className={styles.illustration} src="/images/experience-personalize.svg" alt="" width={320} height={240} />
          <h2 className={styles.heading}>Experiencia personalizada</h2>
        </div>
        <div className={styles.option}>
          <Image className={styles.illustration} src="/images/experience-explore.svg" alt="" width={320} height={240} />
          <h2 className={styles.heading}>Explorar por mi cuenta</h2>
        </div>
      </div>
    </section>
  );
}
