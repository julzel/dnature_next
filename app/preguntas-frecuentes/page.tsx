import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { Footer } from "@/features/footer/components/footer";
import { Header } from "@/features/header/components/header";
import { FaqExplorer } from "@/features/faq/components/faq-explorer";
import faq from "@/features/faq/data/faq.json";
import { pageMetadata } from "@/lib/seo/metadata";
import styles from "@/features/faq/components/faq.module.css";

export const metadata = pageMetadata({
  path: "/preguntas-frecuentes",
  title: "Preguntas frecuentes",
  description: "Encontrá respuestas sobre productos DNAture, recetas, preparación, porciones y conservación para perros y gatos.",
});

export default function FaqPage() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header solid />
      <main id="contenido">
        <PageHero
          title="Preguntas"
          accent="frecuentes"
          titleId="faq-title"
          description={`Encontrá orientación sobre nuestros productos, preparación y cuidados en ${faq.questions.length} preguntas organizadas por tema.`}
          navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Preguntas frecuentes", path: "/preguntas-frecuentes" }]} />}
        />
        <FaqExplorer />
        <section className={styles.help} aria-labelledby="faq-help-title">
          <div className={`${styles.container} ${styles.helpGrid}`}>
            <div>
              <SectionEyebrow label="Sigamos conversando" color="var(--dn-text-primary)" lineColor="var(--dn-text-primary)" />
              <h2 id="faq-help-title">¿Todavía tenés dudas?</h2>
              <p>Contanos qué necesitás. Estamos para escucharte y ayudarte a encontrar un buen punto de partida.</p>
            </div>
            <Link className={styles.helpLink} href="/#contacto">
              Contactar a DNAture <ArrowUpRight size={24} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
