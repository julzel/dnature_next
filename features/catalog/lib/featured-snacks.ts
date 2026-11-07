import type { SalesBucket } from "@/features/sales/types/sales";
import type { CatalogProduct } from "../types/catalog";

export type FeaturedSnack = {
  sku: string;
  name: string;
  price: number;
  fromPrice: boolean;
  imageUrl: string;
  imageAlt: string;
  unitsSold: number;
};

function currentPrice(price: number | null, salePrice: number | null): number | null {
  const value = salePrice !== null && salePrice > 0 ? salePrice : price;
  return value !== null && value > 0 ? value : null;
}

function availablePrice(product: CatalogProduct): { price: number; fromPrice: boolean } | null {
  const { commerce } = product;
  if (commerce.children.length === 0) {
    const price = commerce.qty !== null && commerce.qty > 0 ? currentPrice(commerce.price, commerce.salePrice) : null;
    return price === null ? null : { price, fromPrice: false };
  }
  const prices = commerce.children
    .filter((variant) => variant.qty !== null && variant.qty > 0 && variant.status === "active")
    .map((variant) => currentPrice(variant.price ?? commerce.price, variant.salePrice))
    .filter((price): price is number => price !== null);
  return prices.length ? { price: Math.min(...prices), fromPrice: true } : null;
}

function imageUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.startsWith("//") ? `https:${raw}` : raw);
    return url.protocol === "https:" && url.hostname === "images.ctfassets.net" ? url.href : null;
  } catch { return null; }
}

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
    const offer = availablePrice(product);
    const image = product.editorial.images.find((asset) => imageUrl(asset.fields.file?.url));
    const src = imageUrl(image?.fields.file?.url);
    if (!offer || !image || !src) return [];
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
