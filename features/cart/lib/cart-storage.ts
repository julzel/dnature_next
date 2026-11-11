import type { CartItem } from "../types/cart";

export class CartStorageError extends Error {}

export function parseCart(value: string | null): CartItem[] {
  if (value === null) return [];
  let data: unknown;
  try { data = JSON.parse(value); }
  catch { throw new CartStorageError("El carrito guardado no se pudo leer."); }
  if (!Array.isArray(data)) throw new CartStorageError("El carrito guardado no se pudo leer.");
  const seen = new Set<string>();
  const items = data.map((item) => {
    if (!item || typeof item !== "object" || ["sku", "parentSku", "name", "presentation", "path"].some((key) => typeof item[key] !== "string" || !item[key].trim()) || !/^\/producto\/[^/]+$/.test(item.path) || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || !Number.isFinite(item.price) || item.price <= 0 || seen.has(item.sku) || !(item.imageUrl === null || (typeof item.imageUrl === "string" && item.imageUrl.startsWith("https://images.ctfassets.net/")))) throw new CartStorageError("El carrito guardado no se pudo leer.");
    seen.add(item.sku);
    return { sku: item.sku, parentSku: item.parentSku, name: item.name, presentation: item.presentation, path: item.path, quantity: item.quantity, price: item.price, imageUrl: item.imageUrl };
  });
  // Reject unusable amounts before rendering totals; leave headroom for taxes and delivery.
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!Number.isFinite(subtotal) || subtotal > Number.MAX_SAFE_INTEGER / 2) throw new CartStorageError("El importe del carrito guardado no es válido.");
  return items;
}
