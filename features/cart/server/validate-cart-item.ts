import "server-only";
import { getCatalogProductBySku } from "@/features/catalog/server/catalog";
import { buildProductDetail } from "@/features/product/lib/product-detail";
import { maximumQuantity } from "@/features/product/lib/product-quantity";
import type { CartItemRequest, CartValidationResult } from "../types/cart";

export async function validateCartItem(input: CartItemRequest, loadProduct = getCatalogProductBySku): Promise<CartValidationResult> {
  if (!input || typeof input.parentSku !== "string" || !input.parentSku.trim() || input.parentSku.length > 200 || typeof input.sku !== "string" || !input.sku.trim() || input.sku.length > 200 || !Number.isSafeInteger(input.quantity) || input.quantity < 1 || !Number.isFinite(input.expectedPrice) || input.expectedPrice <= 0) {
    return { ok: false, message: "Revisá la presentación y la cantidad antes de continuar." };
  }
  // This lookup reads Avify afresh, bypassing the browse inventory cache.
  const product = await loadProduct(input.parentSku);
  if (!product) return { ok: false, message: "Este producto ya no está disponible. Volvé al catálogo para elegir otra opción." };
  const detail = buildProductDetail(product, [product]);
  const option = detail.options.find((item) => item.sku === input.sku);
  if (!option?.inStock || option.price === null) return { ok: false, message: "Esta presentación no está disponible para agregar al carrito. Elegí otra opción.", options: detail.options };
  const maximum = maximumQuantity(option.quantityAvailable);
  if (maximum !== undefined && input.quantity > maximum) return { ok: false, message: `El inventario cambió. Hay ${maximum} unidades disponibles; revisá la cantidad, incluyendo las que ya tenés en el carrito.`, options: detail.options };
  if (option.price !== input.expectedPrice) return { ok: false, message: "El precio se actualizó. Revisá el nuevo precio y volvé a confirmar.", options: detail.options };
  return { ok: true, item: { sku: option.sku, parentSku: detail.sku, name: detail.name, presentation: option.name, price: option.price, quantity: input.quantity, path: detail.path, imageUrl: detail.images[0]?.url ?? null } };
}
