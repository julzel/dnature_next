import { z } from "zod";

const numeric = z.number().finite().nullish().transform((value) => value ?? null);
const text = z.string().nullish().transform((value) => value ?? null);
const identity = z.union([z.string(), z.number()]).nullish().transform((value) => value == null ? null : String(value));
const fields = {
  id: identity, sku: text, customSku: text, name: text, status: text,
  price: numeric, salePrice: numeric, qty: numeric, reserved: numeric,
  globalInventory: z.object({ qty: numeric, reserved: numeric, onDemand: z.boolean() }).optional(),
  locationStockFound: z.boolean().optional(),
  onDemand: z.boolean().nullish().transform((value) => value === true),
};
export const variantSchema = z.object({
  ...fields,
  attributes: z.array(z.object({ code: z.string(), value: z.union([z.string(), z.number()]).transform(String) })).nullish().transform((value) => value ?? []),
});
export const productSchema = z.object({
  ...fields, slug: text, type: text, taxPrice: numeric, taxPercentage: numeric,
  categories: z.array(z.object({ id: identity, label: text })).nullish().transform((value) => value ?? []),
  children: z.array(variantSchema).nullish().transform((value) => value ?? []),
  variantOptions: z.array(z.object({
    id: identity, attributeCode: text, name: text, type: text,
    values: z.array(z.object({ id: identity, label: text, productsSku: z.union([z.string(), z.array(z.string())]).nullish().transform((value) => value == null ? [] : typeof value === "string" ? [value] : value) })).nullish().transform((value) => value ?? []),
  })).nullish().transform((value) => value ?? []),
});
export const productPageSchema = z.object({
  products: z.array(productSchema), totalCount: z.number().int().nonnegative(),
  pageSize: z.number().int().nonnegative().optional(),
});
export type AvifyProduct = z.infer<typeof productSchema>;
export type AvifyVariant = z.infer<typeof variantSchema>;
export type AvifyFailure = { success: false; code: string; message: string };
export type AvifyCatalog = {
  success: true; products: AvifyProduct[]; reportedTotal: number; pages: number;
  stockScope?: { locationId: number | null; complete: boolean; loadedAt: string | null };
  complete: boolean; warning: string | null; loadedAt: string;
};
export type CatalogResult = AvifyCatalog | AvifyFailure;
export type ConnectionResult = { success: true; code: string; message: string } | AvifyFailure;
export type AvifyConfiguration = {
  configured: boolean; valid: boolean; endpoint: string | null;
  environment: "production" | "sandbox" | "custom" | "unconfigured";
  locationId: number | null; message: string | null;
};
export function effectivePrice(product: Pick<AvifyVariant, "salePrice" | "price">) {
  return product.salePrice ?? product.price;
}
export function inventory(product: Pick<AvifyVariant, "onDemand" | "qty" | "reserved">) {
  if (product.onDemand) return { state: "on-demand" as const, available: null };
  if (product.qty === null) return { state: "unknown" as const, available: null };
  const available = Math.max(0, Math.floor(product.qty - (product.reserved ?? 0)));
  return { state: available > 0 ? "available" as const : "unavailable" as const, available };
}
export function searchableText(product: AvifyProduct) {
  return [product.name, product.sku, product.customSku, ...product.categories.map((c) => c.label),
    ...product.children.flatMap((v) => [v.name, v.sku, v.customSku, ...v.attributes.map((a) => a.value)])]
    .join(" ").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}
