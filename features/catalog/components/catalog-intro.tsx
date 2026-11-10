import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function CatalogIntro() {
  return (
    <PageHero
      title="Productos"
      accent="DNAture"
      titleId="catalog-title"
      description="Encontrá lo que buscás por familia o por nombre. Información clara para explorar a tu ritmo."
      navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Productos", path: "/productos" }]} />}
      catalogRail
    />
  );
}
