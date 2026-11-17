import type { CartItem, CartItemRequest } from "@/features/cart/types/cart";

export type CheckoutFields = {
  name: string;
  phone: string;
  fulfillment: "" | "pickup" | "delivery";
  zone: "" | "gam" | "outside";
  province: string;
  canton: string;
  district: string;
  address: string;
  notes: string;
};
export type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>;
export type OrderTotals = { subtotal: number; iva: number; delivery: number | null; total: number };
export type OrderDraft = {
  reference: string;
  createdAt: string;
  status: "draft";
  paymentStatus: "unpaid";
  customer: CheckoutFields;
  items: CartItem[];
  totals: OrderTotals;
  message: string;
  whatsappUrl: string;
};
export type OrderRequest = { customer: CheckoutFields; items: CartItemRequest[] };
export type OrderResult =
  | { ok: true; order: OrderDraft }
  | { ok: false; message: string; fields?: CheckoutErrors; issues?: { sku: string; message: string }[] };
