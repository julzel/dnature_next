import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function CatalogIntro() {
  return (
    <PageHero
      title="Productos"
      accent="DNAture"
      titleId="catalog-title"
      description="Explorá nuestro catálogo. Buscá por producto o ingrediente y encontrá lo que necesitás para su alimentación."
      navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Productos", path: "/productos" }]} />}
      catalogRail
    />
  );
}
