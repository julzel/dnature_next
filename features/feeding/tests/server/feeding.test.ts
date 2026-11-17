import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateDailyPortion, calculatePortion, type PortionProfile } from "@dnature/feeding-engine/portion";
import { calculateQuote, createFeedingQuote } from "../../server/quote";
import { quotationCatalog } from "../../server/catalog-adapter";
import { quoteRequestSchema, reviewReason, type QuoteRequest } from "../../lib/intake";
import golden from "../fixtures/legacy-portions.json";
import bindings from "@/features/catalog/data/product-reference-bindings.json";
import reference from "@/features/catalog/data/product-reference.generated.json";
import type { CatalogProduct } from "@/features/catalog/types/catalog";

const pet = { id: "luna", name: "Luna", species: "dog", breed: "Labrador Retriever", age: 3, weight: 20, lifeStage: "adult", neutered: "yes", body: "ideal", activity: "normal", health: "healthy", allergyStatus: "no", goal: "wellness", behavior: "calm", brachycephaly: "no", meals: 2 } as const;
const request: QuoteRequest = { days: 28, pets: [pet] };
function products(): CatalogProduct[] {
  return bindings.map((binding) => {
    const labels = binding.row === 66 ? ["10 unidades"] : binding.row === 15 ? ["500ml", "1L"] : binding.row === 74 ? ["6 capsulas"] : [72, 95, 119].includes(binding.row) ? ["20g"] : ["200g", "500g", "1kg"];
    return { sku: binding.sku, reference: reference.rows.find((row) => row.row === binding.row)!.reference as NonNullable<CatalogProduct["reference"]>,
      commerce: { id: binding.sku, sku: binding.sku, name: binding.sourceName, status: "active", price: 1000, salePrice: null, qty: 1000, slug: null, type: "variable", description: null, categories: [],
        children: labels.map((label, index) => ({ id: `${binding.sku}-${index}`, sku: `${binding.sku}-${index}`, name: label, status: "active", price: 1000 + index * 1000, salePrice: null, qty: 1000 })) },
      editorial: { id: binding.sku, fields: { productName: binding.sourceName, urlSlug: `producto-${binding.row}` }, images: [] } };
  });
}

test("all legacy portion golden cases remain compatible; invalid weights fail", () => {
  for (const fixture of golden.cases) assert.equal(calculatePortion(fixture.input as PortionProfile), fixture.expected);
  for (const weight of [NaN, Infinity, 0, -1, 101]) assert.equal(calculatePortion({ ...golden.cases[0].input, weight } as PortionProfile), null);
});

test("strict input validation rejects injected prices, invalid values and duplicate profiles", () => {
  assert.equal(quoteRequestSchema.safeParse(request).success, true);
  for (const input of [{ ...request, days: 30 }, { ...request, prices: [] }, { ...request, pets: [pet, pet] }, { ...request, pets: [{ ...pet, weight: "20" }] }, { ...request, pets: [{ ...pet, neutered: "false" }] }]) assert.equal(quoteRequestSchema.safeParse(input).success, false);
});

test("special profiles get a review without catalog access or a fabricated ration", async () => {
  for (const change of [{ health: "condition" }, { health: "unsure" }, { health: "reproductive" }, { lifeStage: "growing" }, { age: .9 }, { allergyStatus: "yes" }, { allergyStatus: "unknown" }]) {
    const input = quoteRequestSchema.parse({ ...request, pets: [{ ...pet, ...change }] });
    assert.ok(reviewReason(input.pets[0]));
    const result = await createFeedingQuote(input);
    assert.equal(result.pets[0].dailyGrams, null);
    assert.deepEqual(result.pets[0].packages, []);
  }
  const cats = await createFeedingQuote({ days: 14, pets: [{ id: "milo", name: "Milo", species: "cat", breed: "Mestizo" }] });
  assert.match(cats.pets[0].review!, /gato/);
});

