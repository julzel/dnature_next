import { expect, test } from "@playwright/test";

test("landing prototype preserves its content, responsive layout, and appearance", async ({ page }, testInfo) => {
  await page.goto("/prototype");
  await page.evaluate(() => document.fonts.ready);
  await page.locator("img").evaluateAll((images: HTMLImageElement[]) => {
    for (const image of images) image.loading = "eager";
  });
  await expect.poll(() => page.locator("img").evaluateAll((images: HTMLImageElement[]) => images.every((image) => image.complete && image.naturalWidth > 0)), { timeout: 20_000 }).toBe(true);
  await expect(page.getByRole("tabpanel", { name: "Descubrir" })).toMatchAriaSnapshot(`
    - tabpanel "Descubrir":
      - paragraph: Su esencia es única. Su nutrición también importa.
      - heading "Su nutrición empieza por conocerlo." [level=1]
      - paragraph: Cada mascota tiene su propia historia. Te acompañamos a entender su alimentación y a elegir con información clara, a su ritmo y al tuyo.
      - button "Empezar por mi mascota"
      - link "Ver productos":
        - /url: "#productos"
      - paragraph: Sin crear un perfil. Con toda la libertad de explorar.
  `);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await expect(page.getByRole("heading", { name: /Distintas funciones\.\s*Una elección informada\./ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("landing-preview.png") });
  await expect(page).toHaveScreenshot("home.png", { fullPage: true });
});
