import { expect, test } from "@playwright/test";

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
