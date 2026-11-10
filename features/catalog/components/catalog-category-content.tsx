import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { categoryFromSlug, categoryStyle, isCategorySlug, prepareCatalog, productsForCategory } from "../lib/browse-catalog";
import { getBrowseCatalogProducts } from "../server/catalog";
import { getRecentCatalogSales } from "../server/recent-sales";
import { CatalogProductPreview } from "./catalog-product-preview";
import { CatalogRetry } from "./catalog-retry";
import styles from "./catalog-page.module.css";

export async function CatalogCategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  if (!isCategorySlug(slug)) notFound();

  let catalog;
  let buckets;
  try {
    [catalog, buckets] = await Promise.all([getBrowseCatalogProducts(), getRecentCatalogSales()]);
  } catch {
    return <>
      <PageHero title="Categoría de" accent="productos" titleId="category-title" description="Explorá los productos de cada categoría." navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Productos", path: "/productos" }, { name: "Categoría", path: `/productos/categoria/${slug}` }]} />} />
      <section className={styles.results} role="alert">
        <div className={styles.resultsInner}>
          <h2>No pudimos cargar esta categoría</h2>
          <p>Intentá de nuevo en un momento.</p>
          <CatalogRetry />
        </div>
      </section>
    </>;
  }

  const prepared = prepareCatalog(catalog, buckets);
  const category = categoryFromSlug(prepared.categories, slug);
  if (!category) notFound();
  const products = productsForCategory(prepared.listings, category.id);

  return <>
    <PageHero
      title={category.label}
      titleId="category-title"
      description="Explorá todos los productos de esta categoría y consultá sus precios y disponibilidad."
      railColor={category.color}
      navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Productos", path: "/productos" }, { name: category.label, path: `/productos/categoria/${slug}` }]} />}
    />
    <section className={styles.categoryCollection} style={categoryStyle(category)} aria-labelledby="category-products-title">
      <div className={styles.resultsInner}>
        <div className={styles.resultHeading}>
          <h2 id="category-products-title">Todos los productos</h2>
          <p>{products.length} {products.length === 1 ? "producto" : "productos"}</p>
        </div>
        <ol className={styles.categoryGrid} aria-label={`Productos de ${category.label}`}>
          {products.map((product) => <CatalogProductPreview key={product.sku} product={product} headingLevel={3} />)}
        </ol>
      </div>
    </section>
  </>;
}
