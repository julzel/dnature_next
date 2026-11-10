import { expect, test } from "@playwright/test";

test("arrival choices share a flat surface and navigate to the chosen section", async ({ page }, testInfo) => {
  await page.goto("/", { waitUntil: "commit" });
  const dialog = page.getByRole("dialog", { name: "Elegí cómo explorar DNAture", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading")).toHaveCount(0);
  await expect(dialog).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(dialog).toHaveCSS("border-radius", "0px");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(page.locator("#experiencia")).toHaveCount(0);
  const personalized = dialog.getByRole("link", { name: "Visita guiada", exact: true });
  const explore = dialog.getByRole("button", { name: "Explorar por mi cuenta", exact: true });
  for (const choice of [personalized, explore]) {
    await expect(choice).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(choice).toHaveCSS("border-radius", "0px");
    await expect(choice).toHaveCSS("box-shadow", "none");
    await expect(choice.locator("img")).toHaveAttribute("alt", "");
    await expect.poll(() => choice.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  }
  await expect(personalized.locator("img")).toHaveAttribute("src", "/images/experiences/visita-guiada.svg");
  await expect(explore.locator("img")).toHaveAttribute("src", "/images/experiences/explorar-por-mi-cuenta.svg");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(page.viewportSize()!.width);
  await dialog.screenshot({ path: testInfo.outputPath("experience-choices.png") });
  await expect(personalized).toBeFocused();
  await personalized.click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/#experiencia-personalizada$/);
  await expect(page.locator("#experiencia-personalizada")).toBeInViewport();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("experience illustrations reveal on view and respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "commit" });
  const dialog = page.getByRole("dialog", { name: "Elegí cómo explorar DNAture", exact: true });
  const guide = dialog.locator('[data-illustration="guided"]');
  const explorer = dialog.locator('[data-illustration="explore"]');

  await guide.scrollIntoViewIfNeeded();
  await expect(guide).toHaveCSS("animation-name", /reveal-illustration/);
  await explorer.scrollIntoViewIfNeeded();
  await expect(explorer).toHaveCSS("animation-name", /reveal-illustration/);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(guide).toHaveCSS("animation-name", "none");
  await expect(explorer).toHaveCSS("animation-name", "none");
});

test("explore choice and Escape both dismiss the modal", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });
  const dialog = page.getByRole("dialog", { name: "Elegí cómo explorar DNAture", exact: true });
  const initialURL = page.url();
  const initialScroll = await page.evaluate(() => window.scrollY);
  await dialog.getByRole("button", { name: "Explorar por mi cuenta", exact: true }).click();
  await expect(page).toHaveURL(initialURL);
  await expect(dialog).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(initialScroll);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await page.goto("/", { waitUntil: "commit" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
