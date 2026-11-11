import { prepareCatalog } from "@/features/catalog/lib/browse-catalog";
import { contentfulImageUrl } from "@/features/catalog/lib/contentful-image-url";
import { productOffer } from "@/features/catalog/lib/product-offer";
import { productPath } from "@/features/catalog/lib/product-path";
import { productText } from "@/features/catalog/lib/product-copy";
import type { CatalogProduct } from "@/features/catalog/types/catalog";
import type { ProductCopyBlock, ProductDetail } from "../types/product";

export function descriptionBlocks(value: string | undefined): ProductCopyBlock[] {
  // The published CMS uses @ delimiters and underscores for nutrition rows.
  // Render that format as semantic text/tables, never executable HTML.
  return productText(value).split("@").flatMap((part): ProductCopyBlock[] => {
    const rows = part.split("\n").map((line) => line.trim()).filter(Boolean);
    const blocks: ProductCopyBlock[] = [];
    for (const row of rows) {
      const match = row.match(/^-?\s*([^_]+?)\s+_([^_]+)$/);
      if (match) {
        let table = blocks.at(-1);
        if (table?.type !== "table") { table = { type: "table", rows: [] }; blocks.push(table); }
        table.rows.push({ label: match[1].trim(), value: match[2].trim() });
      } else {
        const text = row.replace(/__([^_]+)__/g, "$1").replace(/^\s*-\s*/, "").trim();
        if (text) blocks.push({ type: "text", text });
      }
    }
    return blocks;
  });
}

export function buildProductDetail(product: CatalogProduct, catalog: readonly CatalogProduct[]): ProductDetail {
  const prepared = prepareCatalog(catalog);
  const listing = prepareCatalog([product]).listings[0];
  const categories = prepared.categories.filter((category) => listing.categoryIds.includes(category.id));
  const variants = product.commerce.children.filter((variant) => variant.status === "active");
  const options = variants.length ? variants.map((variant) => {
    const offer = productOffer({ ...product.commerce, children: [variant] });
    return { sku: variant.sku, name: variant.name, price: offer.price, inStock: offer.inStock };
  }) : product.commerce.children.length ? [] : [{ sku: product.sku, name: "Presentación única", ...productOffer(product.commerce) }];
  return {
    sku: product.sku,
    name: listing.name,
    path: productPath({ sku: product.sku, slug: product.editorial.fields.urlSlug }),
    images: product.editorial.images.flatMap((image) => {
      const url = contentfulImageUrl(image.fields.file?.url);
      return url ? [{ id: image.sys.id, url, alt: image.fields.description?.trim() || listing.name }] : [];
    }),
    categories,
    description: descriptionBlocks(product.editorial.fields.description),
    ingredients: listing.ingredients,
    reference: product.reference ?? null,
    options,
    related: prepared.listings.filter((item) => item.sku !== product.sku && item.categoryIds.some((id) => listing.categoryIds.includes(id))).sort((a, b) => Number(b.offer.inStock) - Number(a.offer.inStock)).slice(0, 3),
  };
}

export function productSummary(product: ProductDetail): string {
  const category = product.categories[0]?.label;
  return `${product.name}${category ? ` · ${category}` : ""}. Consultá ingredientes, presentaciones, precios y disponibilidad en DNAture.`;
}
