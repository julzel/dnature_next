import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
});

test("mobile menu sits beside search, traps focus, and closes with Escape", async ({ page }) => {
  const menu = page.getByRole("button", { name: "Abrir menú", exact: true });
  const search = page.getByRole("button", { name: "Abrir búsqueda", exact: true });
  const menuBounds = await menu.boundingBox();
  const searchBounds = await search.boundingBox();
  expect(menuBounds!.y).toBe(searchBounds!.y);
  expect(menuBounds!.x).toBe(searchBounds!.x + searchBounds!.width + 8);
  await expect(page.getByRole("navigation", { name: "Navegación principal", exact: true })).toBeHidden();
  await menu.click();
  const drawer = page.getByRole("dialog", { name: "Menú", exact: true });
  const close = drawer.getByRole("button", { name: "Cerrar menú", exact: true });
  await expect(drawer).toBeVisible();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(close).toBeFocused();
  expect((await drawer.boundingBox())!.x).toBe(0);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(drawer).toHaveCSS("transition-duration", "0s");
  await close.press("Shift+Tab");
  await expect(drawer.getByRole("link", { name: "Nosotros", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("drawer slides from the left and dismisses through its backdrop and close button", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const menu = page.getByRole("button", { name: "Abrir menú", exact: true });
  await menu.click();
  const drawer = page.getByRole("dialog", { name: "Menú", exact: true });
  const transforms = await drawer.evaluate(async (element) => {
    const animation = element.getAnimations().find((item) => (item as CSSTransition).transitionProperty === "transform");
    const frames = (animation?.effect as KeyframeEffect | null)?.getKeyframes().map((frame) => frame.transform);
    await Promise.all(element.getAnimations().map((item) => item.finished));
    return frames;
  });
  expect(transforms).toBeDefined();
  expect(transforms![0]).toMatch(/-320|\-100%/);
  expect((await drawer.boundingBox())!.x).toBe(0);
  await page.screenshot({ path: testInfo.outputPath("mobile-menu-open.png") });
  await page.mouse.click(380, 400);
  await expect(drawer).not.toBeVisible();
  await menu.click();
  await drawer.getByRole("button", { name: "Cerrar menú", exact: true }).click();
  await expect(drawer).not.toBeVisible();
  await expect(menu).toBeFocused();
});

test("opening the menu closes search, links navigate, and desktop resize dismisses it", async ({ page }) => {
  await page.getByRole("button", { name: "Abrir búsqueda", exact: true }).click();
  await expect(page.getByRole("search")).toBeVisible();
  await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
  await expect(page.getByRole("search")).toHaveCount(0);
  const drawer = page.getByRole("dialog", { name: "Menú", exact: true });
  await drawer.getByRole("link", { name: "Ciencia", exact: true }).click();
  await expect(page).toHaveURL("/ciencia");
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menú", exact: true }).click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(drawer).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Abrir menú", exact: true })).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Navegación principal", exact: true })).toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});
