import type { CSSProperties } from "react";
import { productText } from "./product-copy";
import { productPath } from "./product-path";
import type { CatalogProduct } from "../types/catalog";
import { contentfulImageUrl } from "./contentful-image-url";
import { productOffer, productOptions, type ProductOffer } from "./product-offer";
import type { ProductOption } from "../types/product-option";

export type CatalogCategory = { id: string; label: string; color: string; ink: string; onColor: string };
export type CatalogListing = {
  sku: string;
  path: string;
  name: string;
  categoryIds: string[];
  imageUrl: string | null;
  imageAlt: string;
  offer: ProductOffer;
  ingredients: string;
  options: ProductOption[];
  searchText: string;
  searchNames: string[];
  searchSkus: string[];
};
export type CatalogSort = "relevance" | "name" | "price-asc" | "price-desc";
export type CatalogFilters = {
  query: string;
  categoryIds: string[];
  inStockOnly: boolean;
  sort: CatalogSort;
};

const CATEGORY_THEME: Record<string, { label: string; token: string; order: number }> = {
  deshidratados: { label: "Deshidratados", token: "--dn-category-deshidratados", order: 0 },
  "recetas completas": { label: "Recetas completas", token: "--dn-category-recetas-completas", order: 1 },
  complementos: { label: "Complementos", token: "--dn-category-complementos", order: 2 },
  suplementos: { label: "Suplementos", token: "--dn-category-suplementos", order: 3 },
  organos: { label: "Órganos", token: "--dn-category-organos", order: 4 },
};

export function categoryStyle(category: CatalogCategory): CSSProperties {
  return {
    "--category-color": category.color,
    "--category-ink": category.ink,
    "--category-on-color": category.onColor,
  } as CSSProperties;
}

function normalized(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").replace(/\s+/g, " ").trim();
}


function categoryTheme(label: string) {
  const key = normalized(label);
  return CATEGORY_THEME[key === "snacks deshidratados" ? "deshidratados" : key];
}

export function categoryPath(category: CatalogCategory): string {
  return `/productos/categoria/${categoryFilterSlug(category)}-${encodeURIComponent(category.id)}`;
}

