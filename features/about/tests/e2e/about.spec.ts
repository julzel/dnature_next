import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/nosotros", { waitUntil: "commit" });
});

test("mission and vision support selection and keyboard navigation", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Quiénes somos");
  const mission = page.getByRole("tab", { name: "Misión", exact: true });
  const vision = page.getByRole("tab", { name: "Visión", exact: true });
  await expect(mission).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toHaveCount(1);
  await expect(page.getByRole("tabpanel")).toContainText("necesidades de cada individuo");
  await vision.click();
  await expect(page.getByRole("tabpanel")).toContainText("Queremos ser un referente");
  await expect(vision).toHaveAttribute("aria-selected", "true");
  await expect(mission).toHaveAttribute("tabindex", "-1");
  await vision.press("ArrowRight");
  await expect(mission).toBeFocused();
  await expect(mission).toHaveAttribute("aria-selected", "true");
  await mission.press("End");
  await expect(vision).toBeFocused();
  await vision.press("Home");
  await expect(mission).toBeFocused();
  await mission.press("Tab");
  await expect(page.getByRole("tabpanel")).toBeFocused();
});

test("brand pillars open with the keyboard and keep only one expanded", async ({ page }) => {
  const science = page.locator("details").filter({ has: page.locator("summary").getByText("Ciencia", { exact: true }) });
  const conscience = page.locator("details").filter({ has: page.locator("summary").getByText("Conciencia", { exact: true }) });
  const community = page.locator("details").filter({ has: page.locator("summary").getByText("Tribu", { exact: true }) });
  await expect(science).toHaveAttribute("open", "");
  await conscience.locator("summary").focus();
  await conscience.locator("summary").press("Enter");
  await expect(conscience).toHaveAttribute("open", "");
  await expect(science).not.toHaveAttribute("open", "");
  await expect(conscience).toContainText("Escuchar sin juzgar");
  await community.locator("summary").click();
  await expect(community).toHaveAttribute("open", "");
  await expect(conscience).not.toHaveAttribute("open", "");
  await expect(community.getByRole("link")).toHaveAttribute("href", "/#contacto");
});

test("section navigation, reduced motion, and narrow layouts remain usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const navigation = page.getByRole("navigation", { name: "En esta página" });
  await navigation.getByRole("link", { name: "Misión y visión" }).click();
  await expect(page).toHaveURL(/\/nosotros#direccion$/);
  await expect(page.getByRole("tabpanel")).toHaveCSS("animation-name", "none");
  await page.getByRole("tab", { name: "Visión", exact: true }).click();
  await expect(page.getByRole("tabpanel").locator("..")).toHaveCSS("transition-duration", "0s");
  await expect(page.getByRole("tablist").locator('span[aria-hidden="true"]')).toHaveCSS("transition-duration", "0s");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "/#contacto");
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  const data = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(data.map((value) => JSON.parse(value)).some((item) => item["@type"] === "AboutPage")).toBe(true);
});

test("direction content and accent slide together and reverse without layout jumps", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const section = page.locator("#direccion");
  await section.scrollIntoViewIfNeeded();
  await page.evaluate(async () => { await document.fonts.ready; });
  const mission = section.getByRole("tab", { name: "Misión", exact: true });
  const vision = section.getByRole("tab", { name: "Visión", exact: true });
  const viewport = section.getByRole("tabpanel").locator("../..");
  const height = (await viewport.boundingBox())!.height;
  await vision.click();
  const motion = await section.evaluate((element) => {
    const marker = element.querySelector<HTMLElement>('[role="tablist"] > span[aria-hidden="true"]')!;
    const track = element.querySelector('[role="tabpanel"]')!.parentElement!;
    // Flush styles, then pause both transitions halfway through their duration.
    getComputedStyle(marker).getPropertyValue("transform");
    getComputedStyle(track).getPropertyValue("transform");
    const animations = [...marker.getAnimations(), ...track.getAnimations()];
    for (const animation of animations) {
      animation.pause();
      animation.currentTime = Number(animation.effect!.getTiming().duration) / 2;
    }
    const result = {
      transitions: animations.length,
      markerX: new DOMMatrixReadOnly(getComputedStyle(marker).transform).m41,
      trackX: new DOMMatrixReadOnly(getComputedStyle(track).transform).m41,
      destinationX: marker.offsetWidth + parseFloat(getComputedStyle(marker.parentElement!).columnGap),
      panelWidth: track.getBoundingClientRect().width / 2,
    };
    for (const animation of animations) animation.finish();
    return result;
  });
  expect(motion.transitions).toBe(2);
  expect(motion.markerX).toBeGreaterThan(0);
  expect(motion.markerX).toBeLessThan(motion.destinationX);
  expect(motion.trackX).toBeLessThan(0);
  expect(motion.trackX).toBeGreaterThan(-motion.panelWidth);
  expect((await viewport.boundingBox())!.height).toBe(height);
  await expect(section.getByRole("tabpanel")).toHaveCount(1);
  await expect(section.locator('[role="tabpanel"][aria-hidden="true"]')).toHaveAttribute("inert", "");
  await section.screenshot({ path: testInfo.outputPath("direction-tabs.png") });

  await mission.click();
  await vision.click();
  await mission.click();
  await expect(section.getByRole("tabpanel")).toContainText("necesidades de cada individuo");
  const marker = section.getByRole("tablist").locator('span[aria-hidden="true"]');
  await expect.poll(() => marker.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41)).toBe(0);
  await page.setViewportSize({ width: 320, height: 900 });
  await mission.press("ArrowRight");
  await expect(vision).toBeFocused();
  await expect.poll(() => marker.evaluate((element) => {
    const tab = element.parentElement!.querySelector('[aria-selected="true"]')!;
    return Math.abs(element.getBoundingClientRect().left - tab.getBoundingClientRect().left);
  })).toBeLessThan(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});
