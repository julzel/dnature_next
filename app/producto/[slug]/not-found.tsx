import Link from "next/link";
import styles from "@/features/product/components/product-detail.module.css";

export default function ProductNotFound() {
  return <div className={styles.page}><div className={styles.container}><div className={styles.failure}>
    <h1>Producto no encontrado</h1>
    <p>Este producto no está publicado en el catálogo actual.</p>
    <Link href="/productos" className={styles.primaryAction}>Explorar productos</Link>
  </div></div></div>;
}
