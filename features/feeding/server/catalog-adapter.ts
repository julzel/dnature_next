import "server-only";
import type { CatalogProduct } from "@/features/catalog/types/catalog";
import { productOptions } from "@/features/catalog/lib/product-offer";
import source from "../engine/sandbox/data/product-catalog.json";
import { prepareProducts } from "../engine/sandbox/catalog";
import { productSchema } from "../engine/catalog/avify/model";
import type { CuratedItem } from "../engine/quotations/nutrition";
import bindings from "@/features/catalog/data/product-reference-bindings.json";

const references = new Map(prepareProducts(source.records).map((product) => [product.row, product]));
const bySku = new Map(bindings.map((binding) => [binding.sku, binding]));

/** Only published, explicitly bound parent SKUs can enter the quotation engine. */
export function quotationCatalog(products: CatalogProduct[]): CuratedItem[] {
  return products.flatMap((product) => {
    const binding = bySku.get(product.sku);
    const catalog = binding && references.get(binding.row);
    if (!catalog || catalog.name !== binding?.sourceName || product.reference?.sourceRow !== catalog.row) return [];
    const options = new Map(productOptions(product.commerce).map((option) => [option.sku, option]));
    function offer(variant: CatalogProduct["commerce"]) {
      const option = options.get(variant.sku);
      return { ...variant, price: option?.price ?? null, salePrice: null, qty: option?.quantityAvailable ?? null,
        reserved: 0, onDemand: false, attributes: [] };
    }
    // This storefront publishes parents through Contentful. Avify returns these
    // parents as inactive even when their variants are sold. Match checkout's
    // productOptions policy; preserve each child's actual status and stock.
    const avify = productSchema.parse({ ...offer(product.commerce), status: "active", children: product.commerce.children.map((variant) =>
      offer({ ...product.commerce, ...variant, children: [] })) });
    return [{ catalog, avify }];
  });
}