export function categoryFilterSlug(category: CatalogCategory): string {
  return normalized(category.label).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function categoryFromSlug(categories: readonly CatalogCategory[], slug: string): CatalogCategory | undefined {
  return categories.find((category) => categoryPath(category).endsWith(`/${slug}`));
}

export function isCategorySlug(slug: string): boolean {
  return /^[a-z0-9-]{1,120}$/.test(slug);
}

export function prepareCatalog(products: readonly CatalogProduct[]) {
  const categories = new Map<string, CatalogCategory>();
  const listings = products.map((product): CatalogListing => {
    const offer = productOffer(product.commerce);
    for (const category of product.commerce.categories) {
      if (!categories.has(category.id)) {
        const theme = categoryTheme(category.label);
        categories.set(category.id, {
          id: category.id,
          label: theme?.label ?? category.label,
          color: theme ? `var(${theme.token})` : "var(--dn-surface-dark)",
          ink: theme ? `var(${theme.token}-ink)` : "var(--dn-surface-dark)",
          onColor: theme ? `var(${theme.token}-on-color)` : "var(--dn-text-inverse)",
        });
      }
    }
    const image = product.editorial.images.find((asset) => contentfulImageUrl(asset.fields.file?.url));
    const name = product.editorial.fields.productName?.trim() || product.commerce.name;
    const ingredients = productText(product.editorial.fields.ingredientes).replace(/\s+/g, " ");
    const activeVariants = product.commerce.children.filter((variant) => variant.status === "active");
    const searchNames = [...new Set([name, product.commerce.name].map(normalized))];
    const searchSkus = [...new Set([product.sku, product.commerce.sku, ...activeVariants.map((variant) => variant.sku)].map(normalized))];
    return {
      sku: product.sku,
      path: productPath({ sku: product.sku, slug: product.editorial.fields.urlSlug }),
      name,
      categoryIds: product.commerce.categories.map((category) => category.id),
      imageUrl: contentfulImageUrl(image?.fields.file?.url),
      imageAlt: image?.fields.description?.trim() || name,
      offer,
      ingredients,
      options: productOptions(product.commerce),
      searchNames,
      searchSkus,
      searchText: normalized([
        ...searchNames, ingredients,
        ...product.commerce.categories.map((category) => categoryTheme(category.label)?.label ?? category.label),
        ...activeVariants.map((variant) => variant.name),
      ].join(" ")),
    };
  });
  return { categories: [...categories.values()].sort((a, b) =>
    (categoryTheme(a.label)?.order ?? 5) - (categoryTheme(b.label)?.order ?? 5)
    || a.label.localeCompare(b.label, "es")), listings };
}

function textWords(text: string): string[] {
  return text.match(/[a-z0-9]+/g) ?? [];
}

function matchesWords(text: string, words: readonly string[]): boolean {
  const tokens = textWords(text);
  return words.every((word) => tokens.some((token) => token.startsWith(word)));
}

function searchRank(product: CatalogListing, search: string, words: readonly string[]): number {
  if (product.searchSkus.includes(search)) return 0;
  if (product.searchNames.includes(search)) return 1;
  if (product.searchNames.some((name) => name.startsWith(search))) return 2;
  if (product.searchNames.some((name) => matchesWords(name, words))) return 3;
  if (search.length >= 3 && product.searchSkus.some((sku) => sku.startsWith(search))) return 4;
  return 5;
}

export function filterCatalog(
  listings: readonly CatalogListing[],
  categories: readonly CatalogCategory[],
  filters: CatalogFilters,
) {
  const search = normalized(filters.query.slice(0, 100));
  const words = textWords(search);
  const selected = new Set(filters.categoryIds);
  const categoryCounts: Record<string, number> = Object.fromEntries(categories.map(({ id }) => [id, 0]));
  let availableCount = 0;
  const products: CatalogListing[] = [];

  for (const product of listings) {
    // Match identifiers as whole prefixes; arbitrary UUID fragments should not
    // overwhelm short, ordinary ingredient or product-name searches.
    const skuMatches = search && product.searchSkus.some((sku) => sku === search || (search.length >= 3 && sku.startsWith(search)));
    if (!skuMatches && !matchesWords(product.searchText, words)) continue;
    const categoryMatches = selected.size === 0 || product.categoryIds.some((id) => selected.has(id));
    if (categoryMatches && product.offer.inStock) availableCount += 1;
    if (filters.inStockOnly && !product.offer.inStock) continue;
    for (const categoryId of new Set(product.categoryIds)) {
      if (Object.hasOwn(categoryCounts, categoryId)) categoryCounts[categoryId] += 1;
    }
    if (categoryMatches) products.push(product);
  }

  const ranks = new Map(search && filters.sort === "relevance"
    ? products.map((product) => [product.sku, searchRank(product, search, words)]) : []);
  products.sort((a, b) => {
    if (filters.sort === "price-asc" || filters.sort === "price-desc") {
      if (a.offer.price === null && b.offer.price !== null) return 1;
      if (b.offer.price === null && a.offer.price !== null) return -1;
      if (a.offer.price !== null && b.offer.price !== null && a.offer.price !== b.offer.price) {
        return (a.offer.price - b.offer.price) * (filters.sort === "price-asc" ? 1 : -1);
      }
    }
    if (filters.sort === "relevance") {
      const relevance = (ranks.get(a.sku) ?? 0) - (ranks.get(b.sku) ?? 0);
      if (relevance) return relevance;
      if (a.offer.inStock !== b.offer.inStock) return a.offer.inStock ? -1 : 1;
    }
    return a.name.localeCompare(b.name, "es") || a.sku.localeCompare(b.sku, "es");
  });
  return { products, total: products.length, categoryCounts, availableCount };
}
