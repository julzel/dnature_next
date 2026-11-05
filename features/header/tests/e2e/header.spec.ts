import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/"); });

test("header uses the requested row heights and top color", async ({ page }) => {
  const top = page.locator('[data-header-section="top"]');
  const bottom = page.locator('[data-header-section="bottom"]');
  await expect(top).toHaveCSS("background-color", "rgb(18, 69, 99)");
  expect((await top.boundingBox())?.height).toBe(33);
  expect((await bottom.boundingBox())?.height).toBe(78);
  expect((await page.locator('#header-search').boundingBox())?.height).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("header fades with scroll and returns to transparent at the top", async ({ page }) => {
  const header = page.getByRole("banner");
  const bottom = page.locator('[data-header-section="bottom"]');
  await page.evaluate(() => {
    const spacer = document.createElement("div");
    spacer.style.height = "200vh";
    document.body.appendChild(spacer);
  });

  await expect(bottom).toHaveCSS("background-color", "rgba(255, 255, 255, 0)");
  await page.evaluate(() => window.scrollTo(0, 60));
  await expect(bottom).toHaveCSS("background-color", "rgba(255, 255, 255, 0.5)");
  expect((await header.boundingBox())?.y).toBe(0);
  await page.evaluate(() => window.scrollTo(0, 120));
  await expect(bottom).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bottom).toHaveCSS("background-color", "rgba(255, 255, 255, 0)");
});

test("search opens below navigation, receives focus, and closes with Escape", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const toggle = page.getByRole("button", { name: "Abrir búsqueda", exact: true });
  await expect(page.getByRole("search")).toHaveCount(0);
  await toggle.click();
  const search = page.getByRole("search", { name: "Buscar en DNAture" });
  const input = search.getByRole("searchbox", { name: "Buscar en el sitio" });
  await expect(search).toBeVisible();
  await expect(input).toBeFocused();
  await page.locator("#header-search").evaluate(async (panel) => {
    await Promise.all(panel.getAnimations({ subtree: true }).map((animation) => animation.finished));
  });
  await expect(input).toBeInViewport({ ratio: 1 });
  await expect(page.getByRole("button", { name: "Cerrar búsqueda", exact: true })).toHaveAttribute("aria-expanded", "true");
  const bottom = await page.locator('[data-header-section="bottom"]').boundingBox();
  const panel = await page.locator('#header-search').boundingBox();
  expect(panel!.y).toBe(bottom!.y + bottom!.height);
  await page.screenshot({ path: testInfo.outputPath("header-search-open.png") });
  await input.press("Escape");
  await expect(search).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Abrir búsqueda", exact: true })).toBeFocused();
});

test("search finds actual public pages and gives useful empty-result feedback", async ({ page }) => {
  await page.getByRole("button", { name: "Abrir búsqueda", exact: true }).click();
  const search = page.getByRole("search", { name: "Buscar en DNAture" });
  const input = search.getByRole("searchbox", { name: "Buscar en el sitio" });
  await input.fill("nutricion");
  await search.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(search.getByRole("status")).toHaveText("1 página encontrada.");
  await expect(search.getByRole("link", { name: "Ciencia y nutrición fisiológica", exact: true })).toHaveAttribute("href", "/ciencia");
  await input.fill("unmatched-query");
  await input.press("Enter");
  await expect(search.getByRole("status")).toContainText("No encontramos páginas");
  await expect(search.getByRole("link")).toHaveCount(0);
});

test("header and expanded search fit a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.getByRole("button", { name: "Abrir búsqueda", exact: true }).click();
  await expect(page.getByRole("searchbox", { name: "Buscar en el sitio" })).toBeInViewport();
  const button = page.getByRole("search").getByRole("button", { name: "Buscar", exact: true });
  await expect(button).toBeInViewport();
  await expect(button.locator("svg")).toBeVisible();
  await expect(button.getByText("Buscar", { exact: true })).toBeHidden();
  expect((await button.boundingBox())!.width).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.setViewportSize({ width: 1024, height: 700 });
  await expect(button.locator("svg")).toBeVisible();
  await expect(button.getByText("Buscar", { exact: true })).toBeVisible();
});
