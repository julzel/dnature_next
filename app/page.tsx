import { brand } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { Header } from "@/features/header/components/header";
import { Hero } from "@/features/hero/components/hero";
import { ExperienceOptions } from "@/features/experience/components/experience-options";
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
        <Contact />
      </main>
      <Footer />
    </>
  );
}
