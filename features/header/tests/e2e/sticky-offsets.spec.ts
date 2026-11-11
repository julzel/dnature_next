import { expect, test } from "@playwright/test";

test.setTimeout(60_000);

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  for (const route of ["/nosotros", "/productos", "/preguntas-frecuentes"]) {
    test(`${route} sticky content follows header visibility (${reducedMotion})`, async ({ page }) => {
      test.skip(route === "/preguntas-frecuentes" && page.viewportSize()!.width < 1024, "FAQ topics only stick on desktop");
      await page.emulateMedia({ reducedMotion });
      await page.goto(route);
      const header = page.getByRole("banner");
      const sticky = route === "/nosotros"
        ? page.getByRole("navigation", { name: "En esta página" })
        : route === "/productos"
          ? page.locator("#catalogo").getByRole("search").locator("..")
          : page.getByRole("navigation", { name: "Temas de preguntas frecuentes" });
      await expect(sticky).toBeVisible({ timeout: 45_000 });
      const gap = route === "/preguntas-frecuentes" ? 24 : 0;
      await sticky.evaluate((element) => window.scrollTo({ top: window.scrollY + element.getBoundingClientRect().top + 350, behavior: "instant" }));
      await expect(header).not.toBeInViewport();
      await expect.poll(() => sticky.evaluate((element) => element.getBoundingClientRect().top)).toBeCloseTo(gap, 0);
      if (reducedMotion === "reduce") await expect(sticky).toHaveCSS("transition-duration", "0s");

      const filters = page.getByRole("complementary", { name: "Filtrar productos" });
      if (route === "/productos" && page.viewportSize()!.width >= 1024) {
        await expect.poll(async () => {
          const toolbar = (await sticky.boundingBox())!;
          return (await filters.boundingBox())!.y - (toolbar.y + toolbar.height);
        }).toBeCloseTo(0, 0);
      }

      await page.evaluate(() => window.scrollBy({ top: -24, behavior: "instant" }));
      await expect.poll(() => header.evaluate((element) => element.getBoundingClientRect().bottom)).toBe(74);
      await expect.poll(() => sticky.evaluate((element) => element.getBoundingClientRect().top)).toBeCloseTo(74 + gap, 0);
      if (route === "/productos" && page.viewportSize()!.width >= 1024) {
        await expect.poll(async () => {
          const toolbar = (await sticky.boundingBox())!;
          return (await filters.boundingBox())!.y - (toolbar.y + toolbar.height);
        }).toBeCloseTo(0, 0);
      }

      await page.evaluate(() => window.scrollBy({ top: 48, behavior: "instant" }));
      await expect(header).not.toBeInViewport();
      await header.getByRole("link", { name: "DNAture, inicio", exact: true }).focus();
      await expect.poll(() => sticky.evaluate((element) => element.getBoundingClientRect().top)).toBeCloseTo(74 + gap, 0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
    });
  }
}
