type ProductIdentity = { sku: string; slug?: string };

/** Published editorial slugs are canonical; the SKU keeps products without a slug addressable. */
export function productPath(product: ProductIdentity): string {
  return `/producto/${encodeURIComponent(product.slug?.trim() || product.sku)}`;
}
