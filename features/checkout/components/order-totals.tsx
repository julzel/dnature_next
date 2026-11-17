import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import type { OrderTotals as Totals } from "../types/order";
import styles from "./checkout.module.css";

export function OrderTotals({ totals, deliveryLabel = "Por definir" }: { totals: Totals; deliveryLabel?: string }) {
  return <dl className={styles.totals}>
    <div><dt>Subtotal de productos</dt><dd>{formatCatalogPrice(totals.subtotal)}</dd></div>
    <div><dt>IVA (13%)</dt><dd>{formatCatalogPrice(totals.iva)}</dd></div>
    <div><dt>Envío</dt><dd>{totals.delivery === null ? deliveryLabel : totals.delivery === 0 ? "Sin costo · retiro" : formatCatalogPrice(totals.delivery)}</dd></div>
    <div className={styles.total}><dt>{totals.delivery === null ? "Total sin envío" : "Total"}</dt><dd>{formatCatalogPrice(totals.total)}</dd></div>
  </dl>;
}
