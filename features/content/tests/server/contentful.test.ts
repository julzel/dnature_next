import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { getContentfulContentTypes, getContentfulEntries, getContentfulEntry, getProductContentBySku } from "../../server/contentful";

const originalEnvironment = { ...process.env };
beforeEach(() => {
  process.env.CONTENTFUL_SPACE_ID = "test-space";
  process.env.CONTENTFUL_ENVIRONMENT_ID = "staging";
  process.env.CONTENTFUL_DELIVERY_API_KEY = "test-delivery-secret";
  process.env.CONTENTFUL_CMA_TOKEN = "must-never-be-used";
  process.env.CONTENTFUL_LOCALE = "es-CR";
});
afterEach(() => { process.env = { ...originalEnvironment }; });

const entry = { sys: { id: "entry-id", type: "Entry", contentType: { sys: { type: "Link", linkType: "ContentType", id: "product" } } }, fields: { productName: "Producto de prueba", avifySku: "DN-001" } };
function entries(items: unknown[] = [entry], total = items.length) { return { items, total, skip: 0, limit: 24 }; }

test("published content uses the delivery key, configured environment, locale, and pagination", async (t) => {
  t.mock.method(globalThis, "fetch", async (url: URL, init: RequestInit) => {
    assert.equal(url.origin, "https://cdn.contentful.com");
    assert.equal(url.pathname, "/spaces/test-space/environments/staging/entries");
    assert.equal(url.searchParams.get("content_type"), "blogPost");
    assert.equal(url.searchParams.get("locale"), "es-CR");
    assert.equal(url.searchParams.get("skip"), "24");
    assert.equal(url.searchParams.get("include"), "2");
    assert.equal(url.searchParams.get("fields.slug"), "bienestar");
    assert.equal(url.searchParams.has("access_token"), false);
    assert.equal(new Headers(init.headers).get("Authorization"), "Bearer test-delivery-secret");
    assert.doesNotMatch(JSON.stringify(init), /must-never-be-used/);
    return Response.json({ ...entries(), includes: { Asset: [{ sys: { id: "asset-id", type: "Asset" }, fields: { title: "Imagen" } }] } });
  });
  const result = await getContentfulEntries({ contentType: "blogPost", skip: 24, filters: { "fields.slug": "bienestar" } });
  assert.equal(result.items[0].fields.productName, "Producto de prueba");
  assert.equal(result.includes?.Asset?.[0].sys.id, "asset-id");
});

test("missing entries return null while authentication failures remain errors", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 404 }));
  assert.equal(await getContentfulEntry("missing-entry"), null);
  fetch.mock.mockImplementation(async () => new Response(null, { status: 401 }));
  await assert.rejects(getContentfulEntry("entry-id"), { code: "HTTP", status: 401 });
});

test("SKU lookup uses the existing model and detects ambiguous matches", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async (url: URL) => {
    assert.equal(url.searchParams.get("content_type"), "product");
    assert.equal(url.searchParams.get("fields.avifySku"), "DN-001");
    return Response.json(entries());
  });
  assert.equal((await getProductContentBySku("DN-001"))?.fields.avifySku, "DN-001");
  fetch.mock.mockImplementation(async () => Response.json(entries([], 0)));
  assert.equal(await getProductContentBySku("DN-001"), null);
  fetch.mock.mockImplementation(async () => Response.json(entries([entry, entry], 2)));
  await assert.rejects(getProductContentBySku("DN-001"), { code: "INVALID_RESPONSE" });
});

test("empty collections are valid; malformed entries and collections are not", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => Response.json(entries([])));
  assert.deepEqual((await getContentfulEntries({ contentType: "category" })).items, []);
  fetch.mock.mockImplementation(async () => Response.json(entries([{ fields: {} }])));
  await assert.rejects(getContentfulEntries({ contentType: "product" }), { code: "INVALID_RESPONSE" });
  fetch.mock.mockImplementation(async () => Response.json({ items: [], total: "unknown", skip: 0, limit: 24 }));
  await assert.rejects(getContentfulEntries({ contentType: "product" }), { code: "INVALID_RESPONSE" });
});

test("configuration and query validation prevent unexpected destinations or credential query parameters", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => { throw new Error("must not fetch"); });
  await assert.rejects(getContentfulEntry("../another-space"), RangeError);
  await assert.rejects(getContentfulEntries({ contentType: "product", include: 11 }), RangeError);
  await assert.rejects(getContentfulEntries({ contentType: "product", filters: { "access_token": "secret" } as never }), RangeError);
  await assert.rejects(getContentfulEntries({ contentType: "product", locale: "*" }), RangeError);
  delete process.env.CONTENTFUL_DELIVERY_API_KEY;
  await assert.rejects(getContentfulContentTypes(), { code: "CONFIGURATION" });
  assert.equal(fetch.mock.callCount(), 0);
});
