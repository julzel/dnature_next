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
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "/#contacto");
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  const data = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(data.map((value) => JSON.parse(value)).some((item) => item["@type"] === "AboutPage")).toBe(true);
});
