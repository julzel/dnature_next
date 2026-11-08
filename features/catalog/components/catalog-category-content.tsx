import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import type { CSSProperties } from "react";
import { categoryFromSlug, isCategorySlug, prepareCatalog, productsForCategory } from "../lib/browse-catalog";
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
    return <section className={styles.results} role="alert">
      <div className={styles.resultsInner}>
        <h1>No pudimos cargar esta categoría</h1>
        <p>Intentá de nuevo en un momento.</p>
        <CatalogRetry />
      </div>
    </section>;
  }

  const prepared = prepareCatalog(catalog, buckets);
  const category = categoryFromSlug(prepared.categories, slug);
  if (!category) notFound();
  const products = productsForCategory(prepared.listings, category.id);

  return <>
    <section className={styles.categoryHero} style={{ "--shelf-accent": category.color } as CSSProperties} aria-labelledby="category-title">
      <div className={styles.categoryHeroInner}>
        <Link href="/productos" className={styles.backLink}><ArrowLeft size={20} aria-hidden="true" /> Todos los productos</Link>
        <p className={styles.categoryKicker}>Familia de productos</p>
        <h1 id="category-title">{category.label}</h1>
        <p>Explorá todos los productos de esta categoría y consultá sus precios y disponibilidad.</p>
      </div>
    </section>
    <section className={styles.categoryCollection} style={{ "--shelf-accent": category.color } as CSSProperties} aria-labelledby="category-products-title">
      <div className={styles.resultsInner}>
        <div className={styles.resultHeading}>
          <div><p className={styles.sectionLabel}>Según ventas de los últimos 30 días</p><h2 id="category-products-title">Todos los productos</h2></div>
          <p>{products.length} {products.length === 1 ? "producto" : "productos"}</p>
        </div>
        <ol className={styles.categoryGrid} aria-label={`Productos de ${category.label}`}>
          {products.map((product) => <CatalogProductPreview key={product.sku} product={product} headingLevel={3} />)}
        </ol>
      </div>
    </section>
  </>;
}
