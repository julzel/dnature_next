import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import styles from "./about.module.css";

export function AboutInvitation() {
  return (
    <section id="acompanamiento" className={`${styles.section} ${styles.invitation}`} aria-labelledby="invitation-title">
      <div className={`${styles.container} ${styles.invitationGrid}`}>
        <div>
          <SectionEyebrow label="Sigamos cerca" />
          <h2 id="invitation-title" className={styles.sectionTitle}>Elegir con información<br />también es cuidar.</h2>
          <p>Conocé nuestro enfoque, explorá los productos o contanos qué necesitás. Cada pregunta es un buen comienzo.</p>
          <Link className={styles.primaryLink} href="/productos">
            Explorá nuestros productos <ArrowUpRight size={24} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.nextSteps}>
          <Link href="/alianzas">
            <span><strong>Conocé profesionales aliados</strong><span>Servicios y contactos para acompañar su cuidado.</span></span>
            <ArrowUpRight size={24} aria-hidden="true" />
          </Link>
          <Link href="/ciencia/nuestros-criterios">
            <span><strong>Conocé nuestros criterios</strong><span>Fuentes claras y comunicación responsable.</span></span>
            <ArrowUpRight size={24} aria-hidden="true" />
          </Link>
          <Link href="/#contacto">
            <span><strong>Conversemos</strong><span>Estamos para escuchar tus preguntas.</span></span>
            <ArrowUpRight size={24} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
