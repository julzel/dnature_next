import "server-only";
import { randomUUID } from "node:crypto";
import { getCatalogProductsBySkus } from "@/features/catalog/server/catalog";
import { validateCartItem } from "@/features/cart/server/validate-cart-item";
import contact from "@/features/contact/data/contact.json";
import { orderTotals, validateCheckout, validOrderItems } from "../lib/checkout";
import { orderMessage } from "../lib/order-message";
import type { OrderDraft, OrderRequest, OrderResult } from "../types/order";

/** Guest order draft only: no payment, inventory reservation, external message, or order creation. */
export async function prepareOrder(input: OrderRequest, loadProducts = getCatalogProductsBySkus): Promise<OrderResult> {
  const { fields, errors } = validateCheckout(input?.customer);
  if (Object.keys(errors).length) return { ok: false, message: "Revisá los datos marcados para preparar tu pedido.", fields: errors };
  if (!validOrderItems(input?.items)) return { ok: false, message: "Revisá el carrito: agregá entre 1 y 50 presentaciones, con hasta 999 unidades de cada una." };
  const products = await loadProducts([...new Set(input.items.map((item) => item.parentSku))]);
  const bySku = new Map(products.map((product) => [product.sku, product]));
  const results = await Promise.all(input.items.map((item) => validateCartItem(item, async (sku) => bySku.get(sku) ?? null)));
  const issues = results.flatMap((result, index) => result.ok ? [] : [{ sku: input.items[index].sku, message: result.message }]);
  if (issues.length) return { ok: false, message: "Algunos productos cambiaron. Revisá las cantidades y actualizá los productos indicados antes de generar el pedido.", issues };
  const items = results.flatMap((result) => result.ok ? [result.item] : []);
  const draft: Omit<OrderDraft, "message" | "whatsappUrl"> = {
    reference: `DNA-${randomUUID().slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(), status: "draft", paymentStatus: "unpaid",
    customer: fields, items, totals: orderTotals(items, fields.fulfillment, fields.zone),
  };
  const message = orderMessage(draft);
  const whatsapp = new URL(contact.whatsapp.url);
  whatsapp.searchParams.set("text", message);
  return { ok: true, order: { ...draft, message, whatsappUrl: whatsapp.href } };
}
