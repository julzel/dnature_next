import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Breadcrumbs } from "@/components/breadcrumbs";
import wildPlate from "@/images/wild-plate-cutout.png";

export function CatalogIntro() {
  return (
    <PageHero
      title="Nuestros"
      accent="Productos"
      titleId="catalog-title"
      description="Explorá nuestro catálogo. Buscá por producto o ingrediente y encontrá lo que necesitás para su alimentación."
      navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Productos", path: "/productos" }]} />}
      media={<Image src={wildPlate} alt="" sizes="(min-width: 1750px) 1120px, (min-width: 1024px) 64vw, 100vw" loading="eager" />}
      catalogRail
    />
  );
}
