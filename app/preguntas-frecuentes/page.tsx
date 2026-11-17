import Image from "next/image";
import { ArrowCta } from "@/components/arrow-cta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { Footer } from "@/features/footer/components/footer";
import { Header } from "@/features/header/components/header";
import { FaqExplorer } from "@/features/faq/components/faq-explorer";
import { FaqHelp } from "@/features/faq/components/faq-help";
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
          className={styles.hero}
          title="Preguntas"
          accent="frecuentes"
          titleId="faq-title"
          description="Entender su alimentación también es cuidar. Encontrá respuestas para acompañar a tu manada, desde su primer plato."
          navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Preguntas frecuentes", path: "/preguntas-frecuentes" }]} />}
          actions={<ArrowCta href="#respuestas" label="Encontrar mi respuesta" tone="light" />}
          media={<div className={styles.heroArtwork}><Image src="/images/pets/dog-caring-for-cat-v2.svg" alt="" width={1536} height={1024} /></div>}
        />
        <FaqExplorer />
        <FaqHelp />
      </main>
      <Footer />
    </>
  );
}
