import { expect, test } from "@playwright/test";

test("home page preserves its content, responsive layout, and appearance", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("region", { name: "Nutrición con esencia en el ADN" })).toMatchAriaSnapshot(`
    - region "Nutrición con esencia en el ADN":
      - paragraph: Nutrición · Educación · Acompañamiento
      - heading "Nutrición con esencia en el ADN" [level=1]
      - paragraph: DNAture parte del respeto por la biología de cada animal. Queremos acompañarte con información clara para comprender su alimentación y elegir con criterio.
      - link "Conocé DNAture":
        - /url: /nosotros
  `);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await expect(page.getByRole("heading", { name: "Información para elegir con criterio", exact: true })).toBeVisible();
  await expect(page).toHaveScreenshot("home.png", { fullPage: true });
});
