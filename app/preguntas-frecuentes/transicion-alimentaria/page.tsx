import Image from "next/image";
import { ArrowCta } from "@/components/arrow-cta";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { FaqHelp } from "@/features/faq/components/faq-help";
import { TransitionGuide } from "@/features/faq/components/transition-guide";
import { Footer } from "@/features/footer/components/footer";
import { Header } from "@/features/header/components/header";
import { pageMetadata } from "@/lib/seo/metadata";
import styles from "@/features/faq/components/faq.module.css";

export const metadata = pageMetadata({
  path: "/preguntas-frecuentes/transicion-alimentaria",
  title: "Cómo hacer la transición a una dieta natural",
  description: "Una guía paso a paso para cambiar la alimentación de tu perro o gato: elegir su receta, introducirla gradualmente y saber cuándo avanzar o consultar.",
});

export default function TransitionPage() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header solid />
      <main id="contenido">
        <PageHero
          className={styles.hero}
          title="Transición"
          accent="alimentaria"
          titleId="transition-title"
          description="Un nuevo plato, a su ritmo. Acompañá el cambio de alimentación de tu perro o gato con pasos pequeños y mucha observación."
          navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Preguntas frecuentes", path: "/preguntas-frecuentes" }, { name: "Transición alimentaria", path: "/preguntas-frecuentes/transicion-alimentaria" }]} />}
          actions={<ArrowCta href="#paso-a-paso" label="Ver el paso a paso" tone="light" />}
          media={<div className={styles.heroArtwork}><Image src="/images/pets/dog-caring-for-cat-v2.svg" alt="" width={1536} height={1024} /></div>}
        />
        <TransitionGuide />
        <FaqHelp />
      </main>
      <Footer />
    </>
  );
}
