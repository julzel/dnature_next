import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionEyebrow } from "@/components/section-eyebrow";
import styles from "./about.module.css";

export function AboutHero() {
  return (
    <section className={`${styles.section} ${styles.hero}`} aria-labelledby="about-title">
      <div className={styles.container}>
        <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Nosotros", path: "/nosotros" }]} />
        <div className={styles.heroGrid}>
          <div>
            <SectionEyebrow label="Conocer DNAture" />
            <h1 id="about-title">Quiénes <br />somos</h1>
            <p className={styles.heroStatement}>La ciencia nos guía.<br />El cuidado nos conecta.</p>
            <p className={styles.heroCopy}>
              Somos DNAture, una marca costarricense de nutrición fisiológica
              para perros y gatos. Creemos que comprender su biología es el
              punto de partida para cuidarlos.
            </p>
            <a className={styles.textLink} href="#proposito">
              Descubrí nuestra esencia <ArrowDown size={20} aria-hidden="true" />
            </a>
          </div>
          <figure className={styles.heroArt}>
            <Image
              src="/images/experiences/walking-guided.svg"
              width={1536}
              height={1024}
              alt="Ilustración grabada de un perro y un gato caminando juntos y compartiendo una mirada."
              unoptimized
              loading="eager"
              fetchPriority="high"
            />
            <figcaption>Nutrición con esencia en el ADN</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
