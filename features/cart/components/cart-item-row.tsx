"use client";

import Link from "next/link";
import Image from "next/image";
import { useId, useRef, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { Minus, Plus, RefreshCw, Trash2 } from "lucide-react";
import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import { quantityError } from "@/features/product/lib/product-quantity";
import { validateCartItemAction } from "../actions/validate-cart-item";
import { removeCartItem, saveValidatedCartItem } from "../lib/cart-store";
import { CartStorageError } from "../lib/cart-storage";
import type { CartItem } from "../types/cart";
import styles from "./cart.module.css";

export function CartItemRow({ item, onEditingChange }: { item: CartItem; onEditingChange: (key: string, editing: boolean) => void }) {
  const quantityId = useId();
  const submitting = useRef(false);
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [priceToConfirm, setPriceToConfirm] = useState<number | null>(null);
  const price = priceToConfirm ?? item.price;
  const [feedback, setFeedback] = useState<{ error: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [previousItem, setPreviousItem] = useState(item);
  if (previousItem.quantity !== item.quantity || previousItem.price !== item.price) {
    setPreviousItem(item);
    setQuantity(String(item.quantity));
    setPriceToConfirm(null);
  }
  const invalid = quantityError(quantity, undefined);
  const editingKey = `${item.sku}:${item.quantity}:${item.price}`;
  function handleQuantityChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    setQuantity(value); setFeedback(null);
    onEditingChange(editingKey, Boolean(quantityError(value, undefined)) || Number(value) !== item.quantity || priceToConfirm !== null);
  }
  function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateQuantity(quantity);
  }
  function handleDecrease() { const value = String(Math.max(1, Number(quantity) - 1)); setQuantity(value); updateQuantity(value); }
  function handleIncrease() { const value = String(Number(quantity) + 1); setQuantity(value); updateQuantity(value); }
  function updateQuantity(value: string) {
    if (pending || submitting.current || quantityError(value, undefined)) return;
    submitting.current = true;
    setFeedback(null);
    onEditingChange(editingKey, true);
    startTransition(async function updateQuantity() {
      try {
        const result = await validateCartItemAction({ parentSku: item.parentSku, sku: item.sku, quantity: Number(value), expectedPrice: price });
        if (!result.ok) {
          const updatedPrice = result.options?.find((option) => option.sku === item.sku)?.price;
          if (updatedPrice != null) setPriceToConfirm(updatedPrice);
          setFeedback({ error: true, message: result.message }); return;
        }
        saveValidatedCartItem(result.item, item.quantity);
        onEditingChange(editingKey, false);
        setPriceToConfirm(null);
        setFeedback({ error: false, message: "Carrito actualizado." });
      } catch (error) { setFeedback({ error: true, message: error instanceof CartStorageError ? error.message : "No pudimos actualizar el carrito. Intentá de nuevo." }); }
      finally { submitting.current = false; }
    });
  }
  function handleRemove() {
    try { removeCartItem(item.sku); onEditingChange(editingKey, false); }
    catch (error) { setFeedback({ error: true, message: error instanceof CartStorageError ? error.message : "No pudimos quitar el producto. Intentá de nuevo." }); }
  }
  return <li className={styles.item}>
    {item.imageUrl && <Link className={styles.image} href={item.path}><Image src={item.imageUrl} alt={item.name} width={96} height={96} /></Link>}
    <div className={styles.itemContent}>
      {item.category && <p className={styles.category}>{item.category}</p>}
      <h3><Link href={item.path}>{item.name}</Link></h3>
      <p>Presentación: {item.presentation}<br />Unidad: {formatCatalogPrice(item.price)}</p>
      <button className={styles.remove} type="button" onClick={handleRemove} disabled={pending} aria-label={`Quitar ${item.name} del carrito`}><Trash2 size={16} aria-hidden="true" /><span>Quitar producto</span></button>
      {priceToConfirm !== null && <p>Nuevo precio: {formatCatalogPrice(priceToConfirm)}. Actualizá para aceptarlo.</p>}
    </div>
    <div className={styles.itemPurchase}>
      <p className={styles.lineTotal}>{formatCatalogPrice(item.price * item.quantity)}</p>
      <form className={styles.itemActions} onSubmit={handleUpdate} aria-busy={pending}>
        <label className="sr-only" htmlFor={quantityId}>Cantidad</label>
        <div className={styles.stepper}>
          <button type="button" onClick={handleDecrease} disabled={pending || Number(quantity) <= 1} aria-label={`Disminuir cantidad de ${item.name}`}><Minus size={16} aria-hidden="true" /></button>
          <input id={quantityId} type="number" inputMode="numeric" min="1" step="1" value={quantity} onChange={handleQuantityChange} disabled={pending} aria-invalid={Boolean(invalid)} aria-describedby={invalid ? `${quantityId}-error` : undefined} />
          <button type="button" onClick={handleIncrease} disabled={pending || Boolean(invalid)} aria-label={`Aumentar cantidad de ${item.name}`}><Plus size={16} aria-hidden="true" /></button>
        </div>
        {(Number(quantity) !== item.quantity || priceToConfirm !== null || feedback?.error) && <button className={styles.update} type="submit" disabled={pending || Boolean(invalid)} aria-label={pending ? "Actualizando…" : "Actualizar"}><RefreshCw size={16} aria-hidden="true" /><span>{pending ? "Actualizando…" : "Actualizar"}</span></button>}
        {pending && <span className={styles.pending} role="status">Actualizando…</span>}
      </form>
    </div>
    <div className={styles.itemFeedback}>
      {invalid && <p id={`${quantityId}-error`} role="alert">{invalid}</p>}
      {feedback && <p role={feedback.error ? "alert" : "status"}>{feedback.message}</p>}
    </div>
  </li>;
}
