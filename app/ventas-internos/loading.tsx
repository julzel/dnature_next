import styles from "@/features/sales/components/sales-dashboard.module.css";

export default function InternalSalesLoading() {
  return <main className={styles.page}><div className={styles.container}>
    <p className={styles.eyebrow}>Solo desarrollo</p>
    <h1>Ventas internas</h1>
    <p role="status" className={styles.loading}>Cargando órdenes y productos de Avify…</p>
  </div></main>;
}
