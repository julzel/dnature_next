import type { AvifyProduct } from "./avify";
import type { ProductReference } from "./product-reference";
import type { ContentfulAsset, ProductContentFields } from "@/features/content/types/contentful";

export type CatalogProduct = {
  sku: string;
  commerce: AvifyProduct;
  reference?: ProductReference;
  editorial: {
    id: string;
    fields: ProductContentFields;
    images: ContentfulAsset[];
  };
};
