import Link from "next/link";
import { ArrowUpRight, MessagesSquare } from "lucide-react";
import { ArrowCta } from "@/components/arrow-cta";
import { SectionEyebrow } from "@/components/section-eyebrow";
import contact from "@/features/contact/data/contact.json";
import styles from "./faq.module.css";

export function FaqHelp() {
  return (
    <section className={styles.help} aria-labelledby="faq-help-title">
      <div className={`${styles.container} ${styles.helpGrid}`}>
        <div className={styles.helpIntro}>
          <MessagesSquare size={64} strokeWidth={1} aria-hidden="true" />
          <SectionEyebrow label="De persona a persona" tone="light" />
          <h2 id="faq-help-title">Tu duda merece<br />una conversación.</h2>
        </div>
        <div className={styles.helpActions}>
          <p>Cada mascota tiene su historia. Si no encontraste lo que buscabas, contanos cómo podemos acompañarte.</p>
          <ArrowCta className={styles.helpCta} href={contact.whatsapp.url} label="Contáctanos por WhatsApp" target="_blank" rel="noopener noreferrer" aria-label="Contáctanos por WhatsApp (abre en otra pestaña)" />
          <Link className={styles.contactLink} href="/#contacto">Ver otras formas de contacto <ArrowUpRight size={20} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
