import { expect, test } from "@playwright/test";

test("experience CTAs scroll to their matching sections", async ({ page }, testInfo) => {
  await page.goto("/");
  const choices = page.locator("#experiencia");
  for (const option of [
    { label: "Experiencia personalizada", target: "experiencia-personalizada" },
    { label: "Explorar por mi cuenta", target: "explorar" },
  ]) {
    const cta = choices.getByRole("link", { name: option.label, exact: true });
    await cta.scrollIntoViewIfNeeded();
    await expect(cta.locator("svg")).toHaveCSS("color", "rgb(255, 106, 0)");
    await cta.click();
    await expect(page).toHaveURL(new RegExp(`#${option.target}$`));
    const destination = page.locator(`#${option.target}`);
    await expect.poll(async () => (await destination.boundingBox())!.y).toBeGreaterThanOrEqual(78);
    await expect(destination).toBeInViewport();
  }
  await choices.scrollIntoViewIfNeeded();
  await choices.screenshot({ path: testInfo.outputPath("experience-ctas.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(page.viewportSize()!.width);
});

test("illustrations animate on entering view and settle into position", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const section = page.locator("#experiencia");
  const needle = section.locator('[data-part="needle"]');
  const sliders = section.locator('[data-part^="slider-"]');
  await expect(needle).toHaveCSS("animation-name", "none");
  await section.scrollIntoViewIfNeeded();
  await expect(needle).toHaveCSS("animation-name", /find-north/);
  await expect(sliders).toHaveCount(3);

  const movingParts = section.locator("[data-part]");
  // Compare distinct animation moments without waiting for every frame.
  const transforms = await movingParts.evaluateAll((parts) => parts.map((part) => {
    const animation = part.getAnimations()[0];
    animation.pause();
    animation.currentTime = 400;
    const early = getComputedStyle(part).transform;
    animation.currentTime = 1400;
    const later = getComputedStyle(part).transform;
    animation.finish();
    return { early, later, final: getComputedStyle(part).transform };
  }));
  for (const transform of transforms) {
    expect(transform.early).not.toBe(transform.later);
    expect(transform.final).toBe("matrix(1, 0, 0, 1, 0, 0)");
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(page.viewportSize()!.width);
  await section.screenshot({ path: testInfo.outputPath("experience.png") });
});

test("reduced motion keeps the illustrations static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const section = page.locator("#experiencia");
  await section.scrollIntoViewIfNeeded();
  for (const part of await section.locator("[data-part]").all()) {
    await expect(part).toHaveCSS("animation-name", "none");
  }
});
