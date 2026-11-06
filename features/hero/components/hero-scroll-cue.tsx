import { ArrowDown } from "lucide-react";
import styles from "./hero-scroll-cue.module.css";

export function HeroScrollCue() {
  return (
    <a className={styles.cue} href="#experiencia" aria-label="Desplazarse a A tu manera">
      <ArrowDown size={24} strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
}
