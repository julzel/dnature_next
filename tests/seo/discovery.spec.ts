import { expect, test } from "@playwright/test";
import { brand } from "../../lib/seo/config";
import { publicPages } from "../../lib/seo/pages";

// Discovery and meaningful content must work without client-side JavaScript.
test.use({ javaScriptEnabled: false });

for (const entry of publicPages) {
  test(`${entry.path} serves consistent Spanish metadata and crawlable HTML`, async ({ page }) => {
    const response = await page.goto(`${entry.path}?utm_source=regression`);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"]).toBeUndefined();
    await expect(page.locator("html")).toHaveAttribute("lang", "es-CR");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(entry.title);
    await expect(page).toHaveTitle(`${entry.title} | ${brand.name}`);
    const canonical = `${brand.origin}${entry.path}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", canonical);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S.{40,}/);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "es_CR");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", await page.title());
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  });
}

test("sitemap lists exactly the implemented public canonicals", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("xml");
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  expect(urls.sort()).toEqual(publicPages.map((page) => `${brand.origin}${page.path}`).sort());
  expect(xml).not.toContain("<lastmod>");
});

test("search crawler access and training policy remain independent", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const robots = await response.text();
  expect(robots).toContain("User-Agent: *\nAllow: /");
  expect(robots).toContain("User-Agent: OAI-SearchBot\nAllow: /");
  expect(robots).toContain(`Sitemap: ${brand.origin}/sitemap.xml`);
  expect(robots).not.toContain("User-Agent: GPTBot");
});

for (const path of ["/cuenta", "/mi-dnature/mascotas", "/checkout", "/carrito", "/buscar?q=pollo", "/pedidos/123"]) {
  test(`${path} has a noindex HTTP header even before its page exists`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  });
}

test("prototype identity contains only documented brand facts", async ({ page, request }) => {
  await page.goto("/prototype");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  const identity = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(identity["@graph"].map((node: { "@type": string }) => node["@type"])).toEqual(["Organization", "WebSite"]);
  expect(identity["@graph"][0]).toMatchObject({ name: "DNAture", url: brand.origin, slogan: brand.tagline });
  expect(JSON.stringify(identity)).not.toMatch(/aggregateRating|LocalBusiness|Offer|GTIN|address/);
  const imageURL = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(imageURL).toBeTruthy();
  // Fetch the locally generated image rather than contacting the production site.
  const image = await request.get(new URL(imageURL!).pathname);
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
});

test("breadcrumb schema matches the visible navigation", async ({ page }) => {
  await page.goto("/ciencia/nuestros-criterios");
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(schema["@type"]).toBe("BreadcrumbList");
  const names = await page.getByRole("navigation", { name: "Ruta de navegación" }).locator("li").allTextContents();
  expect(schema.itemListElement.map((item: { name: string }) => item.name)).toEqual(names);
  expect(schema.itemListElement.map((item: { position: number }) => item.position)).toEqual([1, 2, 3]);
  expect(schema.itemListElement.at(-1).item).toBe(`${brand.origin}/ciencia/nuestros-criterios`);
});
