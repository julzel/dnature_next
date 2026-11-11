"use server";

import { validateCartItem } from "../server/validate-cart-item";
import type { CartItemRequest, CartValidationResult } from "../types/cart";

export async function validateCartItemAction(input: CartItemRequest): Promise<CartValidationResult> {
  try { return await validateCartItem(input); }
  catch { return { ok: false, message: "No pudimos verificar el precio y la disponibilidad. Conservamos tu selección; intentá de nuevo." }; }
}
