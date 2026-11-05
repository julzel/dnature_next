import { expect, test } from "@playwright/test";
import { publicPages } from "../../lib/seo/pages";

for (const entry of publicPages) {
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
