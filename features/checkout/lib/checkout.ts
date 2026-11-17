import type { CartItemRequest } from "@/features/cart/types/cart";
import type { CheckoutErrors, CheckoutFields, OrderTotals } from "../types/order";

export const IVA_PERCENT = 13;
export const GAM_DELIVERY_FEE = 3500;
export const MAX_ORDER_LINES = 50;
export const MAX_ORDER_QUANTITY = 999;
export const emptyCheckout: CheckoutFields = { name: "", phone: "", fulfillment: "", zone: "", province: "", canton: "", district: "", address: "", notes: "" };

/** Whole-colón checkout policy: round the product subtotal, then IVA once, then add shipping. */
export function orderTotals(items: { price: number; quantity: number }[], fulfillment: CheckoutFields["fulfillment"], zone: CheckoutFields["zone"]): OrderTotals {
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const iva = Math.round(subtotal * IVA_PERCENT / 100);
  const delivery = fulfillment === "pickup" ? 0 : fulfillment === "delivery" && zone === "gam" ? GAM_DELIVERY_FEE : null;
  const total = subtotal + iva + (delivery ?? 0);
  if (!Number.isSafeInteger(total) || total < 0) throw new RangeError("El importe del pedido no es válido.");
  return { subtotal, iva, delivery, total };
}

export function validateCheckout(value: unknown): { fields: CheckoutFields; errors: CheckoutErrors } {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const fields = { ...emptyCheckout };
  const errors: CheckoutErrors = {};
  for (const key of Object.keys(fields) as (keyof CheckoutFields)[]) {
    const text = typeof input[key] === "string" ? (input[key] as string).trim() : "";
    Object.assign(fields, { [key]: text });
  }
  if (!fields.name || fields.name.length > 100 || /[\r\n]/.test(fields.name)) errors.name = "Ingresá tu nombre (máximo 100 caracteres).";
  if (!/^\+?[\d ()-]+$/.test(fields.phone) || !/^\d{8,15}$/.test(fields.phone.replace(/\D/g, "")) || fields.phone.length > 30) errors.phone = "Ingresá un teléfono válido, con código de país si corresponde.";
  if (!["pickup", "delivery"].includes(fields.fulfillment)) errors.fulfillment = "Elegí retiro o entrega a domicilio.";
  if (fields.fulfillment === "delivery") {
    if (!["gam", "outside"].includes(fields.zone)) errors.zone = "Indicá si la dirección está dentro o fuera de la GAM.";
    for (const key of ["province", "canton", "district"] as const) {
      if (!fields[key] || fields[key].length > 100 || /[\r\n]/.test(fields[key])) errors[key] = "Completá este campo (máximo 100 caracteres).";
    }
    if (fields.address.length < 10 || fields.address.length > 500) errors.address = "Indicá una dirección exacta y referencias (entre 10 y 500 caracteres).";
  } else {
    fields.zone = ""; fields.province = ""; fields.canton = ""; fields.district = ""; fields.address = "";
  }
  if (fields.notes.length > 500) errors.notes = "Usá un máximo de 500 caracteres.";
  return { fields, errors };
}

export function validOrderItems(value: unknown): value is CartItemRequest[] {
  if (!Array.isArray(value) || !value.length || value.length > MAX_ORDER_LINES) return false;
  const seen = new Set<string>();
  return value.every((item) => {
    if (!item || typeof item !== "object" || typeof item.sku !== "string" || !item.sku.trim() || item.sku.length > 200 || typeof item.parentSku !== "string" || !item.parentSku.trim() || item.parentSku.length > 200 || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_ORDER_QUANTITY || !Number.isFinite(item.expectedPrice) || item.expectedPrice <= 0 || item.expectedPrice > 100_000_000 || seen.has(item.sku)) return false;
    seen.add(item.sku);
    return true;
  });
}

export function cartFingerprint(items: { sku: string; parentSku: string; quantity: number; price: number }[]): string {
  return JSON.stringify(items.map(({ sku, parentSku, quantity, price }) => [sku, parentSku, quantity, price]).sort((a, b) => String(a[0]).localeCompare(String(b[0]))));
}
