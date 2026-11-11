import assert from "node:assert/strict";
import { test } from "node:test";
import type { CatalogProduct } from "@/features/catalog/types/catalog";
import { validateCartItem } from "../../server/validate-cart-item";
import { parseCart } from "../../lib/cart-storage";
import { maximumQuantity, quantityError } from "@/features/product/lib/product-quantity";
import { buildProductDetail } from "@/features/product/lib/product-detail";

function product(): CatalogProduct {
  return { sku: "parent", commerce: { id: "parent", sku: "parent", name: "Nombre comercial", status: "inactive", price: 2000, salePrice: null, qty: 20, slug: null, type: "variable", description: null, categories: [], children: [{ id: "child", sku: "child", name: "200 g", status: "active", price: 1500, salePrice: 1200, qty: 4 }] }, editorial: { id: "entry", fields: { productName: "Nombre publicado", urlSlug: "producto-publicado" }, images: [] } };
}
const request = { parentSku: "parent", sku: "child", quantity: 2, expectedPrice: 1200 };

test("cart additions use current published identity, active variant, stock and sale price", async () => {
  const result = await validateCartItem(request, async () => product());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.item, { sku: "child", parentSku: "parent", name: "Nombre publicado", presentation: "200 g", quantity: 2, price: 1200, path: "/producto/producto-publicado", imageUrl: null });
  assert.deepEqual(parseCart(JSON.stringify([result.item])), [result.item]);
});

test("changed prices, insufficient inventory and hidden variants require another user decision", async () => {
  const price = await validateCartItem({ ...request, expectedPrice: 1000 }, async () => product());
  assert.equal(price.ok, false);
  if (!price.ok) { assert.match(price.message, /precio se actualizó/); assert.equal(price.options?.[0].price, 1200); }
  const stock = await validateCartItem({ ...request, quantity: 5 }, async () => product());
  assert.equal(stock.ok, false);
  if (!stock.ok) assert.match(stock.message, /inventario cambió/);
  const hidden = product(); hidden.commerce.children[0].status = "inactive";
  assert.equal((await validateCartItem(request, async () => hidden)).ok, false);
  assert.equal((await validateCartItem(request, async () => null)).ok, false);
  const unpriced = product(); unpriced.commerce.price = null; unpriced.commerce.children[0].salePrice = null; unpriced.commerce.children[0].price = null;
  assert.equal((await validateCartItem(request, async () => unpriced)).ok, false);
});

test("invalid quantities are rejected before integration calls; missing quantity never invents a limit", async () => {
  for (const quantity of [0, -1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    const result = await validateCartItem({ ...request, quantity }, async () => { assert.fail("must not load invalid requests"); });
    assert.equal(result.ok, false);
  }
  assert.equal(maximumQuantity(null), undefined);
  assert.equal(maximumQuantity(2.5), 2);
  assert.equal(quantityError("1", undefined), null);
  for (const value of ["", "1.5", "0", "-1", "1e2"]) assert.ok(quantityError(value, undefined));
  assert.ok(quantityError("3", 2));
});

test("malformed browser storage cannot create usable fake cart lines", () => {
  assert.deepEqual(parseCart(null), []);
  for (const value of ["invalid", "{}", '[{"sku":"test"}]']) assert.throws(() => parseCart(value));
  const oversized = { sku: "sku", parentSku: "sku", name: "Producto", presentation: "100 g", path: "/producto/sku", quantity: 999, price: Number.MAX_VALUE, imageUrl: null };
  assert.throws(() => parseCart(JSON.stringify([oversized])));
});

test("published nutrition tables move to composition while narrative and care copy remain readable", () => {
  const item = product(); item.editorial.fields.description = "Descripción publicada.\n@\nInformación nutricional:\nHumedad _72%\n@\nConservación: seguir el envase.";
  const detail = buildProductDetail(item, [item]);
  assert.equal(detail.introduction, "Descripción publicada.");
  assert.deepEqual(detail.description, [{ type: "text", text: "Descripción publicada." }, { type: "text", text: "Conservación: seguir el envase." }]);
  assert.deepEqual(detail.composition, [{ type: "text", text: "Información nutricional:" }, { type: "table", rows: [{ label: "Humedad", value: "72%" }] }]);
});
