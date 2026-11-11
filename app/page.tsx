import { Suspense } from "react";
import { brand } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { Header } from "@/features/header/components/header";
import { Hero } from "@/features/hero/components/hero";
import { ExperienceArrivalDialog } from "@/features/experience/components/experience-arrival-dialog";
import { ExperienceSection } from "@/features/experience/components/experience-section";
import { PetExperience } from "@/features/experience/components/pet-experience";
import { Contact } from "@/features/contact/components/contact";
import { Footer } from "@/features/footer/components/footer";
import { BestSellingSnacks } from "@/features/catalog/components/best-selling-snacks";
import { BestSellingSnacksLoading } from "@/features/catalog/components/best-selling-snacks-loading";

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
      <ExperienceArrivalDialog />
      <main>
        <Hero />
        <ExperienceSection
          id="experiencia-personalizada"
          label="Cuéntanos sobre tu mascota"
        >
          <PetExperience />
        </ExperienceSection>
        <ExperienceSection id="explorar" label="Variedad de deshidratados" showEyebrow={false}>
          <Suspense fallback={<BestSellingSnacksLoading />}>
            <BestSellingSnacks />
          </Suspense>
        </ExperienceSection>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
