import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { checkAvifyConnection, getAvifyProducts } from "../../server/avify";

const originalEnvironment = { ...process.env };
beforeEach(() => {
  process.env.AVIFY_GRAPHQL_URL = "https://api.avify.com/graphql";
  process.env.AVIFY_API_KEY = "test-avify-secret";
  process.env.AVIFY_LOCATION_ID = "17";
});
afterEach(() => { process.env = { ...originalEnvironment }; });

const product = {
  id: "product-id", sku: "DN-001", name: "Producto de prueba", slug: "producto-de-prueba", status: "active", type: "simple",
  price: 1000, salePrice: 0, qty: 0, description: null,
  categories: [{ id: 1, label: "Proteínas", parentId: null }],
  children: [{ id: "variant-id", sku: "DN-001-250", name: "250 g", status: "active", price: 1000, salePrice: null, qty: 2 }],
};

test("products use the documented api-key header and location-scoped pagination", async (t) => {
  t.mock.method(globalThis, "fetch", async (url: URL, init: RequestInit) => {
    assert.equal(url.href, "https://api.avify.com/graphql");
    const headers = new Headers(init.headers);
    assert.equal(headers.get("api-key"), "test-avify-secret");
    assert.equal(headers.get("Authorization"), null);
    const body = JSON.parse(init.body as string);
    assert.deepEqual(body.variables, { pageNum: 2, pageSize: 10, locationId: 17, selectMode: "S", skus: ["DN-001"] });
    assert.doesNotMatch(body.query, /\bcost\b|\bcustomer\b|\bmutation\b/);
    return Response.json({ data: { products: { products: [product], pageSize: 10, totalCount: 101 } } });
  });
  const page = await getAvifyProducts({ page: 2, pageSize: 10, skus: ["DN-001"] });
  assert.equal(page.totalCount, 101);
  assert.equal(page.page, 2);
  assert.equal(page.products[0].qty, 0);
  assert.equal(page.products[0].salePrice, 0);
  assert.equal(page.products[0].categories[0].id, "1");
  assert.equal(page.products[0].children[0].sku, "DN-001-250");
});

test("global inventory is explicit when overriding the configured location", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url: URL, init: RequestInit) => {
    assert.equal(JSON.parse(init.body as string).variables.locationId, null);
    return Response.json({ data: { products: { products: [], pageSize: 24, totalCount: 0 } } });
  });
  assert.deepEqual((await getAvifyProducts({ locationId: null })).products, []);
});

test("HTTP 200 GraphQL errors reject partial data without leaking provider messages", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ data: { products: { products: [product], pageSize: 24, totalCount: 1 } }, errors: [{ message: "private-store-information" }] }));
  await assert.rejects(getAvifyProducts(), (error: unknown) => {
    assert.ok(error instanceof Error);
    assert.doesNotMatch(error.message, /private-store-information/);
    return "code" in error && error.code === "GRAPHQL";
  });
});

test("malformed quantities cannot masquerade as valid inventory", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ data: { products: { products: [{ ...product, qty: "unknown" }], pageSize: 24, totalCount: 1 } } }));
  await assert.rejects(getAvifyProducts(), { code: "INVALID_RESPONSE" });
});

test("missing credentials and invalid location fail before any network request", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => { throw new Error("must not fetch"); });
  delete process.env.AVIFY_API_KEY;
  await assert.rejects(checkAvifyConnection(), { code: "CONFIGURATION" });
  process.env.AVIFY_API_KEY = "test-avify-secret";
  process.env.AVIFY_LOCATION_ID = "not-a-location";
  await assert.rejects(getAvifyProducts(), { code: "CONFIGURATION" });
  assert.equal(fetch.mock.callCount(), 0);
});

test("unsafe endpoints and unbounded requests are rejected", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => { throw new Error("must not fetch"); });
  for (const endpoint of ["http://api.avify.com/graphql", "https://key@api.avify.com/graphql", "https://api.avify.com/graphql?key=secret"]) {
    process.env.AVIFY_GRAPHQL_URL = endpoint;
    await assert.rejects(checkAvifyConnection(), { code: "CONFIGURATION" });
  }
  await assert.rejects(getAvifyProducts({ page: 0 }), RangeError);
  await assert.rejects(getAvifyProducts({ pageSize: 101 }), RangeError);
  await assert.rejects(getAvifyProducts({ skus: [] }), RangeError);
  assert.equal(fetch.mock.callCount(), 0);
});
