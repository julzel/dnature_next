import { connection } from "next/server";
import { sitemapEntries } from "@/lib/seo/metadata";
import { canonicalUrl, seoConfig } from "@/lib/seo/config";
import { getBrowseCatalogProducts } from "@/features/catalog/server/catalog";
import { productPath } from "@/features/catalog/lib/product-path";

export default async function sitemap() {
  if (!seoConfig.indexable) return [];
  await connection();
  const catalog = await getBrowseCatalogProducts();
  const productUrls = new Set(catalog.map((product) => canonicalUrl(productPath({ sku: product.sku, slug: product.editorial.fields.urlSlug }))));
  return [...sitemapEntries(), ...[...productUrls].map((url) => ({ url }))];
}
