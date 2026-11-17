"use client";

import { useEffect, useId, useRef, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { validateCartItemAction } from "@/features/cart/actions/validate-cart-item";
import { getCartItems, removeCartItem, saveValidatedCartItem, useCart } from "@/features/cart/lib/cart-store";
import { CartStorageError } from "@/features/cart/lib/cart-storage";
import { maximumQuantity, quantityError } from "@/features/product/lib/product-quantity";
import type { ProductOption } from "../types/product-option";
import styles from "./catalog-cart.module.css";

export function CatalogCartQuantity({ parentSku, name, option, onOptionsChange, onAdded, onEmpty }: { parentSku: string; name: string; option: ProductOption; onOptionsChange: (options: ProductOption[]) => void; onAdded: () => void; onEmpty: () => void }) {
  const cart = useCart();
  const quantity = cart.items.find((item) => item.sku === option.sku)?.quantity ?? 0;
  const [draft, setDraft] = useState<{ value: string; baseline: number } | null>(null);
  const value = draft?.baseline === quantity ? draft.value : String(quantity);
  const maximum = maximumQuantity(option.quantityAvailable);
  const invalid = value === "0" ? null : quantityError(value, maximum);
  const invalidNumber = value === "0" ? null : quantityError(value, undefined);
  const [feedback, setFeedback] = useState<{ error: boolean; message: string; announceOnly?: boolean } | null>(null);
  const [pending, startTransition] = useTransition();
  const submitting = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const focusAfterAdd = useRef(false);
  const id = useId();

  useEffect(function disposeTimer() { return () => { if (timer.current) clearTimeout(timer.current); }; }, []);
  useEffect(function focusAddedQuantity() {
    if (quantity > 0 && !pending && focusAfterAdd.current) { focusAfterAdd.current = false; input.current?.focus({ preventScroll: true }); }
  }, [quantity, pending]);

  function cancelTimer() { if (timer.current) { clearTimeout(timer.current); timer.current = null; } }
  function commit(next: number, baseline = quantity) {
    cancelTimer();
    if (submitting.current || !Number.isSafeInteger(next) || next < 0 || (next > 0 && quantityError(String(next), maximum))) return;
    submitting.current = true;
    setFeedback(null);
    startTransition(async function persistQuantity() {
      try {
        const stored = getCartItems().find((item) => item.sku === option.sku)?.quantity ?? 0;
        if (stored !== baseline) throw new CartStorageError("El carrito cambió en otra pestaña. Revisá la cantidad e intentá de nuevo.");
        if (next === 0) {
          removeCartItem(option.sku); setDraft(null); onEmpty();
          setFeedback({ error: false, message: "Producto retirado del carrito." });
          return;
        }
        if (option.price === null) return;
        const result = await validateCartItemAction({ parentSku, sku: option.sku, quantity: next, expectedPrice: option.price });
        if (!result.ok) { if (result.options) onOptionsChange(result.options); setFeedback({ error: true, message: result.message }); return; }
        focusAfterAdd.current = baseline === 0;
        saveValidatedCartItem(result.item, baseline);
        if (baseline === 0) onAdded();
        setDraft(null);
        setFeedback({ error: false, message: baseline === 0 ? "Producto agregado al carrito." : "Cantidad actualizada en el carrito.", announceOnly: baseline === 0 });
      } catch (error) { setFeedback({ error: true, message: error instanceof CartStorageError ? error.message : "No pudimos actualizar el carrito. Conservamos tu selección; intentá de nuevo." }); }
      finally { submitting.current = false; }
    });
  }
  function handleAdd() { commit(1); }
  function handleRetry() { if (!invalid) commit(Number(value)); }
  function handleDecrease() { const next = Math.max(0, Number(value) - 1); setDraft({ value: String(next), baseline: quantity }); commit(next); }
  function handleIncrease() { const next = Number(value) + 1; setDraft({ value: String(next), baseline: quantity }); commit(next); }
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.currentTarget.value;
    cancelTimer(); setDraft({ value: next, baseline: quantity }); setFeedback(null);
    if (next !== "0" && quantityError(next, maximum)) return;
    const baseline = quantity;
    timer.current = setTimeout(function saveTypedQuantity() { commit(Number(next), baseline); }, 350);
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!invalid) commit(Number(value)); }

  return <form className={styles.quantityForm} onSubmit={handleSubmit} aria-busy={pending}>
    {quantity === 0 ? <button type="button" className={styles.add} onClick={handleAdd} disabled={!cart.ready || pending || !option.inStock || option.price === null}><ShoppingCart size={18} strokeWidth={1.5} aria-hidden="true" />{pending ? "Agregando…" : "Agregar al carrito"}</button>
      : <>
        <label htmlFor={id} className="sr-only">Cantidad de {name} ({option.name})</label>
        <div className={styles.stepper}>
          <button type="button" onClick={handleDecrease} disabled={pending || Boolean(invalidNumber)} aria-label={`Disminuir cantidad de ${name} (${option.name})`}><Minus size={16} aria-hidden="true" /></button>
          <input ref={input} id={id} type="number" inputMode="numeric" min="0" step="1" max={maximum} value={value} onChange={handleChange} disabled={pending} aria-invalid={Boolean(invalid)} aria-describedby={invalid ? `${id}-error` : undefined} />
          <button type="button" onClick={handleIncrease} disabled={pending || Boolean(invalid) || !option.inStock || (maximum !== undefined && Number(value) >= maximum)} aria-label={`Aumentar cantidad de ${name} (${option.name})`}><Plus size={16} aria-hidden="true" /></button>
        </div>
      </>}
    {invalid && quantity > 0 && <p id={`${id}-error`} className={styles.feedback} role="alert">{invalid}</p>}
    {pending && <p className={styles.feedback} role="status">Verificando precio y disponibilidad…</p>}
    {feedback && <p className={feedback.announceOnly ? "sr-only" : styles.feedback} role={feedback.error ? "alert" : "status"}>{feedback.message}</p>}
    {feedback?.error && quantity > 0 && !invalid && <button className={styles.retry} type="button" onClick={handleRetry} disabled={pending}>Reintentar</button>}
  </form>;
}
