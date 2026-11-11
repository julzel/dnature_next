import "server-only";
import { cache } from "react";
import { getBrowseCatalogProducts } from "@/features/catalog/server/catalog";
import { buildProductDetail } from "../lib/product-detail";

/** Share the same short-lived price/stock snapshot as the catalog, once per render. */
export const getProductDetail = cache(async function getProductDetail(slug: string) {
  if (!slug || slug.length > 200 || /[/\\?#\u0000-\u001f]/.test(slug)) return null;
  const catalog = await getBrowseCatalogProducts();
  const matches = catalog.filter((product) => (product.editorial.fields.urlSlug?.trim() || product.sku) === slug);
  if (matches.length > 1) throw new Error("Published product slugs must be unique.");
  return matches[0] ? buildProductDetail(matches[0], catalog) : null;
});
