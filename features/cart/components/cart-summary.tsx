import { ArrowRight } from "lucide-react";
import { OrderTotals } from "@/features/checkout/components/order-totals";
import { orderTotals } from "@/features/checkout/lib/checkout";
import contact from "@/features/contact/data/contact.json";
import type { CartItem } from "../types/cart";
import styles from "./cart.module.css";

export function CartSummary({ items, blocked, onContinue }: { items: CartItem[]; blocked: boolean; onContinue: () => void }) {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return <aside className={styles.summary} aria-labelledby="cart-summary-heading">
    <h2 id="cart-summary-heading">Resumen de compra</h2>
    <p className={styles.summaryCount}>Productos seleccionados <strong>({count})</strong></p>
    <OrderTotals totals={orderTotals(items, "", "")} deliveryLabel="Por calcular" />
    <p className={styles.note}>El total incluye el 13% de IVA sobre los productos. Calcularemos el envío cuando elijás cómo recibir tu pedido.</p>
    {blocked && <p role="status" className={styles.note}>Actualizá las cantidades pendientes o resolvé el error del carrito para continuar.</p>}
    <button className={styles.continue} type="button" onClick={onContinue} disabled={blocked}><span>Continuar al pedido</span><ArrowRight size={18} aria-hidden="true" /></button>
    <p className={styles.note}>¿Necesitás orientación? <a href={contact.whatsapp.url} target="_blank" rel="noopener noreferrer">Consultá con DNAture<span className="sr-only"> (abre en otra pestaña)</span></a> antes de completar tu pedido.</p>
  </aside>;
}
