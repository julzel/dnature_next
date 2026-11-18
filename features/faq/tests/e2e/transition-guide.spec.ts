import { expect, test } from "@playwright/test";

const path = "/preguntas-frecuentes/transicion-alimentaria";

test("the short transition answer opens its guide and has a return path to the answer", async ({ page }) => {
  await page.goto("/preguntas-frecuentes#pregunta-como-hacer-transicion");
  const question = page.locator("#pregunta-como-hacer-transicion");
  await expect(question).toHaveAttribute("open", "");
  await question.getByRole("link", { name: "Ver la guía de transición a una dieta natural" }).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Transición alimentaria");
  await expect(page.getByRole("list", { name: "Pasos de la transición alimentaria" }).locator(":scope > li")).toHaveCount(4);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`${path}$`));
  await expect(page.getByRole("navigation", { name: "Ruta de navegación" }).getByText("Transición alimentaria")).toHaveAttribute("aria-current", "page");
  await page.getByRole("link", { name: "Volver a la pregunta", exact: true }).click();
  await expect(question).toHaveAttribute("open", "");
  await expect(question).toBeVisible();
});

test("the guide works without JavaScript on narrow and wide screens", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "reduce" });
  const page = await context.newPage();
  const response = await page.goto(path);
  expect(response?.status()).toBe(200);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const cats = page.locator("details").filter({ has: page.locator("summary", { hasText: "Si es un gato" }) });
  await cats.locator("summary").focus();
  await cats.locator("summary").press("Enter");
  await expect(cats).toHaveAttribute("open", "");
  await expect(cats.getByText(/Mantené un lugar fijo y tranquilo/)).toBeVisible();
  for (const link of await page.getByRole("navigation", { name: "En esta guía" }).locator('a[href^="#"]').all()) {
    const href = await link.getAttribute("href");
    await expect(page.locator(href!)).toBeAttached();
  }
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Guía de transición alimentaria" })).toHaveAttribute("href", path);
  await context.close();
});
