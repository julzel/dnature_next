import { brand } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { Header } from "@/features/header/components/header";
import { Hero } from "@/features/hero/components/hero";
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
        <Contact />
      </main>
      <Footer />
    </>
  );
}
