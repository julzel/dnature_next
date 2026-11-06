import { SectionEyebrow } from "@/components/section-eyebrow";
import styles from "./contact.module.css";

export function Contact() {
  return (
    <section id="contacto" className={styles.contact} aria-label="Contacto">
      <div className={styles.container}>
        <SectionEyebrow label="Contacto" />
      </div>
    </section>
  );
}
