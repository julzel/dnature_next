"use client";

import Link from "next/link";
import Image from "next/image";
import { useId, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import { quantityError } from "@/features/product/lib/product-quantity";
import { validateCartItemAction } from "../actions/validate-cart-item";
import { removeCartItem, saveValidatedCartItem } from "../lib/cart-store";
import { CartStorageError } from "../lib/cart-storage";
import type { CartItem } from "../types/cart";
import styles from "./cart.module.css";

export function CartItemRow({ item }: { item: CartItem }) {
  const quantityId = useId();
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [priceToConfirm, setPriceToConfirm] = useState<number | null>(null);
  const price = priceToConfirm ?? item.price;
  const [feedback, setFeedback] = useState<{ error: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const invalid = quantityError(quantity, undefined);
  function handleQuantityChange(event: ChangeEvent<HTMLInputElement>) { setQuantity(event.currentTarget.value); setFeedback(null); }
  function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || invalid) return;
    setFeedback(null);
    startTransition(async function updateQuantity() {
      try {
        const result = await validateCartItemAction({ parentSku: item.parentSku, sku: item.sku, quantity: Number(quantity), expectedPrice: price });
        if (!result.ok) {
          const updatedPrice = result.options?.find((option) => option.sku === item.sku)?.price;
          if (updatedPrice != null) setPriceToConfirm(updatedPrice);
          setFeedback({ error: true, message: result.message }); return;
        }
        saveValidatedCartItem(result.item, item.quantity);
        setPriceToConfirm(null);
        setFeedback({ error: false, message: "Carrito actualizado." });
      } catch (error) { setFeedback({ error: true, message: error instanceof CartStorageError ? error.message : "No pudimos actualizar el carrito. Intentá de nuevo." }); }
    });
  }
  function handleRemove() {
    try { removeCartItem(item.sku); }
    catch (error) { setFeedback({ error: true, message: error instanceof CartStorageError ? error.message : "No pudimos quitar el producto. Intentá de nuevo." }); }
  }
  return <li className={styles.item}>
    {item.imageUrl && <Link className={styles.image} href={item.path}><Image src={item.imageUrl} alt={item.name} width={96} height={96} /></Link>}
    <div className={styles.itemContent}>
      <h2><Link href={item.path}>{item.name}</Link></h2>
      <p>{item.presentation}</p>
      <p>{formatCatalogPrice(price)} por unidad</p>
      <form className={styles.itemActions} onSubmit={handleUpdate} aria-busy={pending}>
        <label htmlFor={quantityId}>Cantidad<input id={quantityId} type="number" min="1" step="1" value={quantity} onChange={handleQuantityChange} disabled={pending} aria-invalid={Boolean(invalid)} aria-describedby={invalid ? `${quantityId}-error` : undefined} /></label>
        <button type="submit" disabled={pending || Boolean(invalid)}>{pending ? "Actualizando…" : "Actualizar"}</button>
        <button type="button" onClick={handleRemove} disabled={pending} aria-label={`Quitar ${item.name} del carrito`}><Trash2 size={18} aria-hidden="true" /><span className={styles.removeLabel}>Quitar</span></button>
      </form>
      {invalid && <p id={`${quantityId}-error`} role="alert">{invalid}</p>}
      {feedback && <p role={feedback.error ? "alert" : "status"}>{feedback.message}</p>}
    </div>
    <p className={styles.lineTotal}>{formatCatalogPrice(item.price * item.quantity)}</p>
  </li>;
}
