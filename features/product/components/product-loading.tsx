import Link from "next/link";
import contact from "@/features/contact/data/contact.json";
import styles from "./product-detail.module.css";

export function ProductLoading() {
  return <div className={styles.page}>
    <div className={styles.container}>
      <div className={styles.loadingPlaceholder} aria-busy="true">
        <p role="status" className="sr-only">Cargando producto…</p>
        <div aria-hidden="true">
          <div className={styles.skeletonBreadcrumb} />
          <div className={styles.overview}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonSummary}>
              <span className={styles.skeletonLabel} />
              <span className={styles.skeletonTitle} />
              <span className={styles.skeletonTitle} />
              <span className={styles.skeletonPrice} />
              <span className={styles.skeletonOption} />
              <span className={styles.skeletonOption} />
              <span className={styles.skeletonAction} />
            </div>
          </div>
        </div>
      </div>
      <noscript><div className={styles.failure}>
        <h1>Consultá este producto</h1>
        <p>Activá JavaScript para ver la ficha interactiva, o contactanos para consultar ingredientes, presentaciones y disponibilidad.</p>
        <a className={styles.primaryAction} href={contact.whatsapp.url}>Consultar por WhatsApp</a>
        <Link href="/productos">Volver al catálogo</Link>
      </div></noscript>
    </div>
  </div>;
}
