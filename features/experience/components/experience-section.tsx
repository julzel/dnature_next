import { SectionEyebrow } from "@/components/section-eyebrow";
import styles from "./experience-section.module.css";

type ExperienceSectionProps = {
  id: string;
  number: number;
  label: string;
};

export function ExperienceSection({ id, number, label }: ExperienceSectionProps) {
  return (
    <section id={id} className={styles.section} aria-label={label} tabIndex={-1}>
      <div className={styles.container}>
        <SectionEyebrow number={number} label={label} />
      </div>
    </section>
  );
}
