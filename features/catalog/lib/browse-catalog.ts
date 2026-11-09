import type { SalesBucket } from "@/features/sales/types/sales";
import type { CatalogProduct } from "../types/catalog";
import { contentfulImageUrl } from "./contentful-image-url";
import { productOffer, type ProductOffer } from "./product-offer";

export const CATALOG_SHELF_SIZE = 5;

export type CatalogCategory = { id: string; label: string; color: string };
export type CatalogListing = {
  sku: string;
  name: string;
  categoryIds: string[];
  imageUrl: string | null;
  imageAlt: string;
  offer: ProductOffer;
  unitsSold: number;
};
export type CatalogShelf = { category: CatalogCategory; products: CatalogListing[] };

const CATEGORY_THEME: Record<string, { label: string; color: string; order: number }> = {
  complementos: { label: "Complementos", color: "var(--dn-category-complementos)", order: 0 },
  deshidratados: { label: "Deshidratados", color: "var(--dn-category-deshidratados)", order: 1 },
  organos: { label: "Órganos", color: "var(--dn-category-organos)", order: 2 },
  "recetas completas": { label: "Recetas completas", color: "var(--dn-category-recetas-completas)", order: 3 },
  suplementos: { label: "Suplementos", color: "var(--dn-category-suplementos)", order: 4 },
};

function normalized(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

function categoryTheme(label: string) {
  const key = normalized(label);
  return CATEGORY_THEME[key === "snacks deshidratados" ? "deshidratados" : key];
}

export function categoryPath(category: CatalogCategory): string {
  const name = normalized(category.label).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `/productos/categoria/${name}-${encodeURIComponent(category.id)}`;
}

export function categoryFromSlug(categories: readonly CatalogCategory[], slug: string): CatalogCategory | undefined {
  return categories.find((category) => categoryPath(category).endsWith(`/${slug}`));
}

export function isCategorySlug(slug: string): boolean {
  return /^[a-z0-9-]{1,120}$/.test(slug);
}

export function productsForCategory(listings: readonly CatalogListing[], categoryId: string): CatalogListing[] {
  return listings.filter((product) => product.categoryIds.includes(categoryId))
    .sort((a, b) => b.unitsSold - a.unitsSold || a.name.localeCompare(b.name, "es") || a.sku.localeCompare(b.sku, "es"));
}

export function prepareCatalog(products: readonly CatalogProduct[], buckets: readonly SalesBucket[]) {
  const unitsBySku = new Map<string, number>();
  for (const bucket of buckets) unitsBySku.set(bucket.sku, (unitsBySku.get(bucket.sku) ?? 0) + bucket.units);

  const categories = new Map<string, CatalogCategory>();
  const listings = products.map((product): CatalogListing => {
    const offer = productOffer(product.commerce);
    for (const category of product.commerce.categories) {
      if (!categories.has(category.id)) {
        const theme = categoryTheme(category.label);
        categories.set(category.id, {
          id: category.id,
          label: theme?.label ?? category.label,
          color: theme?.color ?? "var(--dn-surface-dark)",
        });
      }
    }
    const image = product.editorial.images.find((asset) => contentfulImageUrl(asset.fields.file?.url));
    const name = product.editorial.fields.productName?.trim() || product.commerce.name;
    return {
      sku: product.sku,
      name,
      categoryIds: product.commerce.categories.map((category) => category.id),
      imageUrl: contentfulImageUrl(image?.fields.file?.url),
      imageAlt: image?.fields.description?.trim() || name,
      offer,
      unitsSold: (unitsBySku.get(product.sku) ?? 0) + product.commerce.children.reduce(
        (total, variant) => total + (unitsBySku.get(variant.sku) ?? 0), 0,
      ),
    };
  });
  return { categories: [...categories.values()].sort((a, b) =>
    (categoryTheme(a.label)?.order ?? 5) - (categoryTheme(b.label)?.order ?? 5)
    || a.label.localeCompare(b.label, "es")), listings };
}

export function browseCatalog(
  listings: readonly CatalogListing[],
  categories: readonly CatalogCategory[],
  options: { query?: string; categoryId?: string },
) {
  const query = (options.query ?? "").trim().slice(0, 100);
  const search = normalized(query);
  const categoryId = options.categoryId ?? "";
  const filtered = listings.filter((product) => !search || normalized(`${product.name} ${product.sku}`).includes(search));
  const shelves = categories.filter((category) => !categoryId || category.id === categoryId).flatMap((category): CatalogShelf[] => {
    const products = productsForCategory(filtered, category.id).slice(0, CATALOG_SHELF_SIZE);
    return products.length ? [{ category, products }] : [];
  });
  return { query, categoryId, shelves, total: shelves.reduce((sum, shelf) => sum + shelf.products.length, 0) };
}
