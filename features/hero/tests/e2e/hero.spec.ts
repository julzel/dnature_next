import { expect, test } from "@playwright/test";

for (const viewport of [
  { width: 320, height: 700, layout: "mobile" },
  { width: 1440, height: 900, layout: "desktop" },
] as const) {
  test(`${viewport.layout} hero fills the viewport beneath the header`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");

    const hero = await page.locator('[data-section="hero"]').boundingBox();
    const content = await page.locator('[data-hero-section="content"]').boundingBox();
    const image = await page.locator('[data-hero-section="image"]').boundingBox();
    const header = await page.getByRole("banner").boundingBox();

    expect(hero).not.toBeNull();
    expect(content).not.toBeNull();
    expect(image).not.toBeNull();
    expect(header).not.toBeNull();
    expect(hero!.y).toBe(0);
    expect(hero!.height).toBeGreaterThanOrEqual(viewport.height);
    expect(header!.y).toBe(0);
    expect(header!.y + header!.height).toBeGreaterThan(hero!.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lorem ipsum dolor sit amet.");
    const photo = page.getByRole("img", { name: "Perro husky en un sendero del bosque." });
    await expect.poll(() => photo.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    const actions = page.locator('[data-hero-section="content"]').getByRole("link");
    await expect(actions).toHaveCount(2);
    for (const action of await actions.all()) {
      await expect(action).toBeVisible();
      await expect(action.locator("svg")).toHaveCSS("color", "rgb(255, 106, 0)");
    }
    await expect(page.locator('[data-hero-section="content"]')).toHaveCSS("background-color", "rgb(9, 47, 57)");

    if (viewport.layout === "mobile") {
      await expect(page.getByRole("button", { name: "Abrir menú", exact: true })).toHaveCSS("color", "rgb(255, 255, 255)");
      await expect(page.getByRole("button", { name: "Abrir búsqueda", exact: true })).toHaveCSS("color", "rgb(255, 255, 255)");
      expect(content!.x).toBe(image!.x);
      expect(image!.y).toBe(content!.y + content!.height);
      expect(image!.width).toBe(viewport.width);
      expect(image!.height).toBeCloseTo(content!.height, 0);
    } else {
      expect(content!.y).toBe(image!.y);
      expect(image!.x).toBe(content!.x + content!.width);
      expect(image!.height).toBe(hero!.height);
    }

    await page.screenshot({ path: testInfo.outputPath("hero.png"), fullPage: true });
    await page.getByRole("button", { name: "Abrir búsqueda", exact: true }).click();
    await expect(page.getByRole("searchbox", { name: "Buscar en el sitio" })).toBeVisible();
    expect((await page.getByRole("main").boundingBox())?.y).toBe(0);
  });
}
