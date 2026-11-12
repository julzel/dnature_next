import type { CatalogCategory, CatalogListing } from "@/features/catalog/lib/browse-catalog";
import type { ProductReference } from "@/features/catalog/types/product-reference";

export type ProductImage = { id: string; url: string; alt: string };
import type { ProductOption } from "@/features/catalog/types/product-option";
export type { ProductOption } from "@/features/catalog/types/product-option";
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
  introduction: string | null;
  composition: ProductCopyBlock[];
  ingredients: string;
  reference: ProductReference | null;
  options: ProductOption[];
  related: CatalogListing[];
};
