import { Header } from "@/features/header/components/header";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MyPets } from "@/features/experience/components/my-pets";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  path: "/mis-mascotas",
  title: "Mis mascotas",
  description: "Consultá los perfiles de tus mascotas guardados en este navegador.",
  indexable: false,
});

export default function MyPetsPage() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header solid />
      <main id="contenido">
        <PageHero
          title="Mis"
          accent="mascotas"
          titleId="pets-title"
          description="Consultá los perfiles de tus mascotas guardados en este navegador."
          navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Mis mascotas", path: "/mis-mascotas" }]} />}
        />
        <MyPets />
      </main>
    </>
  );
}
