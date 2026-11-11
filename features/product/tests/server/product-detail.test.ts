import assert from "node:assert/strict";
import { test } from "node:test";
import type { CatalogProduct } from "@/features/catalog/types/catalog";
import { prepareCatalog } from "@/features/catalog/lib/browse-catalog";
import { productPath } from "@/features/catalog/lib/product-path";
import { buildProductDetail, descriptionBlocks, productSummary } from "../../lib/product-detail";

function product(sku: string, category = "Deshidratados"): CatalogProduct {
  return {
    sku,
    commerce: { id: sku, sku, name: sku, status: "active", slug: null, type: "simple", description: null, price: 2500, salePrice: null, qty: 1, categories: [{ id: category, label: category, parentId: null }], children: [] },
    editorial: { id: sku, fields: { productName: `Producto ${sku}`, urlSlug: `producto-${sku}`, ingredientes: "Res &amp; pescado" }, images: [{ sys: { id: sku, type: "Asset" }, fields: { file: { url: `//images.ctfassets.net/space/${sku}.jpg`, fileName: `${sku}.jpg`, contentType: "image/jpeg" } } }] },
  };
}

test("catalog and detail use the same canonical editorial slug, with a safe SKU fallback", () => {
  const item = product("a");
  assert.equal(prepareCatalog([item]).listings[0].path, buildProductDetail(item, [item]).path);
  assert.equal(productPath({ sku: "a/b", slug: "" }), "/producto/a%2Fb");
  assert.equal(productPath({ sku: "a", slug: "  corazon-de-res  " }), "/producto/corazon-de-res");
});

test("variant offers honor active status, sale prices, parent fallback, and real stock", () => {
  const item = product("a");
  item.commerce.children = [
    { id: "s", sku: "s", name: "Pequeña", price: 1000, salePrice: 800, qty: 0, status: "active" },
    { id: "l", sku: "l", name: "Grande", price: null, salePrice: null, qty: 5, status: "active" },
    { id: "x", sku: "x", name: "Oculta", price: 1, salePrice: null, qty: 5, status: "inactive" },
  ];
  const detail = buildProductDetail(item, [item]);
  assert.deepEqual(detail.options, [
    { sku: "s", name: "Pequeña", price: 800, inStock: false, quantityAvailable: 0 },
    { sku: "l", name: "Grande", price: 2500, inStock: true, quantityAvailable: 5 },
  ]);
  item.commerce.children.forEach((option) => { option.status = "inactive"; });
  assert.deepEqual(buildProductDetail(item, [item]).options, []);
});

test("published nutrition delimiters become readable rows without discarding duplicate source labels", () => {
  assert.deepEqual(descriptionBlocks("Receta.\n@\n- Información nutricional:\nHumedad    _72%\nCalcio     _0,05%\nCalcio    _0,01%\n@\n- Conservación: refrigerada."), [
    { type: "text", text: "Receta." }, { type: "text", text: "Información nutricional:" },
    { type: "table", rows: [{ label: "Humedad", value: "72%" }, { label: "Calcio", value: "0,05%" }, { label: "Calcio", value: "0,01%" }] },
    { type: "text", text: "Conservación: refrigerada." },
  ]);
  assert.deepEqual(descriptionBlocks('<script>alert(1)</script><p>__Texto__ &amp; más</p>'), [{ type: "text", text: "Texto & más" }]);
});

test("missing facts stay absent, safe images and related membership come from actual records", () => {
  const item = product("a");
  item.editorial.images.push({ sys: { id: "unsafe", type: "Asset" }, fields: { file: { url: "https://example.com/image.jpg", fileName: "image.jpg", contentType: "image/jpeg" } } });
  const sold = product("sold"); sold.commerce.qty = 0;
  const detail = buildProductDetail(item, [item, sold, product("stocked"), product("other", "Órganos")]);
  assert.equal(detail.images.length, 1);
  assert.equal(detail.ingredients, "Res & pescado");
  assert.deepEqual(detail.description, []);
  assert.deepEqual(detail.related.map(({ sku }) => sku), ["stocked", "sold"]);
  assert.match(productSummary(detail), /presentaciones, precios y disponibilidad/);
  assert.equal("species" in detail, false);
  assert.equal("rating" in detail, false);
});
