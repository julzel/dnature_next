import "server-only";
import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { getContentfulEntries } from "@/features/content/server/contentful";
import type { ContentfulAsset, ContentfulEntry, ProductContentFields } from "@/features/content/types/contentful";
import { IntegrationError } from "@/lib/server/integration-error";
import { joinProducts } from "../lib/join-products";
import type { AvifyProduct } from "../types/avify";
import type { CatalogProduct } from "../types/catalog";
import { getAvifyProducts } from "./avify";

const AVIFY_PAGE_SIZE = 100;
const CONTENTFUL_PAGE_SIZE = 1000;

type PublishedProductContent = {
  entries: ContentfulEntry<ProductContentFields>[];
  assets: ContentfulAsset[];
};

export async function loadAvifyCatalog(): Promise<AvifyProduct[]> {
  const first = await getAvifyProducts({ page: 1, pageSize: AVIFY_PAGE_SIZE });
  const products = [...first.products];
  const total = first.totalCount;
  if (total > 0 && products.length === 0) {
    throw new IntegrationError("Avify", "INVALID_RESPONSE", "Avify returned an empty catalog page.");
  }
  for (let pageNumber = 2; pageNumber <= Math.ceil(total / AVIFY_PAGE_SIZE); pageNumber++) {
    const page = await getAvifyProducts({ page: pageNumber, pageSize: AVIFY_PAGE_SIZE });
    if (page.totalCount !== total || page.products.length === 0) {
      throw new IntegrationError("Avify", "INVALID_RESPONSE", "Avify catalog changed during pagination.");
    }
    products.push(...page.products);
  }
  // Avify can report one more item in totalCount than its selectable product pages return.
  // A short final page is complete for this query; empty earlier pages still fail above.
  if (products.length > total) {
    throw new IntegrationError("Avify", "INVALID_RESPONSE", "Avify returned more products than reported.");
  }
  return products;
}

export async function loadPublishedProductContent(): Promise<PublishedProductContent> {
  const entries: ContentfulEntry<ProductContentFields>[] = [];
  const assets = new Map<string, ContentfulAsset>();
  let total: number | undefined;
  for (let skip = 0; total === undefined || skip < total; skip += CONTENTFUL_PAGE_SIZE) {
    const page = await getContentfulEntries<ProductContentFields>({
      contentType: "product", limit: CONTENTFUL_PAGE_SIZE, skip, include: 1,
    });
    if (total !== undefined && page.total !== total) {
      throw new IntegrationError("Contentful", "INVALID_RESPONSE", "Contentful catalog changed during pagination.");
    }
    total = page.total;
    if (page.items.length === 0 && skip < total) {
      throw new IntegrationError("Contentful", "INVALID_RESPONSE", "Contentful returned an incomplete catalog.");
    }
    entries.push(...page.items);
    for (const asset of page.includes?.Asset ?? []) assets.set(asset.sys.id, asset);
  }
  if (entries.length !== total) {
    throw new IntegrationError("Contentful", "INVALID_RESPONSE", "Contentful returned an incomplete catalog.");
  }
  return { entries, assets: [...assets.values()] };
}

async function getCachedProductContent(): Promise<PublishedProductContent> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 3600 });
  cacheTag("contentful-products");
  return loadPublishedProductContent();
}

async function getShortLivedAvifyCatalog(): Promise<AvifyProduct[]> {
  "use cache";
  cacheLife({ stale: 15, revalidate: 30, expire: 120 });
  return loadAvifyCatalog();
}

/** Published parent products only. Avify prices and stock are read fresh on each call. */
export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  const [products, content] = await Promise.all([loadAvifyCatalog(), getCachedProductContent()]);
  return joinProducts(products, content.entries, content.assets);
}

/** One joined snapshot per render; the underlying caches retain their own freshness windows. */
export const getBrowseCatalogProducts = cache(async function getBrowseCatalogProducts(): Promise<CatalogProduct[]> {
  const [products, content] = await Promise.all([getShortLivedAvifyCatalog(), getCachedProductContent()]);
  return joinProducts(products, content.entries, content.assets);
});

export async function getCatalogProductBySku(sku: string): Promise<CatalogProduct | null> {
  if (!sku.trim() || sku.length > 200) throw new RangeError("sku must be a nonempty string of at most 200 characters.");
  const [page, content] = await Promise.all([
    getAvifyProducts({ skus: [sku], pageSize: 100 }),
    getCachedProductContent(),
  ]);
  return joinProducts(page.products.filter((product) => product.sku === sku), content.entries, content.assets)[0] ?? null;
}
