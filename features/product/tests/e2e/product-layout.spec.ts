import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`product layout at ${width}px preserves order, controls and reading surfaces`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/producto/oreja-de-res-sin-pelo-deshidratada");
    await expect(page.getByRole("button", { name: "Agregar al carrito", exact: true })).toBeEnabled({ timeout: 45_000 });
    await page.locator('main article > div').first().evaluate(async () => { await document.fonts.ready; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    expect(await page.getByRole("heading", { level: 1 }).evaluate((element) => Boolean(element.compareDocumentPosition(document.querySelector('main img')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`product-${width}.png`), fullPage: true });
  });
}
