import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { essence } from "../data/about-content";
import styles from "./about.module.css";

export function AboutEssence() {
  return (
    <section id="esencia" className={`${styles.section} ${styles.essence}`} aria-labelledby="essence-title">
      <div className={`${styles.container} ${styles.essenceGrid}`}>
        <div>
          <SectionEyebrow label="Lo que nos define" />
          <h2 id="essence-title" className={styles.sectionTitle}>Ciencia.<br />Conciencia.<br />Tribu.</h2>
          <p className={styles.essenceIntro}>
            El conocimiento, la empatía y la comunidad se encuentran en nuestra
            forma de entender la nutrición. Explorá qué significa cada uno.
          </p>
        </div>
        <div className={styles.pillars}>
          {essence.map((pillar, index) => (
            <details key={pillar.id} name="about-essence" open={index === 0} className={styles.pillar}>
              <summary>
                <span className={styles.pillarHeading}>
                  <span className={styles.pillarName}>{pillar.name}</span>
                  <span className={styles.pillarDimension}>{pillar.dimension}</span>
                </span>
                <Plus className={styles.expandIcon} size={24} strokeWidth={1.5} aria-hidden="true" />
              </summary>
              <div className={styles.pillarReveal}>
                <div className={styles.pillarBody}>
                  <ul className={styles.associations} aria-label={`Principios de ${pillar.name.toLowerCase()}`}>
                    {pillar.associations.map((association) => <li key={association}>{association}</li>)}
                  </ul>
                  <p>{pillar.description}</p>
                  <p>{pillar.practice}</p>
                  <Link className={styles.textLink} href={pillar.href}>
                    {pillar.link} <ArrowUpRight size={20} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
