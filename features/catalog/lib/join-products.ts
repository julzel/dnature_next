import { IntegrationError } from "@/lib/server/integration-error";
import type { ContentfulAsset, ContentfulEntry, ProductContentFields } from "@/features/content/types/contentful";
import type { AvifyProduct } from "../types/avify";
import type { CatalogProduct } from "../types/catalog";
import { productReference } from "./product-reference";

function publishedImages(fields: ProductContentFields, assets: Map<string, ContentfulAsset>): ContentfulAsset[] {
  if (!Array.isArray(fields.image)) return [];
  const images: ContentfulAsset[] = [];
  const seen = new Set<string>();
  for (const image of fields.image) {
    const id = image?.sys?.id;
    if (typeof id !== "string" || seen.has(id)) continue;
    const asset = image.sys.type === "Asset" ? image as ContentfulAsset : assets.get(id);
    if (asset?.fields?.file) {
      images.push(asset);
      seen.add(id);
    }
  }
  return images;
}

export function joinProducts(
  products: readonly AvifyProduct[],
  entries: readonly ContentfulEntry<ProductContentFields>[],
  includedAssets: readonly ContentfulAsset[],
): CatalogProduct[] {
  const assets = new Map(includedAssets.map((asset) => [asset.sys.id, asset]));
  const contentBySku = new Map<string, ContentfulEntry<ProductContentFields>>();
  for (const entry of entries) {
    const sku = entry.fields.avifySku;
    if (typeof sku !== "string" || !sku.trim()) continue;
    if (contentBySku.has(sku)) {
      throw new IntegrationError("Contentful", "INVALID_RESPONSE", "Multiple published product entries match the same Avify SKU.");
    }
    contentBySku.set(sku, entry);
  }

  const catalog: CatalogProduct[] = [];
  const seenSkus = new Set<string>();
  for (const commerce of products) {
    if (seenSkus.has(commerce.sku)) {
      throw new IntegrationError("Avify", "INVALID_RESPONSE", "Multiple catalog products share the same SKU.");
    }
    seenSkus.add(commerce.sku);
    const entry = contentBySku.get(commerce.sku);
    if (!entry) continue;
    const source = productReference(commerce.sku);
    // Editorial exclusions apply to listings, detail pages, related products and sitemap alike.
    if (source && source.status !== "Descripción comercial") continue;
    catalog.push({
      sku: commerce.sku,
      commerce,
      ...(source ? { reference: source.reference } : {}),
      editorial: { id: entry.sys.id, fields: entry.fields, images: publishedImages(entry.fields, assets) },
    });
  }
  return catalog;
}
