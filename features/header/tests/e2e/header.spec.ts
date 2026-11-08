import { expect, test } from "@playwright/test";
import { dismissArrivalDialog } from "../../../../tests/helpers/dismiss-arrival-dialog";

test.beforeEach(async ({ page }) => { await page.goto("/"); await dismissArrivalDialog(page); });

test("header contains a 74px navigation row without a top section", async ({ page }) => {
  const bottom = page.locator('[data-header-section="bottom"]');
  await expect(page.locator('[data-header-section="top"]')).toHaveCount(0);
  await expect(bottom).toHaveCSS("border-bottom-width", "0px");
  expect((await page.getByRole("banner").boundingBox())?.height).toBe(74);
  expect((await bottom.boundingBox())?.height).toBe(74);
  await expect(page.locator("#site-search")).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("header fades with scroll and returns to transparent at the top", async ({ page }) => {
  const header = page.getByRole("banner");
  const logo = header.getByRole("link", { name: "DNAture, inicio", exact: true }).locator("img");
  const bottom = page.locator('[data-header-section="bottom"]');
  await page.evaluate(() => {
    const spacer = document.createElement("div");
    spacer.style.height = "200vh";
    document.body.appendChild(spacer);
  });

  await expect(bottom).toHaveCSS("background-color", "rgba(255, 255, 255, 0)");
  await expect(logo).toHaveCSS("filter", "brightness(0) invert(1)");
  await expect.poll(() => logo.evaluate((image) => image.getBoundingClientRect().width)).toBeCloseTo(114, 0);
  const fadeDistance = page.viewportSize()!.width < 1024 ? 45 : 60;
  const midway = Math.floor(fadeDistance / 2);
  await page.evaluate((position) => window.scrollTo(0, position), midway);
  await expect.poll(() => bottom.evaluate((element) => Number(getComputedStyle(element).backgroundColor.match(/,\s*([\d.]+)\)$/)?.[1]))).toBeCloseTo(midway / fadeDistance, 2);
  await expect(logo).not.toHaveCSS("filter", "brightness(0) invert(1)");
  await expect.poll(() => logo.evaluate((image) => image.getBoundingClientRect().width)).toBeCloseTo(114, 0);
  expect((await header.boundingBox())?.y).toBe(0);
  await page.evaluate((position) => window.scrollTo(0, position), fadeDistance);
  await expect(bottom).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(logo).toHaveCSS("filter", "brightness(1) invert(0)");
  await expect.poll(() => logo.evaluate((image) => image.getBoundingClientRect().width)).toBeCloseTo(114, 0);
  expect((await header.boundingBox())?.height).toBe(74);
  await expect(header.getByRole("navigation", { name: "Navegación principal", includeHidden: true }).getByRole("link", { name: "Ciencia", exact: true, includeHidden: true })).toHaveCSS("color", "rgb(32, 50, 55)");
  await expect(header.getByRole("button", { name: "Abrir búsqueda", exact: true })).toHaveCSS("color", "rgb(32, 50, 55)");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(bottom).toHaveCSS("background-color", "rgba(255, 255, 255, 0)");
  await expect(logo).toHaveCSS("filter", "brightness(0) invert(1)");
  await expect.poll(() => logo.evaluate((image) => image.getBoundingClientRect().width)).toBeCloseTo(114, 0);
});

test("header reaches solid white without animation lag on a fast scroll", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const bottom = page.locator('[data-header-section="bottom"]');
  const fadeDistance = page.viewportSize()!.width < 1024 ? 45 : 60;
  const background = await page.evaluate(async (position) => {
    window.scrollTo({ top: position, behavior: "instant" });
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    return getComputedStyle(document.querySelector('[data-header-section="bottom"]')!).backgroundColor;
  }, fadeDistance);
  expect(background).toBe("rgb(255, 255, 255)");
  await expect(bottom).toHaveCSS("background-color", "rgb(255, 255, 255)");
});

test("Spotlight search opens near the upper center, contains focus, and closes with Escape", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const toggle = page.getByRole("button", { name: "Abrir búsqueda", exact: true, includeHidden: true });
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Buscar en DNAture" });
  const input = dialog.getByRole("searchbox", { name: "Buscar en el sitio" });
  await expect(input).toBeFocused();
  await dialog.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
  const box = (await dialog.boundingBox())!;
  expect(box.x + box.width / 2).toBeCloseTo(page.viewportSize()!.width / 2, 0);
  expect(box.y).toBeCloseTo(Math.min(160, Math.max(80, page.viewportSize()!.height * .2)), 0);
  expect(box.height).toBeLessThan(100);
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await input.press("Tab");
  const close = dialog.getByRole("button", { name: "Cerrar búsqueda", exact: true });
  await expect(close).toBeFocused();
  await close.press("Shift+Tab");
  await expect(input).toBeFocused();
  await page.screenshot({ path: testInfo.outputPath("search-dialog.png") });
  await input.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("search closes and reopens reliably with live results", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const toggle = page.getByRole("button", { name: "Abrir búsqueda", exact: true });
  for (let attempt = 0; attempt < 3; attempt++) {
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Buscar en DNAture" });
    const input = dialog.getByRole("searchbox", { name: "Buscar en el sitio" });
    await input.fill("ciencia");
    await expect(dialog.getByRole("link")).toHaveCount(1);
    await input.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    expect((await page.getByRole("banner").boundingBox())!.height).toBe(74);
  }
  await toggle.click();
  await expect(page.getByRole("searchbox")).toHaveValue("ciencia");
});

