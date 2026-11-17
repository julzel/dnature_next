import { expect, test } from "@playwright/test";
import { publicPages } from "../../lib/seo/pages";

for (const entry of [{ path: "/" }, { path: "/prototype" }, ...publicPages]) {
  test(`preview ${entry.path} stays noindex despite the launch flag`, async ({ page }) => {
    const response = await page.goto(entry.path);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  });
}

test("preview exposes no sitemap entries but permits bots to read noindex", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).not.toContain("<loc>");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Allow: /");
  expect(await robots.text()).not.toContain("Sitemap:");
});

for (const path of ["/contacto", "/mi-dnature/mis-mascotas", "/images/pets/dog.svg", "/this-page-does-not-exist"]) {
  test(`non-indexable deployment also protects ${path}`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  });
}
