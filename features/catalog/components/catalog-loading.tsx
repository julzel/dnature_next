import Link from "next/link";
import { CatalogProductSkeleton } from "./catalog-product-skeleton";
import styles from "./catalog-page.module.css";

const skeletonItems = [1, 2, 3, 4, 5, 6];
const skeletonFilters = [1, 2, 3, 4, 5];

export function CatalogLoading() {
  return (
    <section id="catalogo" className={styles.results} aria-label="Catálogo de productos" aria-busy="true">
      <div className={styles.resultsInner}>
        <p className="sr-only" role="status">Cargando catálogo…</p>
        <div className={styles.skeletonContent} aria-hidden="true">
          <div className={styles.tools}>
            <div className={styles.searchForm}>
              <span className={styles.skeletonSearchLabel}>Buscar productos</span>
              <div className={styles.searchControls}>
                <span className={`${styles.skeletonBlock} ${styles.skeletonSearchText}`} />
                <span className={`${styles.skeletonBlock} ${styles.skeletonSearchAction}`} />
              </div>
            </div>
            <span className={styles.skeletonMobileFilter} />
          </div>
          <div className={styles.collectionLayout}>
            <aside className={styles.skeletonFilters}>
              <div className={styles.skeletonFilterGroup}>
                <span className={styles.skeletonFilterHeading}>Categorías</span>
                {skeletonFilters.map((item) => <span key={item} className={styles.skeletonFilterRow}><span className={styles.skeletonBlock} /><span className={styles.skeletonBlock} /></span>)}
              </div>
              <div className={styles.skeletonFilterGroup}>
                <span className={styles.skeletonFilterHeading}>Disponibilidad</span>
                <span className={styles.skeletonFilterRow}><span className={styles.skeletonBlock} /><span className={styles.skeletonBlock} /></span>
              </div>
            </aside>
            <div className={styles.collection}>
              <div className={styles.resultHeading}>
                <h2>Todos los productos</h2>
                <div className={styles.skeletonSort}>
                  <span>Ordenar</span>
                  <span className={`${styles.skeletonBlock} ${styles.skeletonSortControl}`} />
                </div>
              </div>
              <ul className={styles.productGrid}>
                {skeletonItems.map((item) => <CatalogProductSkeleton key={item} />)}
              </ul>
            </div>
          </div>
        </div>
        <noscript><p>Activá JavaScript para explorar y filtrar el catálogo. También podés <Link href="/#contacto" prefetch={false}>contactarnos para consultar productos</Link>.</p></noscript>
      </div>
    </section>
  );
}
