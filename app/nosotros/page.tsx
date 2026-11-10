import { JsonLd } from "@/components/json-ld";
import { Header } from "@/features/header/components/header";
import { Footer } from "@/features/footer/components/footer";
import { AboutHero } from "@/features/about/components/about-hero";
import { AboutPurpose } from "@/features/about/components/about-purpose";
import { AboutDirection } from "@/features/about/components/about-direction";
import { AboutEssence } from "@/features/about/components/about-essence";
import { AboutInvitation } from "@/features/about/components/about-invitation";
import { aboutDescription } from "@/features/about/data/about-content";
import { canonicalUrl } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";
import styles from "@/features/about/components/about.module.css";

export const metadata = pageMetadata({
  path: "/nosotros",
  title: "Quiénes somos",
  description: aboutDescription,
});

export default function About() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header solid />
      <main id="contenido">
        <AboutHero />
        <nav className={styles.sectionNav} aria-label="En esta página">
          <div className={styles.container}>
            <a href="#proposito">Nuestro propósito</a>
            <a href="#direccion">Misión y visión</a>
            <a href="#esencia">Nuestra esencia</a>
            <a href="#acompanamiento">Sigamos cerca</a>
          </div>
        </nav>
        <AboutPurpose />
        <AboutDirection />
        <AboutEssence />
        <AboutInvitation />
      </main>
      <Footer />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "Quiénes somos | DNAture",
        description: aboutDescription,
        url: canonicalUrl("/nosotros"),
        inLanguage: "es-CR",
        about: { "@type": "Organization", name: "DNAture", url: canonicalUrl("/") },
      }} />
    </>
  );
}
