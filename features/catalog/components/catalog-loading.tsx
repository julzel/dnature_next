import Link from "next/link";
import styles from "./catalog-page.module.css";

export function CatalogLoading() {
  return (
    <section className={styles.results} aria-label="Catálogo de productos" role="status">
      <div className={styles.resultsInner}>
        <p className={styles.sectionLabel}>Cargando catálogo…</p>
        <div className={styles.loadingLines} aria-hidden="true"><span /><span /><span /><span /></div>
        <noscript><p>Activá JavaScript para explorar y filtrar el catálogo. También podés <Link href="/#contacto" prefetch={false}>contactarnos para consultar productos</Link>.</p></noscript>
      </div>
    </section>
  );
}
