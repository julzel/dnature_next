import Image from "next/image";
import { HeroContent } from "./hero-content";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} data-section="hero">
      <div className={styles.content} data-hero-section="content">
        <HeroContent />
      </div>
      <div className={styles.image} data-hero-section="image">
        <Image
          className={styles.photo}
          src="/images/hero.jpg"
          alt="Perro levantando una pata entre helechos y troncos en el bosque."
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