test("catalog adapter respects inspected bindings and current commerce price/stock", () => {
  const catalog = products();
  const first = catalog[0];
  first.commerce.children[0].salePrice = 700;
  assert.equal(quotationCatalog(catalog)[0].avify.children[0].price, 700);
  assert.equal(quotationCatalog([{ ...first, sku: "unbound" }]).length, 0);
  assert.equal(quotationCatalog([{ ...first, reference: undefined }]).length, 0);
  first.commerce.status = "inactive";
  assert.equal(quotationCatalog([first]).length, 1);
  first.commerce.children[0].status = "inactive";
  assert.equal(quotationCatalog([first])[0].avify.children[0].price, null);
});

test("four packages preserve daily serving, calculate real containers and include IVA", () => {
  const result = calculateQuote(request, products());
  const dog = result.pets[0];
  assert.equal(dog.dailyGrams, 600);
  assert.deepEqual(dog.packages.map((pack) => pack.name), ["Base", "Funcional", "Masticación", "Premium"]);
  assert.equal(dog.packages[0].ready, true);
  assert.equal(dog.packages[1].ready, true);
  for (const pack of dog.packages) {
    assert.equal(pack.mixDailyGrams + pack.complementDailyGrams, 600);
    assert.ok(pack.complementDailyGrams <= 120);
    assert.equal(pack.subtotal, Math.round(pack.lines.reduce((sum, line) => sum + line.price * line.quantity, 0)));
    assert.equal(pack.iva, Math.round(pack.subtotal * .13));
    assert.equal(pack.total, pack.subtotal + pack.iva);
    for (const line of pack.lines) { assert.ok(Number.isInteger(line.quantity) && line.quantity > 0 && line.quantity <= 1000); assert.match(line.href, /^\/producto\/producto-/); }
  }
  const shorter = calculateQuote({ ...request, days: 14 }, products());
  assert.equal(shorter.pets[0].dailyGrams, 600);
  assert.ok(shorter.pets[0].packages[0].total < dog.packages[0].total);
  assert.ok(!JSON.stringify(result).includes('"raw"'));
});

test("package estimates use the shared practical portion for the same profile", () => {
  const answers = { ...pet, weight: 8.5, activity: "calm" } as const;
  const portion = calculateDailyPortion({ ...answers, neutered: true }, request.days);
  assert.deepEqual(portion, { rawDailyGrams: 212.5, dailyGrams: 220 });
  const dog = calculateQuote({ ...request, pets: [answers] }, products()).pets[0];
  assert.equal(dog.rawDailyGrams, portion!.rawDailyGrams);
  assert.equal(dog.dailyGrams, portion!.dailyGrams);
  assert.equal(dog.packages.length, 4);
  for (const pack of dog.packages) {
    assert.equal(pack.mixDailyGrams + pack.complementDailyGrams, portion!.dailyGrams);
  }
});

test("missing or exhausted products leave four explicitly incomplete packages", () => {
  const unavailable = products().map((product) => ({ ...product, commerce: { ...product.commerce, qty: 0, children: product.commerce.children.map((variant) => ({ ...variant, qty: 0 })) } }));
  const result = calculateQuote(request, unavailable);
  assert.equal(result.pets[0].packages.length, 4);
  for (const pack of result.pets[0].packages) { assert.equal(pack.ready, false); assert.ok(pack.issues.length > 0); assert.equal(pack.total, 0); }
  const unusual = calculateQuote({ days: 28, pets: [{ ...pet, body: "overweight", activity: "active" }] }, products());
  assert.equal(unusual.pets[0].dailyGrams, null);
  assert.ok(unusual.pets[0].review);
});

test("optional meal count preserves the daily ration without assuming a schedule", () => {
  const withoutMeals = quoteRequestSchema.parse({ ...request, pets: [{ ...pet, meals: undefined }] });
  const result = calculateQuote(withoutMeals, products());
  assert.equal(result.pets[0].meals, null);
  assert.equal(result.pets[0].dailyGrams, 600);
  assert.equal(result.pets[0].packages.length, 4);
  assert.equal(quoteRequestSchema.safeParse({ ...request, pets: [{ ...pet, meals: 0 }] }).success, false);
});
