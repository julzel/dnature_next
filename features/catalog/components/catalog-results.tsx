import { connection } from "next/server";
import { prepareCatalog } from "../lib/browse-catalog";
import { getBrowseCatalogProducts } from "../server/catalog";
import { getRecentCatalogSales } from "../server/recent-sales";
import { CatalogBrowser } from "./catalog-browser";
import { CatalogRetry } from "./catalog-retry";
import styles from "./catalog-page.module.css";

export async function CatalogResults() {
  await connection();
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
  return <CatalogBrowser categories={prepared.categories} listings={prepared.listings} />;
}
