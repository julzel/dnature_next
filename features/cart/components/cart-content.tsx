"use client";

import Link from "next/link";
import { useState } from "react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { clearCart, useCart } from "../lib/cart-store";
import { CartItemRow } from "./cart-item-row";
import styles from "./cart.module.css";

export function CartContent() {
  const cart = useCart();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const hasEdits = cart.items.some((item) => editing[`${item.sku}:${item.quantity}:${item.price}`]);
  function handleItemEditing(key: string, isEditing: boolean) { setEditing((previous) => ({ ...previous, [key]: isEditing })); }
  function handleClear() { try { clearCart(); setError(null); } catch { setError("No pudimos vaciar el carrito. Revisá el almacenamiento del navegador e intentá de nuevo."); } }
  return <div className={styles.page}>
    <SectionEyebrow label="Tu selección" /><h1>Tu carrito</h1>
    {!cart.ready && <p role="status">Cargando carrito…</p>}
    {(cart.error || error) && <p role="alert">{error || cart.error}</p>}
    {cart.ready && !cart.items.length && !cart.error && <p>Tu carrito está vacío. Explorá los productos para empezar.</p>}
    {cart.items.length > 0 && <div className={styles.layout}>
      <section className={styles.selection} aria-labelledby="cart-products-heading">
        <h2 id="cart-products-heading">Tu selección</h2>
        <ul className={styles.items}>{cart.items.map((item) => <CartItemRow key={item.sku} item={item} onEditingChange={handleItemEditing} />)}</ul>
        <p>Tu carrito se guarda en este navegador. Verificaremos de nuevo los precios y la disponibilidad al generar el pedido.</p>
      </section>
      <CheckoutForm items={cart.items} blocked={Boolean(cart.error) || hasEdits} />
    </div>}
    <div className={styles.links}><Link href="/productos">Seguir explorando productos</Link>{(cart.items.length > 0 || cart.error) && <button type="button" onClick={handleClear}>Vaciar carrito</button>}</div>
    <noscript><p>Activá JavaScript para ver y administrar el carrito guardado en este navegador.</p></noscript>
  </div>;
}
