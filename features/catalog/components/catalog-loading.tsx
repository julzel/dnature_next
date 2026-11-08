import styles from "./catalog-page.module.css";

export function CatalogLoading() {
  return (
    <section className={styles.results} aria-label="Catálogo de productos" role="status">
      <div className={styles.resultsInner}>
        <p className={styles.sectionLabel}>Cargando catálogo…</p>
        <div className={styles.loadingLines} aria-hidden="true"><span /><span /><span /><span /></div>
      </div>
    </section>
  );
}
