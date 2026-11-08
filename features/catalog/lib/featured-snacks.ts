import type { SalesBucket } from "@/features/sales/types/sales";
import type { CatalogProduct } from "../types/catalog";
import { contentfulImageUrl } from "./contentful-image-url";
import { productOffer } from "./product-offer";

export type FeaturedSnack = {
  sku: string;
  name: string;
  price: number;
  fromPrice: boolean;
  imageUrl: string;
  imageAlt: string;
  unitsSold: number;
};

function isDehydratedSnack(product: CatalogProduct): boolean {
  return product.commerce.categories.some((category) => {
    const label = category.label.trim().toLocaleLowerCase("es");
    return label === "snacks deshidratados" || label === "deshidratados";
  });
}

export function selectFeaturedSnacks(catalog: readonly CatalogProduct[], buckets: readonly SalesBucket[]): FeaturedSnack[] {
  const unitsBySku = new Map<string, number>();
  for (const bucket of buckets) unitsBySku.set(bucket.sku, (unitsBySku.get(bucket.sku) ?? 0) + bucket.units);

  return catalog.flatMap((product) => {
    if (!isDehydratedSnack(product)) return [];
    const unitsSold = (unitsBySku.get(product.sku) ?? 0)
      + product.commerce.children.reduce((total, variant) => total + (unitsBySku.get(variant.sku) ?? 0), 0);
    if (unitsSold <= 0) return [];
    const offer = productOffer(product.commerce);
    const image = product.editorial.images.find((asset) => contentfulImageUrl(asset.fields.file?.url));
    const src = contentfulImageUrl(image?.fields.file?.url);
    if (!offer.inStock || offer.price === null || !image || !src) return [];
    const name = product.editorial.fields.productName?.trim() || product.commerce.name;
    return [{
      sku: product.sku,
      name,
      price: offer.price,
      fromPrice: offer.fromPrice,
      imageUrl: src,
      imageAlt: image.fields.description?.trim() || name,
      unitsSold,
    }];
  }).sort((a, b) => b.unitsSold - a.unitsSold || a.name.localeCompare(b.name, "es") || a.sku.localeCompare(b.sku, "es")).slice(0, 4);
}
