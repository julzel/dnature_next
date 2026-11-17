import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseProductReference } from "../lib/parse-product-reference";
import type { CatalogReferenceSource } from "../types/product-reference";
import bindings from "../data/product-reference-bindings.json";

async function main() {
  const source = "docs/SEO-GEO/catalog-products.md";
  const markdown = await readFile(resolve(source), "utf8");
  const workbookSha256 = markdown.match(/SHA-256 ([a-f0-9]{64})/)?.[1];
  if (!workbookSha256) throw new Error("The catalog source must identify its workbook SHA-256.");
  const data: CatalogReferenceSource = {
    source,
    sourceSha256: createHash("sha256").update(markdown).digest("hex"),
    workbookSha256,
    rows: parseProductReference(markdown),
  };
  const output = resolve("features/catalog/data/product-reference.generated.json");
  const rows = new Map(data.rows.map((row) => [row.row, row.name]));
  if (new Set(bindings.map((binding) => binding.sku)).size !== bindings.length) throw new Error("Catalog reference bindings must have unique SKUs.");
  for (const binding of bindings) {
    if (!binding.sku.trim() || rows.get(binding.row) !== binding.sourceName) throw new Error(`Review the SKU binding for source row ${binding.row}.`);
  }
  const serialized = `${JSON.stringify(data, null, 2)}\n`;
  if (process.argv.includes("--check")) {
    if (await readFile(output, "utf8") !== serialized) throw new Error("Catalog reference data is stale. Run npm run catalog:generate and review the changes.");
    console.log(`Catalog reference is current (${data.rows.length} source rows).`);
  } else {
    await writeFile(output, serialized);
    console.log(`Imported ${data.rows.length} source rows. Review SKU bindings before publishing new references.`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Catalog reference generation failed.");
  process.exitCode = 1;
});
