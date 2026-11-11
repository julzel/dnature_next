import assert from "node:assert/strict";
import { test } from "node:test";
import type { CatalogProduct } from "@/features/catalog/types/catalog";
import { cartFingerprint, emptyCheckout, orderTotals, validateCheckout, validOrderItems } from "../../lib/checkout";
import { prepareOrder } from "../../server/prepare-order";
import type { CheckoutFields, OrderRequest } from "../../types/order";

const customer: CheckoutFields = { ...emptyCheckout, name: "Ana Pérez", phone: "+506 8888-8888", fulfillment: "pickup" };
const delivery: CheckoutFields = { ...customer, fulfillment: "delivery", zone: "gam", province: "San José", canton: "Montes de Oca", district: "San Pedro", address: "100 metros norte de la plaza, casa azul." };
const line = { parentSku: "parent", sku: "small", quantity: 2, expectedPrice: 1900 };
function product(): CatalogProduct {
  return { sku: "parent", commerce: { id: "parent", sku: "parent", name: "Nombre comercial", status: "active", price: 2000, salePrice: null, qty: 20, slug: null, type: "variable", description: null, categories: [], children: [
    { id: "small", sku: "small", name: "100 g", status: "active", price: 2000, salePrice: 1900, qty: 4 },
    { id: "large", sku: "large", name: "200 g", status: "active", price: 3000, salePrice: null, qty: 4 },
  ] }, editorial: { id: "entry", fields: { productName: "Nombre publicado", urlSlug: "producto-publicado" }, images: [] } };
}

test("13% IVA is added once to products; GAM delivery is 3500, pickup zero, other zones pending", () => {
  const items = [{ price: 1900, quantity: 2 }];
  assert.deepEqual(orderTotals(items, "pickup", ""), { subtotal: 3800, iva: 494, delivery: 0, total: 4294 });
  assert.deepEqual(orderTotals(items, "delivery", "gam"), { subtotal: 3800, iva: 494, delivery: 3500, total: 7794 });
  assert.deepEqual(orderTotals(items, "delivery", "outside"), { subtotal: 3800, iva: 494, delivery: null, total: 4294 });
  assert.equal(orderTotals(items, "", "").delivery, null);
  assert.equal(orderTotals([{ price: 101, quantity: 3 }], "pickup", "").iva, 39);
  assert.throws(() => orderTotals([{ price: Number.MAX_VALUE, quantity: 999 }], "pickup", ""));
});

test("delivery needs a zone and complete address; pickup drops a previously entered address", () => {
  assert.deepEqual(validateCheckout(customer).errors, {});
  assert.deepEqual(validateCheckout(delivery).errors, {});
  const pickup = validateCheckout({ ...delivery, fulfillment: "pickup" }).fields;
  assert.equal(pickup.address, ""); assert.equal(pickup.zone, "");
  const invalid = validateCheckout({ ...customer, fulfillment: "delivery" });
  assert.deepEqual(Object.keys(invalid.errors), ["zone", "province", "canton", "district", "address"]);
  assert.ok(validateCheckout({ ...customer, phone: "123" }).errors.phone);
  assert.ok(validateCheckout({ ...customer, fulfillment: "free-delivery" }).errors.fulfillment);
  assert.ok(validateCheckout({ ...delivery, zone: "unknown" }).errors.zone);
  assert.ok(validateCheckout({ ...customer, name: "\n" }).errors.name);
});

test("tampered, empty, oversized, duplicate, and invalid cart requests never reach inventory", async () => {
  const invalid = [[], [line, line], [{ ...line, quantity: -1 }], [{ ...line, quantity: 1.5 }], [{ ...line, quantity: 1000 }], [{ ...line, expectedPrice: Infinity }], [{ ...line, expectedPrice: 0 }], Array.from({ length: 51 }, (_, i) => ({ ...line, sku: String(i) }))];
  for (const items of invalid) {
    assert.equal(validOrderItems(items), false);
    const result = await prepareOrder({ customer, items }, async () => { assert.fail("invalid requests must not fetch inventory"); });
    assert.equal(result.ok, false);
  }
  assert.equal((await prepareOrder({ customer: emptyCheckout, items: [line] }, async () => { assert.fail("invalid fields must not fetch inventory"); })).ok, false);
});

test("preparing a draft batches inventory, rebuilds identity and totals, and creates an unsent WhatsApp message", async () => {
  let calls = 0;
  const input = { customer: delivery, items: [line, { ...line, sku: "large", quantity: 1, expectedPrice: 3000 }], totals: { total: 1 } };
  const result = await prepareOrder(input, async (skus) => { calls++; assert.deepEqual(skus, ["parent"]); return [product()]; });
  assert.equal(calls, 1); assert.equal(result.ok, true);
  if (!result.ok) return;
  const { order } = result;
  assert.match(order.reference, /^DNA-[A-F0-9]{8}$/);
  assert.equal(order.status, "draft"); assert.equal(order.paymentStatus, "unpaid");
  assert.equal(order.items[0].name, "Nombre publicado");
  assert.deepEqual(order.totals, { subtotal: 6800, iva: 884, delivery: 3500, total: 11184 });
  const url = new URL(order.whatsappUrl);
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.searchParams.get("text"), order.message);
  for (const text of ["SKU: small", "2 × ₡1 900", "₡11 184", "IVA (13%", delivery.address, "pendiente de confirmación y pago"]) assert.ok(order.message.includes(text));
});

test("price and stock changes block the whole draft instead of silently replacing customer choices", async () => {
  for (const changed of ["price", "stock", "hidden", "missing"] as const) {
    const current = product();
    if (changed === "price") current.commerce.children[0].salePrice = 2100;
    if (changed === "stock") current.commerce.children[0].qty = 1;
    if (changed === "hidden") current.commerce.children[0].status = "inactive";
    const result = await prepareOrder({ customer, items: [line] }, async () => changed === "missing" ? [] : [current]);
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.issues?.[0].sku, "small");
    assert.equal("order" in result, false);
  }
  await assert.rejects(prepareOrder({ customer, items: [line] }, async () => { throw new Error("unavailable"); }));
});

test("outside GAM never looks like free delivery and pickup never leaks an old address", async () => {
  for (const fields of [{ ...delivery, zone: "outside" }, { ...delivery, fulfillment: "pickup" }] as CheckoutFields[]) {
    const result = await prepareOrder({ customer: fields, items: [line] } as OrderRequest, async () => [product()]);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    if (fields.fulfillment === "pickup") assert.equal(result.order.message.includes(delivery.address), false);
    else { assert.match(result.order.message, /Envío: por cotizar; no incluido/); assert.match(result.order.message, /Total sin envío: ₡4 294/); }
  }
});

test("cart fingerprints ignore row order but invalidate summaries when price, quantity, or parent changes", () => {
  const a = { sku: "a", parentSku: "parent", quantity: 1, price: 2000 };
  const b = { ...a, sku: "b" };
  assert.equal(cartFingerprint([a, b]), cartFingerprint([b, a]));
  assert.notEqual(cartFingerprint([a]), cartFingerprint([{ ...a, quantity: 2 }]));
  assert.notEqual(cartFingerprint([a]), cartFingerprint([{ ...a, price: 1000 }]));
});
