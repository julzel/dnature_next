import { expect, test } from "@playwright/test";
import faq from "../../data/faq.json";

test.beforeEach(async ({ page }) => {
  await page.goto("/preguntas-frecuentes", { waitUntil: "commit" });
});

test("visitors can search by topic and answer text, and recover from no results", async ({ page }) => {
  const input = page.getByRole("searchbox", { name: "Buscar en las preguntas" });
  const status = page.getByRole("status");
  await expect(status).toHaveText("65 preguntas en 7 temas");
  await input.fill("DESCONGELAR");
  await expect(status).toHaveText(/resultado/);
  await expect(page.getByText("¿Cómo descongelo correctamente la comida?")).toBeVisible();
  await expect(page.getByText("¿Qué cantidad de comida debe comer mi mascota al día?")).toBeHidden();
  await input.fill("PORCION");
  await expect(page.getByRole("heading", { name: "Alimentación natural" })).toBeVisible();
  await input.fill("no-existe-esta-palabra");
  await expect(status).toHaveText(/0 resultados/);
  await expect(page.getByRole("heading", { name: "No encontramos coincidencias." })).toBeVisible();
  await page.getByRole("button", { name: "Ver todas las preguntas" }).click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("");
  await expect(status).toHaveText("65 preguntas en 7 temas");
  await page.getByRole("navigation", { name: "Temas de preguntas frecuentes" }).getByRole("link", { name: /Para gatos/ }).click();
  await expect(status).toHaveText("5 preguntas · Para gatos");
  await input.fill("sin-coincidencia");
  await expect(status).toContainText("0 resultados");
  await page.getByRole("button", { name: "Ver todas las preguntas" }).click();
  await expect(status).toHaveText("65 preguntas en 7 temas");
});

test("topics and multiple answers work with keyboard and direct links", async ({ page }) => {
  const topics = page.getByRole("navigation", { name: "Temas de preguntas frecuentes" });
  await topics.getByRole("link", { name: /Conservación y preparación/ }).click();
  await expect(page).toHaveURL(/#tema-conservacion$/);
  await expect(page.getByRole("status")).toHaveText("8 preguntas · Conservación y preparación");
  await expect(page.locator("#respuestas details")).toHaveCount(8);
  const raw = page.locator("details").filter({ hasText: "¿Cómo debo almacenar la comida?" });
  const transition = page.locator("details").filter({ hasText: "¿Cómo descongelo correctamente la comida?" });
  await raw.locator("summary").focus();
  await raw.locator("summary").press("Enter");
  await expect(raw).toHaveAttribute("open", "");
  await transition.locator("summary").click();
  await expect(transition).toHaveAttribute("open", "");
  await expect(raw).toHaveAttribute("open", "");
  await expect(raw.getByRole("link", { name: /CDC/ })).toHaveAttribute("href", "https://www.cdc.gov/healthy-pets/about/pet-food-safety.html");
});

test("all answers are in the HTML and remain browsable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto("/preguntas-frecuentes");
  const html = await response!.text();
  for (const item of faq.questions) expect(html).toContain(item.question);
  await expect(page.locator("#faq-search")).toBeHidden();
  await expect(page.locator("#respuestas details")).toHaveCount(65);
  await page.getByRole("navigation", { name: "Temas de preguntas frecuentes" }).getByRole("link", { name: /Dietas DNAture/ }).click();
  const question = page.locator("details").filter({ hasText: "¿Qué ingredientes contienen las dietas?" });
  await question.locator("summary").click();
  await expect(question).toHaveAttribute("open", "");
  await expect(question.getByText(/ingredientes varían según la receta/)).toBeVisible();
  await context.close();
});

test("narrow screens and reduced motion retain usable navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const duration = await page.locator("#respuestas details").first().evaluate((item) => getComputedStyle(item, "::details-content").transitionDuration);
  expect(duration).toBe("0s");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Preguntas frecuentes" })).toHaveAttribute("href", "/preguntas-frecuentes");
});
