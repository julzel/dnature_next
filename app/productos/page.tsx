import { Suspense } from "react";
import { Header } from "@/features/header/components/header";
import { Footer } from "@/features/footer/components/footer";
import { pageMetadata } from "@/lib/seo/metadata";
import { CatalogIntro } from "@/features/catalog/components/catalog-intro";
import { CatalogResults } from "@/features/catalog/components/catalog-results";
import { CatalogLoading } from "@/features/catalog/components/catalog-loading";

export const metadata = pageMetadata({
  path: "/productos",
  title: "Productos DNAture",
  description: "Explorá el catálogo de productos DNAture por familia o por nombre. Consultá imágenes, precios y disponibilidad actual de los productos publicados.",
});

type SearchParams = Promise<{ q?: string | string[]; categoria?: string | string[] }>;

export default function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <Header solid />
      <main id="contenido">
        <CatalogIntro />
        <Suspense fallback={<CatalogLoading />}>
          <CatalogResults searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
