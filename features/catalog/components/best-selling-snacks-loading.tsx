import styles from "./best-selling-snacks.module.css";
import { CatalogProductSkeleton } from "./catalog-product-skeleton";

export function BestSellingSnacksLoading() {
  return (
    <div className={styles.content} aria-busy="true">
      <p className="sr-only" role="status">Cargando deshidratados…</p>
      <div className={styles.intro}>
        <h2>Variedad de deshidratados</h2>
      </div>
      <ul className={styles.grid} aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => <CatalogProductSkeleton key={index} />)}
      </ul>
    </div>
  );
}
