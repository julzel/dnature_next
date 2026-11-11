import type { CatalogCategory, CatalogListing } from "@/features/catalog/lib/browse-catalog";
import type { ProductReference } from "@/features/catalog/types/product-reference";

export type ProductImage = { id: string; url: string; alt: string };
export type ProductOption = { sku: string; name: string; price: number | null; inStock: boolean };
export type ProductCopyBlock =
  | { type: "text"; text: string }
  | { type: "table"; rows: { label: string; value: string }[] };
export type ProductDetail = {
  sku: string;
  name: string;
  path: string;
  images: ProductImage[];
  categories: CatalogCategory[];
  description: ProductCopyBlock[];
  ingredients: string;
  reference: ProductReference | null;
  options: ProductOption[];
  related: CatalogListing[];
};
