import { SectionEyebrow } from "@/components/section-eyebrow";
import styles from "./about.module.css";

export function AboutPurpose() {
  return (
    <section id="proposito" className={`${styles.section} ${styles.purpose}`} aria-labelledby="purpose-title">
      <div className={styles.container}>
        <SectionEyebrow label="Nuestro propósito" color="var(--dn-text-primary)" lineColor="var(--dn-text-primary)" />
        <div className={styles.purposeGrid}>
          <h2 id="purpose-title">Nutrir es respetar<br />su esencia.</h2>
          <div className={styles.purposeCopy}>
            <p>Nos guía la ciencia, pero también la empatía.</p>
            <p>
              Queremos acompañar, enseñar y transformar la forma en que entendemos
              el bienestar animal. Conectar la biología con el conocimiento y el
              cuidado es nuestra razón de ser.
            </p>
            <div className={styles.nameMeaning}>
              <span><strong>DNA</strong> Biología individual</span>
              <span aria-hidden="true">+</span>
              <span><strong>Nature</strong> Naturaleza y esencia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
