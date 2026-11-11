"use client";

import Link from "next/link";
import { useId, useRef, useState, useTransition, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import contact from "@/features/contact/data/contact.json";
import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import { validateCartItemAction } from "@/features/cart/actions/validate-cart-item";
import { getCartItems, saveValidatedCartItem, useCart } from "@/features/cart/lib/cart-store";
import { CartStorageError } from "@/features/cart/lib/cart-storage";
import type { ProductOption } from "../types/product";
import { ProductQuantity } from "./product-quantity";
import { maximumQuantity, quantityError } from "../lib/product-quantity";
import styles from "./product-detail.module.css";

export function ProductOptions({ parentSku, name, options, url, profile, precautions }: { parentSku: string; name: string; options: ProductOption[]; url: string; profile?: ReactNode; precautions?: ReactNode }) {
  const groupId = useId();
  const initial = [...options].sort((a, b) => Number(b.inStock) - Number(a.inStock) || (a.price ?? Infinity) - (b.price ?? Infinity))[0];
  const [currentOptions, setCurrentOptions] = useState(options);
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [quantity, setQuantity] = useState("1");
  const [feedback, setFeedback] = useState<{ error: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const submitting = useRef(false);
  const cart = useCart();
  const selected = currentOptions.find((option) => option.sku === sku);
  const available = selected?.inStock ?? false;
  const maximum = maximumQuantity(selected?.quantityAvailable ?? null);
  const invalidQuantity = quantityError(quantity, maximum);
  const canAdd = available && selected?.price != null && !invalidQuantity && !pending && cart.ready && !cart.error;
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const message = `Hola, me interesa ${name}${selected ? ` (${selected.name}, SKU: ${selected.sku})` : ""}.${!invalidQuantity ? ` Cantidad: ${quantity}.` : ""} ${available ? "Quisiera consultar cómo pedirlo." : "¿Me pueden confirmar su disponibilidad?"}\n${url}`;
  const inquiryUrl = `${contact.whatsapp.url}?text=${encodeURIComponent(message)}`;

  function handleOptionChange(event: ChangeEvent<HTMLInputElement>) { setSku(event.currentTarget.value); setFeedback(null); }
  function handleQuantityChange(value: string) { setQuantity(value); setFeedback(null); }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canAdd || !selected || selected.price === null || submitting.current) return;
    submitting.current = true;
    const selection = selected;
    setFeedback(null);
    startTransition(async function addSelectedItem() {
      try {
        const previousQuantity = getCartItems().find((item) => item.sku === selection.sku)?.quantity ?? 0;
        const result = await validateCartItemAction({ parentSku, sku: selection.sku, quantity: previousQuantity + Number(quantity), expectedPrice: selection.price! });
        if (!result.ok) {
          if (result.options) setCurrentOptions(result.options);
          setFeedback({ error: true, message: result.message });
          return;
        }
        saveValidatedCartItem(result.item, previousQuantity);
        setFeedback({ error: false, message: "Producto agregado al carrito." });
      } catch (error) {
        setFeedback({ error: true, message: error instanceof CartStorageError ? error.message : "No pudimos agregar el producto. Conservamos tu selección; intentá de nuevo." });
      } finally { submitting.current = false; }
    });
  }

  return <form className={styles.options} onSubmit={handleSubmit} aria-busy={pending}>
    <div className={styles.offer} role="status" aria-live="polite" aria-atomic="true">
      <p className={styles.price}>{selected?.price != null ? formatCatalogPrice(selected.price) : "Precio a consultar"}</p>
      <p className={styles.availability} data-available={available}>{available ? "Disponible" : "Agotado"}</p>
    </div>
    {profile}
    {currentOptions.length > 1 && <fieldset className={styles.presentations} disabled={pending}>
      <legend>Presentación</legend>
      {currentOptions.map((option) => <label key={option.sku} className={styles.presentation} data-available={option.inStock}>
        <input type="radio" name={groupId} value={option.sku} checked={sku === option.sku} onChange={handleOptionChange} />
        <span>{option.name}<small>{option.inStock ? "Disponible" : "Agotado"}</small></span>
        <span className={styles.optionPrice}>{option.price === null ? "Consultar" : formatCatalogPrice(option.price)}</span>
      </label>)}
    </fieldset>}
    {precautions}
    <div className={styles.purchaseActions}>
      <ProductQuantity value={quantity} maximum={maximum} disabled={!available || pending} onChange={handleQuantityChange} />
      <button className={styles.primaryAction} type="submit" disabled={!canAdd}>
        <span>{pending ? "Agregando…" : "Agregar al carrito"}</span><ShoppingCart size={20} aria-hidden="true" />
      </button>
    </div>
    {feedback && <p className={styles.cartFeedback} role={feedback.error ? "alert" : "status"}>{feedback.message}</p>}
    {cart.error && <p className={styles.fieldError} role="alert">{cart.error} <Link href="/carrito">Revisar carrito</Link></p>}
    <div className={styles.supportLinks}>
      {count > 0 && <Link href="/carrito">Ver carrito <span>({count})</span></Link>}
      <a href={inquiryUrl} target="_blank" rel="noopener noreferrer">¿Tenés dudas sobre este producto? Consultanos.<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (abre en otra pestaña)</span></a>
    </div>
    {!available && <p className={styles.purchaseNote}>Esta presentación está agotada. Consultanos o explorá otras opciones del catálogo.</p>}
    <noscript><p>Activá JavaScript para seleccionar la cantidad y agregar al carrito.</p></noscript>
  </form>;
}
