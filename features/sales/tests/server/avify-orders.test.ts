import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { getAvifySalesDataset } from "../../server/avify-orders";

const originalEnvironment = { ...process.env };
beforeEach(() => {
  process.env.AVIFY_GRAPHQL_URL = "https://api.avify.com/graphql";
  process.env.AVIFY_API_KEY = "test-key";
});
afterEach(() => { process.env = { ...originalEnvironment }; });

const catalog = {
  id: "parent", sku: "parent", name: "Proteína", slug: "proteina", status: "active", type: "configurable",
  price: 10, salePrice: null, qty: 2, description: null,
  categories: [{ id: 7, label: "Proteínas", parentId: null }],
  children: [{ id: "child", sku: "child", name: "Proteína 250 g", status: "active", price: 10, salePrice: null, qty: 2 }],
};

function order(id: string, created: string, status: string, sku: string, currency = "CRC", channel = "web") {
  return { id, created, status, channel, costs: { orderCurrencyCode: currency }, products: [{ sku, customSku: "DN-250", name: sku, ordered: 2, price: 10 }] };
}

test("loads all pages through the cutoff and groups eligible variant sales without customer data", async (t) => {
  const requests: number[] = [];
  t.mock.method(globalThis, "fetch", async (_url: URL, init: RequestInit) => {
    const body = JSON.parse(init.body as string);
    assert.doesNotMatch(body.query, /customer|shipping|telephone|email/i);
    if (body.query.includes("DnatureProducts")) {
      return Response.json({ data: { products: { products: [catalog], pageSize: 100, totalCount: 1 } } });
    }
    const page = body.variables.pageNum;
    requests.push(page);
    const orders = page === 1
      ? [order("1", "2026-11-06T12:00:00Z", "complete", "child"), order("2", "2026-11-05T12:00:00Z", "pending", "child")]
      : page === 2
        ? [order("3", "2026-05-06T18:00:00Z", "processing", "child", "USD"), order("4", "2026-05-06T17:00:00Z", "complete", "missing")]
        : [order("5", "2026-05-05T18:00:00Z", "complete", "child")];
    return Response.json({ data: { orders: { orders, totalCount: 300, pagesLeft: 3 - page } } });
  });
  const result = await getAvifySalesDataset(new Date("2026-11-06T18:00:00Z"));
  assert.deepEqual(requests.sort(), [1, 2, 3]);
  assert.equal(result.fromDate, "2026-05-06");
  assert.equal(result.eligibleOrders, 3);
  assert.equal(result.unmatchedProducts, 1);
  assert.equal(result.products.find((product) => product.sku === "child")?.categories[0].label, "Proteínas");
  assert.equal(result.products.find((product) => product.sku === "child")?.name, "Proteína · Proteína 250 g");
  assert.equal(result.products.find((product) => product.sku === "child")?.customSku, "DN-250");
  assert.equal(result.products.find((product) => product.sku === "missing")?.categories.length, 0);
  assert.deepEqual(result.buckets.map((bucket) => [bucket.currency, bucket.units, bucket.gross]), [["CRC", 2, 20], ["USD", 2, 20], ["CRC", 2, 20]]);
});

test("an upstream error on a later page rejects the whole dataset", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url: URL, init: RequestInit) => {
    const body = JSON.parse(init.body as string);
    if (body.query.includes("DnatureProducts")) return Response.json({ data: { products: { products: [catalog], pageSize: 100, totalCount: 1 } } });
    if (body.variables.pageNum === 1) return Response.json({ data: { orders: { orders: [order("1", "2026-11-06T12:00:00Z", "complete", "child")], totalCount: 200, pagesLeft: 1 } } });
    return Response.json({ errors: [{ message: "private-provider-detail" }] });
  });
  await assert.rejects(getAvifySalesDataset(new Date("2026-11-06T18:00:00Z")), (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.doesNotMatch(error.message, /private-provider-detail/);
    return true;
  });
});

test("a rate-limited order page is retried without returning partial totals", async (t) => {
  let attempts = 0;
  t.mock.method(globalThis, "fetch", async (_url: URL, init: RequestInit) => {
    const body = JSON.parse(init.body as string);
    if (body.query.includes("DnatureProducts")) return Response.json({ data: { products: { products: [catalog], pageSize: 100, totalCount: 1 } } });
    attempts++;
    if (attempts === 1) return new Response("rate limited", { status: 429, headers: { "Retry-After": "0" } });
    return Response.json({ data: { orders: { orders: [order("1", "2026-11-06T12:00:00Z", "complete", "child")], totalCount: 1, pagesLeft: 0 } } });
  });
  const result = await getAvifySalesDataset(new Date("2026-11-06T18:00:00Z"));
  assert.equal(attempts, 2);
  assert.equal(result.eligibleOrders, 1);
});
