"use client";

import { useSyncExternalStore } from "react";
import { CartStorageError, parseCart } from "./cart-storage";
import type { CartItem } from "../types/cart";

export const CART_STORAGE_KEY = "dnature.cart.v1";
type Snapshot = { items: CartItem[]; error: string | null; ready: boolean };
const serverSnapshot: Snapshot = { items: [], error: null, ready: false };
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();

function publish(next: Snapshot) { snapshot = next; for (const listener of listeners) listener(); }
function readStorage() {
  try { publish({ items: parseCart(localStorage.getItem(CART_STORAGE_KEY)), error: null, ready: true }); }
  catch { publish({ ...snapshot, ready: true, error: "No pudimos leer el carrito guardado. Revisá el almacenamiento del navegador o vaciá el carrito para empezar de nuevo." }); }
}
function handleStorage(event: StorageEvent) { if (event.key === CART_STORAGE_KEY || event.key === null) readStorage(); }
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) { window.addEventListener("storage", handleStorage); readStorage(); }
  return () => { listeners.delete(listener); if (!listeners.size) window.removeEventListener("storage", handleStorage); };
}
function getSnapshot() { return snapshot; }
function getServerSnapshot() { return serverSnapshot; }
export function useCart() { return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot); }

export function getCartItems() { return parseCart(localStorage.getItem(CART_STORAGE_KEY)); }
function save(items: CartItem[]) {
  try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); }
  catch { throw new CartStorageError("No pudimos guardar el carrito en este navegador. Revisá el almacenamiento e intentá de nuevo."); }
  publish({ items, error: null, ready: true });
}
export function saveValidatedCartItem(item: CartItem, previousQuantity: number) {
  const items = getCartItems();
  if ((items.find((existing) => existing.sku === item.sku)?.quantity ?? 0) !== previousQuantity) throw new CartStorageError("El carrito cambió en otra pestaña. Revisá la cantidad e intentá de nuevo.");
  save([...items.filter((existing) => existing.sku !== item.sku), item]);
}
export function removeCartItem(sku: string) { save(getCartItems().filter((item) => item.sku !== sku)); }
export function clearCart() { save([]); }
