import "server-only";
import sourceData from "../data/product-reference.generated.json";
import bindings from "../data/product-reference-bindings.json";
import type { CatalogReferenceSource } from "../types/product-reference";

const source = sourceData as CatalogReferenceSource;
const rows = new Map(source.rows.map((row) => [row.row, row]));
const references = new Map(bindings.map((binding) => {
  const row = rows.get(binding.row);
  if (!row || row.name !== binding.sourceName) throw new Error(`Catalog reference binding needs review for row ${binding.row}.`);
  return [binding.sku, row];
}));
if (references.size !== bindings.length) throw new Error("Catalog reference bindings must have unique SKUs.");

/** A source title is never used to join live products. Only inspected parent SKU bindings apply. */
export function productReference(sku: string) {
  return references.get(sku) ?? null;
}
