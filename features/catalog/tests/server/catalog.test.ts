import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import type { ContentfulAsset, ContentfulEntry, ProductContentFields } from "@/features/content/types/contentful";
import { joinProducts } from "../../lib/join-products";
import { loadAvifyCatalog, loadAvifyProductsBySkus, loadPublishedProductContent } from "../../server/catalog";
import type { AvifyProduct } from "../../types/avify";

const originalEnvironment = { ...process.env };
beforeEach(() => {
  process.env.AVIFY_GRAPHQL_URL = "https://api.avify.com/graphql";
  process.env.AVIFY_API_KEY = "test-avify-secret";
  process.env.CONTENTFUL_SPACE_ID = "test-space";
  process.env.CONTENTFUL_DELIVERY_API_KEY = "test-delivery-secret";
});
afterEach(() => { process.env = { ...originalEnvironment }; });

const commerce: AvifyProduct = {
  id: "1", sku: "PARENT-1", name: "Avify name", status: "active", price: 1200,
  salePrice: null, qty: 5, slug: "avify-slug", type: "variable", description: null,
  categories: [{ id: "2", label: "Proteínas", parentId: null }],
  children: [{ id: "3", sku: "CHILD-1", name: "Small", status: "active", price: 600, salePrice: null, qty: 3 }],
};
const asset: ContentfulAsset = {
  sys: { id: "image-1", type: "Asset" },
  fields: { title: "Product image", file: { url: "//images.ctfassets.net/image-1", fileName: "product.jpg", contentType: "image/jpeg" } },
};
const content: ContentfulEntry<ProductContentFields> = {
  sys: { id: "entry-1", type: "Entry", contentType: { sys: { type: "Link", linkType: "ContentType", id: "product" } } },
  fields: { avifySku: "PARENT-1", productName: "Editorial name", description: "Editorial description", image: [{ sys: { id: "image-1", type: "Link", linkType: "Asset" } }] },
};

test("joins only exact parent SKUs while preserving commerce and resolving published images", () => {
  const result = joinProducts(
    [commerce, { ...commerce, id: "4", sku: "UNMATCHED" }],
    [content, { ...content, sys: { ...content.sys, id: "entry-2" }, fields: { avifySku: "CHILD-1" } }],
    [asset],
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].sku, "PARENT-1");
  assert.equal(result[0].commerce.price, 1200);
  assert.equal(result[0].commerce.children[0].sku, "CHILD-1");
  assert.equal(result[0].editorial.fields.productName, "Editorial name");
  assert.deepEqual(result[0].editorial.images, [asset]);
});

test("missing or unpublished image assets are omitted; duplicate SKU mappings fail", () => {
  assert.deepEqual(joinProducts([commerce], [content], [])[0].editorial.images, []);
  assert.deepEqual(joinProducts([commerce], [{ ...content, fields: {} }], [asset]), []);
  assert.throws(() => joinProducts([commerce], [content, { ...content, sys: { ...content.sys, id: "another" } }], [asset]), { code: "INVALID_RESPONSE" });
  assert.throws(() => joinProducts([commerce, commerce], [content], [asset]), { code: "INVALID_RESPONSE" });
});

test("loads every Avify page and rejects an incomplete catalog", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async (_url: URL, init: RequestInit) => {
    const pageNum = JSON.parse(init.body as string).variables.pageNum;
    return Response.json({ data: { products: { products: pageNum === 1 ? Array.from({ length: 100 }, (_, index) => ({ ...commerce, id: String(index), sku: `P-${index}` })) : [commerce], pageSize: 100, totalCount: 101 } } });
  });
  const products = await loadAvifyCatalog();
  assert.equal(products.length, 101);
  assert.equal(fetch.mock.callCount(), 2);
  fetch.mock.mockImplementation(async (_url: URL, init: RequestInit) => {
    const pageNum = JSON.parse(init.body as string).variables.pageNum;
    return Response.json({ data: { products: { products: pageNum === 1 ? [commerce] : [], pageSize: 100, totalCount: 101 } } });
  });
  await assert.rejects(loadAvifyCatalog(), { code: "INVALID_RESPONSE" });
});

test("accepts Avify's observed off-by-one total on a short final page", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url: URL, init: RequestInit) => {
    const pageNum = JSON.parse(init.body as string).variables.pageNum;
    const products = pageNum === 1
      ? Array.from({ length: 100 }, (_, index) => ({ ...commerce, id: String(index), sku: `P-${index}` }))
      : [commerce];
    return Response.json({ data: { products: { products, pageSize: 100, totalCount: 102 } } });
  });
  assert.equal((await loadAvifyCatalog()).length, 101);
});

test("cart and checkout SKU lookup finds later-page products when Avify ignores SKU filters", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async (_url: URL, init: RequestInit) => {
    const variables = JSON.parse(init.body as string).variables;
    assert.equal(variables.skus, undefined);
    const products = variables.pageNum === 3 ? [commerce]
      : Array.from({ length: 100 }, (_, index) => ({ ...commerce, sku: `P-${variables.pageNum}-${index}` }));
    return Response.json({ data: { products: { products, pageSize: 100, totalCount: 201 } } });
  });
  const selected = await loadAvifyProductsBySkus(["PARENT-1", "P-1-0"]);
  assert.deepEqual(selected.map((product) => product.sku), ["P-1-0", "PARENT-1"]);
  assert.equal(fetch.mock.callCount(), 3);
  assert.deepEqual(await loadAvifyProductsBySkus(["MISSING"]), []);
  const calls = fetch.mock.callCount();
  for (const skus of [[], [""], ["x".repeat(201)]]) await assert.rejects(loadAvifyProductsBySkus(skus), RangeError);
  assert.equal(fetch.mock.callCount(), calls);
});

test("loads published Contentful entries and their linked assets in one collection read", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async (url: URL) => {
    assert.equal(url.searchParams.get("content_type"), "product");
    assert.equal(url.searchParams.get("limit"), "1000");
    assert.equal(url.searchParams.get("include"), "1");
    return Response.json({ items: [content], total: 1, skip: 0, limit: 1000, includes: { Asset: [asset] } });
  });
  const published = await loadPublishedProductContent();
  assert.deepEqual(published.entries, [content]);
  assert.deepEqual(published.assets, [asset]);
  assert.equal(fetch.mock.callCount(), 1);
});

test("loads all Contentful pages and rejects a missing later page", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async (url: URL) => {
    const skip = Number(url.searchParams.get("skip"));
    const items = skip === 0
      ? Array.from({ length: 1000 }, (_, index) => ({ ...content, sys: { ...content.sys, id: `entry-${index}` } }))
      : [content];
    return Response.json({ items, total: 1001, skip, limit: 1000 });
  });
  assert.equal((await loadPublishedProductContent()).entries.length, 1001);
  assert.equal(fetch.mock.callCount(), 2);
  fetch.mock.mockImplementation(async (url: URL) => {
    const skip = Number(url.searchParams.get("skip"));
    return Response.json({ items: skip === 0 ? Array.from({ length: 1000 }, () => content) : [], total: 1001, skip, limit: 1000 });
  });
  await assert.rejects(loadPublishedProductContent(), { code: "INVALID_RESPONSE" });
});
