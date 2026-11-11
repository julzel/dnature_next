import type { ProductOption } from "@/features/product/types/product";

export type CartItem = {
  sku: string;
  parentSku: string;
  name: string;
  presentation: string;
  quantity: number;
  price: number;
  path: string;
  imageUrl: string | null;
};
export type CartItemRequest = { parentSku: string; sku: string; quantity: number; expectedPrice: number };
export type CartValidationResult =
  | { ok: true; item: CartItem }
  | { ok: false; message: string; options?: ProductOption[] };
