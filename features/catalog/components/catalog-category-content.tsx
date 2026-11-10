import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import Link from "next/link";
import { categoryFromSlug, categoryStyle, filterCatalog, isCategorySlug, prepareCatalog } from "../lib/browse-catalog";
import { catalogFilterUrl } from "../lib/catalog-filter-url";
import { getBrowseCatalogProducts } from "../server/catalog";
import { CatalogProductPreview } from "./catalog-product-preview";
import { CatalogRetry } from "./catalog-retry";
import styles from "./catalog-page.module.css";

export async function CatalogCategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  if (!isCategorySlug(slug)) notFound();

  let catalog;
  try {
    catalog = await getBrowseCatalogProducts();
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

  const prepared = prepareCatalog(catalog);
  const category = categoryFromSlug(prepared.categories, slug);
  if (!category) notFound();
  const filters = { query: "", categoryIds: [category.id], inStockOnly: false, sort: "relevance" as const };
  const view = filterCatalog(prepared.listings, prepared.categories, filters);

  return <>
    <PageHero
      title={category.label}
      titleId="category-title"
      description="Explorá todos los productos de esta categoría y consultá sus precios y disponibilidad."
      railColor={category.color}
      navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Productos", path: "/productos" }, { name: category.label, path: `/productos/categoria/${slug}` }]} />}
    />
    <section className={styles.results} style={categoryStyle(category)} aria-label={`Productos de ${category.label}`}>
      <div className={styles.resultsInner}>
        <div className={styles.resultHeading}>
          <div><h2>Todos los productos</h2><p>{view.total} productos</p></div>
          <Link className={styles.catalogBrowseLink} href={catalogFilterUrl(filters, prepared.categories)}>Buscar y filtrar {category.label}</Link>
        </div>
        <ul className={styles.productGrid}>
          {view.products.map((product) => <CatalogProductPreview key={product.sku} product={product} categories={prepared.categories} />)}
        </ul>
      </div>
    </section>
  </>;
}
