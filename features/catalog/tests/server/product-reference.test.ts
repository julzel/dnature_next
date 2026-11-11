import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import source from "../../data/product-reference.generated.json";
import bindings from "../../data/product-reference-bindings.json";
import { parseProductReference } from "../../lib/parse-product-reference";
import { productReference } from "../../lib/product-reference";
import { joinProducts } from "../../lib/join-products";
import { buildProductDetail } from "@/features/product/lib/product-detail";
import type { AvifyProduct } from "../../types/avify";
import type { ContentfulEntry, ProductContentFields } from "@/features/content/types/contentful";

const markdown = readFileSync("docs/SEO-GEO/catalog-products.md", "utf8");

test("the generated reference preserves every source row and detects source drift", () => {
  assert.equal(source.sourceSha256, createHash("sha256").update(markdown).digest("hex"));
  assert.deepEqual(source.rows, parseProductReference(markdown));
  assert.equal(source.rows.length, 141);
  assert.equal(source.rows.filter((row) => row.status === "Excluir").length, 7);
  assert.equal(source.rows.filter((row) => row.status === "Continuidad pendiente").length, 2);
  assert.equal(new Set(bindings.map((binding) => binding.sku)).size, bindings.length);
  for (const binding of bindings) assert.equal(productReference(binding.sku)?.name, binding.sourceName);
});

test("the import retains useful cautions without publishing source doses or safety assurances", () => {
  const ear = source.rows.find((row) => row.row === 85)!.reference;
  assert.deepEqual(ear.species, ["dog"]);
  assert.equal(ear.chewing, "Avanzada");
  assert.equal(ear.chokingRisk, "Alto");
  assert.equal(ear.supervision, "Supervisá su consumo");
  const senior = source.rows.find((row) => row.row === 119)!.reference;
  assert.deepEqual(senior.species, ["dog", "cat"]);
  assert.deepEqual(senior.lifeStages, ["Senior"]);
  assert.equal(senior.allergens, null);
  assert.equal(senior.supervision, null);
  assert.equal(senior.chokingRisk, null);
  assert.equal(source.rows.find((row) => row.row === 100)!.reference.complementary, true);
  assert.equal(source.rows.find((row) => row.row === 38)!.reference.kind, "Base alimenticia");
  assert.doesNotMatch(JSON.stringify(source), /1g por cada 10kg|arandanos|Sophia|Alimentación completa y balanceada|Border Collie/);
});

test("malformed source rows fail explicitly instead of losing restrictions", () => {
  assert.throws(() => parseProductReference(markdown.replace("**NO recomendado para:**", "**Otro campo:**")), /Missing NO recomendado/);
  assert.throws(() => parseProductReference(markdown.replace("**Especie:** Perro", "**Especie:** Desconocida")), /Unknown species/);
  assert.throws(() => parseProductReference(markdown.replace("## Fila 3", "## Fila 2")), /Invalid catalog source row/);
  assert.throws(() => parseProductReference(markdown.replace("· Excluir.", "· Publicar.")), /Invalid catalog source row/);
  assert.throws(() => parseProductReference(markdown.replace("**Supervisión:** No", "**Supervisión:** Pendiente")), /Unknown supervision/);
  assert.throws(() => parseProductReference(markdown.replace("**Riesgo atragantamiento:** Baja", "**Riesgo atragantamiento:** Desconocido")), /Unknown choking risk/);
});

function pair(sku: string, name = "Nombre actualizado") {
  const commerce: AvifyProduct = { id: sku, sku, name, status: "active", price: 1250, salePrice: 1000, qty: 4, slug: null, type: "simple", description: null, categories: [], children: [] };
  const content: ContentfulEntry<ProductContentFields> = {
    sys: { id: sku, type: "Entry", contentType: { sys: { id: "product", type: "Link", linkType: "ContentType" } } },
    fields: { productName: name, avifySku: sku, ingredientes: "Ingredientes publicados" },
  };
  return { commerce, content };
}

test("SKU bindings enrich the detail without replacing CMS copy or live offers", () => {
  const binding = bindings.find((item) => item.row === 85)!;
  const { commerce, content } = pair(binding.sku);
  const [product] = joinProducts([commerce], [content], []);
  const detail = buildProductDetail(product, [product]);
  assert.equal(detail.name, "Nombre actualizado");
  assert.equal(detail.ingredients, "Ingredientes publicados");
  assert.equal(detail.options[0].price, 1000);
  assert.equal(detail.options[0].inStock, true);
  assert.equal(detail.reference?.sourceRow, 85);
  const unrelated = pair("unknown-sku", binding.sourceName);
  const [unmatched] = joinProducts([unrelated.commerce], [unrelated.content], []);
  assert.equal(unmatched.reference, undefined);
  assert.equal(buildProductDetail(unmatched, [unmatched]).reference, null);
});

test("excluded and pending rows cannot reach any public joined catalog consumer", () => {
  for (const sourceRow of [2, 16]) {
    const binding = bindings.find((item) => item.row === sourceRow)!;
    const { commerce, content } = pair(binding.sku);
    assert.deepEqual(joinProducts([commerce], [content], []), []);
  }
});
