import { JsonLd } from "@/components/json-ld";
import { Header } from "@/features/header/components/header";
import { Footer } from "@/features/footer/components/footer";
import { AboutHero } from "@/features/about/components/about-hero";
import { AboutSectionNav } from "@/features/about/components/about-section-nav";
import { AboutPurpose } from "@/features/about/components/about-purpose";
import { AboutDirection } from "@/features/about/components/about-direction";
import { AboutEssence } from "@/features/about/components/about-essence";
import { AboutInvitation } from "@/features/about/components/about-invitation";
import { aboutDescription } from "@/features/about/data/about-content";
import { canonicalUrl } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";

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
        <AboutSectionNav />
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
