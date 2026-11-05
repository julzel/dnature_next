import { expect, test } from "@playwright/test";
import { canonicalUrl, indexingHeaders, resolveSeoConfig } from "../../lib/seo/config";
import { pageMetadata, robotsRules, sitemapEntries } from "../../lib/seo/metadata";
import { productData, serializeJsonLd, type ProductRecord } from "../../lib/seo/structured-data";

const production = { NODE_ENV: "production", SITE_URL: "https://dnaturefood.com", SEO_INDEXING_ENABLED: "true" };

for (const [name, env] of [
  ["launch flag disabled", { ...production, SEO_INDEXING_ENABLED: "false" }],
  ["development", { ...production, NODE_ENV: "development" }],
  ["Vercel preview", { ...production, VERCEL_ENV: "preview" }],
  ["Netlify preview", { ...production, CONTEXT: "deploy-preview" }],
] as const) {
  test(`${name} cannot expose an indexable sitemap or page`, () => {
    const config = resolveSeoConfig(env);
    expect(config.indexable).toBe(false);
    expect(sitemapEntries(config)).toEqual([]);
    expect(robotsRules(config).sitemap).toBeUndefined();
    expect(pageMetadata({ path: "/", title: "DNAture", description: "Test" }, config).robots).toMatchObject({ index: false, follow: false });
    expect(indexingHeaders(config)).toEqual([{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]);
  });
}

test("production requires an explicit indexing opt-in", () => {
  expect(resolveSeoConfig({ NODE_ENV: "production" }).indexable).toBe(false);
  expect(resolveSeoConfig(production).indexable).toBe(true);
});

test("canonical URLs reject foreign origins, queries, and invalid deployment URLs", () => {
  expect(canonicalUrl("/ciencia/")).toBe("https://dnaturefood.com/ciencia");
  for (const path of ["//other.example", "https://other.example", "/?utm_source=test", "/ciencia#section", "/\\other.example"]) {
    expect(() => canonicalUrl(path)).toThrow();
  }
  for (const origin of ["http://dnaturefood.com", "https://dnaturefood.com/path", "https://user:pass@dnaturefood.com", "http://localhost:3100"]) {
    expect(() => resolveSeoConfig({ SITE_URL: origin })).toThrow();
  }
});

test("private page metadata stays noindex on production", () => {
  expect(pageMetadata({ path: "/mi-dnature/mascotas", title: "Perfil", description: "Privado" }, resolveSeoConfig(production)).robots).toMatchObject({ index: false });
});

test("training restrictions do not disable search discovery", () => {
  const rules = robotsRules(resolveSeoConfig({ ...production, GPTBOT_POLICY: "disallow" })).rules;
  expect(rules).toContainEqual({ userAgent: "GPTBot", disallow: "/" });
  expect(rules).toContainEqual({ userAgent: "OAI-SearchBot", allow: "/" });
  expect(() => resolveSeoConfig({ GPTBOT_POLICY: "unknown" })).toThrow();
});

test("JSON-LD cannot terminate its script element", () => {
  const payload = { name: "</script><script>alert(1)</script>\u2028\u2029" };
  const json = serializeJsonLd(payload);
  expect(json).not.toContain("<");
  expect(JSON.parse(json)).toEqual(payload);
});

// Synthetic test fixture; never imported by a public route or a product feed.
const product: ProductRecord = {
  status: "verified", approvedBy: "Test reviewer", reviewedAt: "2026-11-05",
  name: "Test product", sku: "TEST-ONLY", path: "/producto/test-only", description: "Test description",
  image: "https://dnaturefood.com/test-only.jpg", priceCRC: 1000, availability: "InStock",
  species: "Test species", nutritionalRole: "Test role", ingredients: "Test ingredients",
  guaranteedAnalysis: "Test analysis", usageAndStorage: "Test instructions",
};

test("unverified and excluded source records never generate product offers", () => {
  expect(productData({ ...product, status: "draft" })).toBeNull();
  expect(productData({ ...product, status: "excluded" })).toBeNull();
  expect(() => productData({ ...product, approvedBy: "" })).toThrow();
  expect(() => productData({ ...product, guaranteedAnalysis: "" })).toThrow();
  expect(() => productData({ ...product, priceCRC: Number.NaN })).toThrow();
  expect(productData(product)?.offers).toMatchObject({ priceCurrency: "CRC", price: 1000, url: "https://dnaturefood.com/producto/test-only" });
});
