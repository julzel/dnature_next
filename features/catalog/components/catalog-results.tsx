import Link from "next/link";
import { connection } from "next/server";
import { browseCatalog, prepareCatalog } from "../lib/browse-catalog";
import { getBrowseCatalogProducts } from "../server/catalog";
import { getRecentCatalogSales } from "../server/recent-sales";
import { CatalogCategoryNav } from "./catalog-category-nav";
import { CatalogCategoryShelf } from "./catalog-category-shelf";
import { CatalogRetry } from "./catalog-retry";
import { CatalogSearchForm } from "./catalog-search-form";
import styles from "./catalog-page.module.css";

type SearchParams = Promise<{ q?: string | string[]; categoria?: string | string[] }>;

function single(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export async function CatalogResults({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const params = await searchParams;
  let catalog;
  let buckets;
  try {
    [catalog, buckets] = await Promise.all([getBrowseCatalogProducts(), getRecentCatalogSales()]);
  } catch {
    return (
      <section className={styles.results} aria-label="Catálogo de productos">
        <div className={styles.resultsInner} role="alert">
          <h2>No pudimos cargar el catálogo</h2>
          <p>Intentá de nuevo en un momento.</p>
          <CatalogRetry />
        </div>
      </section>
    );
  }

  const prepared = prepareCatalog(catalog, buckets);
  const query = single(params.q).slice(0, 100);
  const requestedCategory = single(params.categoria);
  const categoryId = prepared.categories.some((category) => category.id === requestedCategory) ? requestedCategory : "";
  const view = browseCatalog(prepared.listings, prepared.categories, { query, categoryId });

  return (
    <section className={styles.results} aria-label="Catálogo de productos">
      <div className={styles.resultsInner}>
        <div className={styles.tools}>
          <CatalogSearchForm query={view.query} categoryId={categoryId} />
          <CatalogCategoryNav categories={prepared.categories} activeId={categoryId} query={view.query} />
        </div>
        <div className={styles.resultHeading}>
          <div><p className={styles.sectionLabel}>Según ventas de los últimos 30 días</p><h2>Los más elegidos</h2></div>
          <p role="status">{view.shelves.length} {view.shelves.length === 1 ? "categoría" : "categorías"} · hasta cinco productos por categoría</p>
        </div>
        {view.shelves.length ? (
          <div className={styles.shelves}>
            {view.shelves.map((shelf) => <CatalogCategoryShelf key={shelf.category.id} shelf={shelf} />)}
          </div>
        ) : (
          <div className={styles.emptyState} role="status">
            <p>No encontramos productos con esos filtros.</p>
            <Link href="/productos">Ver todos los productos</Link>
          </div>
        )}
      </div>
    </section>
  );
}
