"use client";

import Link from "next/link";
import { useState } from "react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { CheckoutForm } from "@/features/checkout/components/checkout-form";
import { clearCart, useCart } from "../lib/cart-store";
import { CartItemRow } from "./cart-item-row";
import { CartProgress, type CartStep } from "./cart-progress";
import { CartSummary } from "./cart-summary";
import styles from "./cart.module.css";

export function CartContent() {
  const cart = useCart();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState<CartStep>("cart");
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const hasEdits = cart.items.some((item) => editing[`${item.sku}:${item.quantity}:${item.price}`]);
  function handleItemEditing(key: string, isEditing: boolean) { setEditing((previous) => ({ ...previous, [key]: isEditing })); }
  function handleClear() { try { clearCart(); setError(null); } catch { setError("No pudimos vaciar el carrito. Revisá el almacenamiento del navegador e intentá de nuevo."); } }
  function handleContinue() { setStep("details"); requestAnimationFrame(function focusDetails() { document.getElementById("checkout-title")?.focus(); }); }
  function handleBack() { setStep("cart"); requestAnimationFrame(function focusSelection() { document.getElementById("cart-products-heading")?.focus(); }); }
  return <div className={styles.page}>
    <header className={styles.intro}><SectionEyebrow label="Tu selección" /><h1>Tu carrito.</h1><p>Una vista clara de lo que elegiste, con espacio para revisar cada detalle antes de continuar.</p></header>
    {!cart.ready && <p role="status">Cargando carrito…</p>}
    {(cart.error || error) && <p role="alert">{error || cart.error}</p>}
    {cart.ready && !cart.items.length && !cart.error && <p>Tu carrito está vacío. Explorá los productos para empezar.</p>}
    {cart.items.length > 0 && <>
      <CartProgress step={step} onBack={handleBack} />
      <div hidden={step !== "cart"}>
      <div className={styles.layout}>
      <section className={styles.selection} aria-labelledby="cart-products-heading">
        <h2 id="cart-products-heading" tabIndex={-1}>Productos seleccionados <span>({count})</span></h2>
        <p>Podés ajustar las cantidades o quitar un producto de tu selección.</p>
        <ul className={styles.items}>{cart.items.map((item) => <CartItemRow key={item.sku} item={item} onEditingChange={handleItemEditing} />)}</ul>
      </section>
      <CartSummary items={cart.items} blocked={Boolean(cart.error) || hasEdits} onContinue={handleContinue} />
      </div>
      </div>
      <div hidden={step === "cart"} className={styles.checkoutStage}><CheckoutForm items={cart.items} blocked={Boolean(cart.error) || hasEdits} hidden={step === "cart"} onStepChange={setStep} /></div>
    </>}
    <div className={styles.links}><Link href="/productos">Seguir explorando productos</Link>{(cart.items.length > 0 || cart.error) && <button type="button" onClick={handleClear}>Vaciar carrito</button>}</div>
    <noscript><p>Activá JavaScript para ver y administrar el carrito guardado en este navegador.</p></noscript>
  </div>;
}
