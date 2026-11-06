import type { CSSProperties, ReactNode } from "react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import styles from "./experience-section.module.css";

type ExperienceSectionProps = {
  id: string;
  label: string;
  eyebrowColor?: CSSProperties["color"];
  eyebrowLineColor?: CSSProperties["color"];
  children?: ReactNode;
};

export function ExperienceSection({ id, label, eyebrowColor, eyebrowLineColor, children }: ExperienceSectionProps) {
  return (
    <section id={id} className={styles.section} aria-label={label} tabIndex={-1}>
      <div className={styles.container}>
        <SectionEyebrow label={label} color={eyebrowColor} lineColor={eyebrowLineColor} />
        {children}
      </div>
    </section>
  );
}