test("search stays independent of header scrolling and dismisses through its backdrop", async ({ page }) => {
  await page.evaluate(() => window.scrollTo({ top: 300, behavior: "instant" }));
  const initialScroll = await page.evaluate(() => window.scrollY);
  const toggle = page.getByRole("button", { name: "Abrir búsqueda", exact: true });
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Buscar en DNAture" });
  const before = await dialog.boundingBox();
  const surface = await dialog.evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(await page.evaluate(() => window.scrollY)).toBe(initialScroll);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(dialog).toHaveCSS("background-color", surface);
  expect((await dialog.boundingBox())!.y).toBe(before!.y);
  await page.mouse.click(4, 4);
  await expect(dialog).toBeHidden();
  await expect(toggle).toBeFocused();
});

test("search updates while typing, clears accessibly, and keeps the input steady", async ({ page }) => {
  await page.getByRole("button", { name: "Abrir búsqueda", exact: true }).click();
  const search = page.getByRole("search", { name: "Buscar en DNAture" });
  const input = search.getByRole("searchbox", { name: "Buscar en el sitio" });
  const initialTop = (await input.boundingBox())!.y;
  await input.fill("nutricion");
  await expect(search.getByRole("button")).toHaveCount(1);
  await expect(search.getByRole("button", { name: "Borrar búsqueda", exact: true })).toBeVisible();
  await expect(search.getByRole("button", { name: "Buscar", exact: true })).toHaveCount(0);
  await expect(search.getByRole("status")).toHaveText("1 página encontrada.");
  await expect(search.getByRole("link", { name: "Ciencia y nutrición fisiológica", exact: true })).toHaveAttribute("href", "/ciencia");
  expect((await input.boundingBox())!.y).toBe(initialTop);
  await input.fill("unmatched-query");
  await expect(search.getByRole("status")).toContainText("No encontramos páginas");
  await expect(search.getByRole("link")).toHaveCount(0);
  await search.getByRole("button", { name: "Borrar búsqueda", exact: true }).click();
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();
  await expect(search.getByRole("status")).toHaveCount(0);
  await expect(search.getByRole("button", { name: "Borrar búsqueda", exact: true })).toHaveCount(0);
  await expect(search.getByRole("button")).toHaveCount(1);
  await expect(search.getByRole("button", { name: "Cerrar búsqueda", exact: true })).toBeVisible();
  await input.fill("   ");
  await expect(search.getByRole("status")).toHaveCount(0);
  await search.getByRole("button", { name: "Borrar búsqueda", exact: true }).click();
  await search.getByRole("button", { name: "Cerrar búsqueda", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("Spotlight arrow keys navigate results and Enter opens a match", async ({ page }) => {
  await page.getByRole("button", { name: "Abrir búsqueda", exact: true }).click();
  const input = page.getByRole("searchbox");
  await input.fill("ciencia");
  const result = page.getByRole("search").getByRole("link", { name: "Ciencia y nutrición fisiológica", exact: true });
  await input.press("ArrowDown");
  await expect(result).toBeFocused();
  await result.press("ArrowUp");
  await expect(input).toBeFocused();
  await input.press("Enter");
  await expect(page).toHaveURL(/\/ciencia$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("search dialog fits narrow phones and short viewports", async ({ page }) => {
  for (const viewport of [{ width: 320, height: 700 }, { width: 390, height: 360 }, { width: 1024, height: 700 }]) {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "Abrir búsqueda", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Buscar en DNAture" });
    const input = dialog.getByRole("searchbox");
    await expect(input).toBeInViewport();
    await input.fill("ciencia");
    const clear = dialog.getByRole("button", { name: "Borrar búsqueda", exact: true });
    await expect(clear).toBeInViewport();
    expect((await clear.boundingBox())!.width).toBeGreaterThanOrEqual(44);
    expect((await input.boundingBox())!.width).toBeLessThanOrEqual(500);
    expect((await dialog.boundingBox())!.height).toBeLessThanOrEqual(viewport.height - 32);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    await input.press("Escape");
  }
});
