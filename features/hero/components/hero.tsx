import { getImageProps } from "next/image";
import { HeroContent } from "./hero-content";
import { HeroScrollCue } from "./hero-scroll-cue";
import styles from "./hero.module.css";

export function Hero() {
  const common = {
    alt: "Perro levantando una pata entre helechos y troncos en el bosque.",
    fill: true,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
    className: styles.photo,
  } as const;
  const { props: desktop } = getImageProps({ ...common, src: "/images/hero.png" });
  const { props: mobile } = getImageProps({ ...common, src: "/images/hero-mobile.webp" });
  return (
    <section className={styles.hero} data-section="hero">
      <div className={styles.content} data-hero-section="content">
        <HeroContent />
      </div>
      <div className={styles.image} data-hero-section="image">
        <picture>
          <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes="100vw" />
          <img {...mobile} alt={common.alt} />
        </picture>
      </div>
      <HeroScrollCue />
    </section>
  );
}
