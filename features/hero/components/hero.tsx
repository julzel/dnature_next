import { Image as ImageIcon } from "lucide-react";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} data-section="hero">
      <div className={styles.content} data-hero-section="content" />
      <div className={styles.image} data-hero-section="image" aria-hidden="true">
        <ImageIcon className={styles.placeholderIcon} strokeWidth={1} />
      </div>
    </section>
  );
}
