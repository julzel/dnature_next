import type { AvifyProduct } from "./avify";
import type { ContentfulAsset, ProductContentFields } from "@/features/content/types/contentful";

export type CatalogProduct = {
  sku: string;
  commerce: AvifyProduct;
  editorial: {
    id: string;
    fields: ProductContentFields;
    images: ContentfulAsset[];
  };
};
