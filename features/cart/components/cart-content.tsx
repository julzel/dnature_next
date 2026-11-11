"use client";

import Link from "next/link";
import { useState } from "react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import contact from "@/features/contact/data/contact.json";
import { clearCart, useCart } from "../lib/cart-store";
import { CartItemRow } from "./cart-item-row";
import styles from "./cart.module.css";

export function CartContent({ origin }: { origin: string }) {
  const cart = useCart();
  const [error, setError] = useState<string | null>(null);
  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Hola, quisiera consultar este pedido:\n${cart.items.map((item) => `${item.quantity} × ${item.name} (${item.presentation}, SKU: ${item.sku}) · ${formatCatalogPrice(item.price)} por unidad\n${new URL(item.path, origin).href}`).join("\n")}\nSubtotal de productos: ${formatCatalogPrice(total)}. Quisiera confirmar disponibilidad y entrega.`;
  function handleClear() { try { clearCart(); setError(null); } catch { setError("No pudimos vaciar el carrito. Revisá el almacenamiento del navegador e intentá de nuevo."); } }
  return <div className={styles.page}>
    <SectionEyebrow label="Tu selección" /><h1>Tu carrito</h1>
    {!cart.ready && <p role="status">Cargando carrito…</p>}
    {(cart.error || error) && <p role="alert">{error || cart.error}</p>}
    {cart.ready && !cart.items.length && !cart.error && <p>Tu carrito está vacío. Explorá los productos para empezar.</p>}
    {cart.items.length > 0 && <>
      <ul className={styles.items}>{cart.items.map((item) => <CartItemRow key={item.sku} item={item} />)}</ul>
      <div className={styles.totals}><span>Subtotal de productos</span><strong>{formatCatalogPrice(total)}</strong></div>
      <p>El carrito se guarda en este navegador. La disponibilidad y el precio se verifican al agregar o actualizar productos; la entrega y el total final se coordinan con nuestro equipo.</p>
      {!cart.error && <a className={styles.primaryAction} href={`${contact.whatsapp.url}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Consultar pedido por WhatsApp<span className="sr-only"> (abre en otra pestaña)</span></a>}
    </>}
    <div className={styles.links}><Link href="/productos">Seguir explorando productos</Link>{(cart.items.length > 0 || cart.error) && <button type="button" onClick={handleClear}>Vaciar carrito</button>}</div>
    <noscript><p>Activá JavaScript para ver y administrar el carrito guardado en este navegador.</p></noscript>
  </div>;
}
