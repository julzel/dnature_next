import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/features/header/components/header";
import { Footer } from "@/features/footer/components/footer";
import { CatalogCategoryContent } from "@/features/catalog/components/catalog-category-content";
import { CatalogLoading } from "@/features/catalog/components/catalog-loading";
import { categoryFromSlug, isCategorySlug, prepareCatalog } from "@/features/catalog/lib/browse-catalog";
import { getBrowseCatalogProducts } from "@/features/catalog/server/catalog";
import { pageMetadata } from "@/lib/seo/metadata";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  if (!isCategorySlug(slug)) notFound();
  const path = `/productos/categoria/${slug}`;
  let catalog;
  try {
    catalog = await getBrowseCatalogProducts();
  } catch {
    return pageMetadata({ path, title: "Categoría de productos", description: "Explorá los productos DNAture por categoría.", indexable: false });
  }
  const category = categoryFromSlug(prepareCatalog(catalog).categories, slug);
  if (!category) notFound();
  return pageMetadata({
    path,
    title: `${category.label} | Productos`,
    description: `Explorá todos los productos de ${category.label} de DNAture. Consultá imágenes, precios y disponibilidad.`,
  });
}

export default function ProductCategoryPage({ params }: { params: Params }) {
  return <>
    <Header solid />
    <main id="contenido">
      <Suspense fallback={<CatalogLoading />}>
        <CatalogCategoryContent params={params} />
      </Suspense>
    </main>
    <Footer />
  </>;
}
