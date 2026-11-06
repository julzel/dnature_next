import { brand } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { Header } from "@/features/header/components/header";
import { Hero } from "@/features/hero/components/hero";
import { ExperienceOptions } from "@/features/experience/components/experience-options";
import { ExperienceSection } from "@/features/experience/components/experience-section";
import { PetExperience } from "@/features/experience/components/pet-experience";
import { Contact } from "@/features/contact/components/contact";
import { Footer } from "@/features/footer/components/footer";

export const metadata = pageMetadata({
  path: "/",
  title: brand.tagline,
  description: brand.description,
  indexable: false,
});

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ExperienceOptions />
        <ExperienceSection
          id="experiencia-personalizada"
          label="Cuéntanos sobre tu mascota"
          eyebrowColor="#092f39"
          eyebrowLineColor="#092f39"
        >
          <PetExperience />
        </ExperienceSection>
        <ExperienceSection id="explorar" label="Variedad y salud" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
