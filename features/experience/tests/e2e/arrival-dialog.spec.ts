import { expect, test } from "@playwright/test";

test("arrival choices open in a transparent modal and navigate to the chosen section", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const dialog = page.getByRole("dialog", { name: "Elegí cómo explorar DNAture", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading")).toHaveCount(0);
  await expect(dialog).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(page.locator("#experiencia")).toHaveCount(0);
  const personalized = dialog.getByRole("link", { name: "Visita guiada", exact: true });
  const explore = dialog.getByRole("button", { name: "Explorar por mi cuenta", exact: true });
  for (const choice of [personalized, explore]) {
    await expect(choice).toHaveCSS("background-color", "rgb(255, 255, 255)");
    const bounds = await choice.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.height).toBeCloseTo(bounds!.width, 0);
  }
  await expect(personalized.locator('[data-illustration="guide-cat"]')).toBeVisible();
  await expect(explore.locator('[data-illustration="explorer-dog"]')).toBeVisible();
  await expect(personalized).toBeFocused();
  await personalized.click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/#experiencia-personalizada$/);
  await expect(page.locator("#experiencia-personalizada")).toBeInViewport();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("pet illustrations animate on view and respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const dialog = page.getByRole("dialog", { name: "Elegí cómo explorar DNAture", exact: true });
  const guide = dialog.locator('[data-motion="guide"]');
  const explorer = dialog.locator('[data-motion="explore"]');

  await guide.scrollIntoViewIfNeeded();
  await expect(guide).toHaveCSS("animation-name", /point-the-way/);
  await explorer.scrollIntoViewIfNeeded();
  await expect(explorer).toHaveCSS("animation-name", /explore-steps/);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(guide).toHaveCSS("animation-name", "none");
  await expect(explorer).toHaveCSS("animation-name", "none");
});

test("explore choice and Escape both dismiss the modal", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const dialog = page.getByRole("dialog", { name: "Elegí cómo explorar DNAture", exact: true });
  const initialURL = page.url();
  const initialScroll = await page.evaluate(() => window.scrollY);
  await dialog.getByRole("button", { name: "Explorar por mi cuenta", exact: true }).click();
  await expect(page).toHaveURL(initialURL);
  await expect(dialog).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(initialScroll);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});
