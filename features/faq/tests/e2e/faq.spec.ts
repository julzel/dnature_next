import { expect, test, type Page } from "@playwright/test";
import faq from "../../data/faq.json";

async function topicNavigation(page: Page) {
  const picker = page.locator("details[data-faq-topics]");
  if (await picker.isVisible()) {
    if (await picker.getAttribute("open") === null) await picker.locator(":scope > summary").click();
  }
  return page.getByRole("navigation", { name: "Temas de preguntas frecuentes" });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/preguntas-frecuentes", { waitUntil: "commit" });
  await expect(page.getByRole("searchbox", { name: "Buscar en las preguntas" })).toBeEnabled();
});

test("live search matches answer text, accents and common query forms, and recovers from no results", async ({ page }) => {
  const input = page.getByRole("searchbox", { name: "Buscar en las preguntas" });
  const status = page.locator("#faq-result-status");
  await expect(status).toHaveText("65 preguntas en 7 temas");
  await input.fill("DESCONGELAR");
  await expect(status).toHaveText(/resultado/);
  await expect(page.getByText("¿Cómo descongelo correctamente la comida?")).toBeVisible();
  await expect(page.getByText("¿Qué cantidad de comida debe comer mi mascota al día?")).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Respuestas para empezar" })).toBeHidden();
  await input.fill("envíos");
  await expect(page.getByText("¿Cuál es el costo de envío?")).toBeVisible();
  await input.fill("PORCION");
  await expect(page.getByRole("heading", { name: "Alimentación natural" })).toBeVisible();
  await input.fill("no-existe-esta-palabra");
  await expect(status).toHaveText(/0 resultados/);
  await expect(page.getByRole("heading", { name: "No encontramos coincidencias." })).toBeVisible();
  await page.getByRole("button", { name: "Ver todas las preguntas" }).click();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("");
  await expect(status).toHaveText("65 preguntas en 7 temas");
  await (await topicNavigation(page)).getByRole("link", { name: /Para gatos/ }).click();
  await expect(status).toHaveText("5 preguntas · Para gatos");
  await input.fill("costo envio");
  await expect(page.getByText("¿Cuál es el costo de envío?")).toBeVisible();
  await expect(status).not.toContainText("Para gatos");
});

test("topics and multiple answers work with keyboard and browser history", async ({ page }) => {
  await (await topicNavigation(page)).getByRole("link", { name: /Conservación y preparación/ }).click();
  await expect(page).toHaveURL(/#tema-conservacion$/);
  await expect(page.locator("#faq-result-status")).toHaveText("8 preguntas · Conservación y preparación");
  await expect(page.locator("#respuestas details[id^='pregunta-']")).toHaveCount(8);
  const storage = page.locator("#pregunta-almacenar-comida");
  const defrost = page.locator("#pregunta-descongelar-correctamente");
  await storage.locator("summary").focus();
  await storage.locator("summary").press("Enter");
  await expect(storage).toHaveAttribute("open", "");
  await defrost.locator("summary").click();
  await expect(defrost).toHaveAttribute("open", "");
  await expect(storage).toHaveAttribute("open", "");
  await expect(storage.getByRole("link", { name: /CDC/ })).toHaveAttribute("href", "https://www.cdc.gov/healthy-pets/about/pet-food-safety.html");
  await (await topicNavigation(page)).getByRole("link", { name: /Para gatos/ }).click();
  await page.goBack();
  await expect(page.locator("#faq-result-status")).toHaveText("8 preguntas · Conservación y preparación");
  await page.goForward();
  await expect(page.locator("#faq-result-status")).toHaveText("5 preguntas · Para gatos");
});

test("shortcuts open an answer and bookmarked answers survive reload", async ({ page }) => {
  await page.getByRole("navigation", { name: "Respuestas para empezar" }).getByRole("link", { name: /Preparar su comida/ }).click();
  const question = page.locator("#pregunta-descongelar-correctamente");
  await expect(page).toHaveURL(/#pregunta-descongelar-correctamente$/);
  await expect(question).toHaveAttribute("open", "");
  await expect(question.locator("summary")).toBeFocused();
  await page.reload();
  await expect(question).toHaveAttribute("open", "");
  await expect(question.getByText(/descongelá en refrigeración/)).toBeVisible();
  await expect(page.locator("#faq-result-status")).toHaveText("8 preguntas · Conservación y preparación");
});

test("answer links have a useful fallback if clipboard access is blocked", async ({ page }) => {
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("Not allowed")) } }));
  const question = page.locator("#pregunta-que-es-alimentacion-natural");
  await question.locator("summary").click();
  await question.getByRole("button", { name: "Copiar enlace de esta respuesta" }).click();
  const link = question.getByRole("textbox", { name: "Copiá este enlace" });
  await expect(link).toBeFocused();
  await expect(link).toHaveValue(/\/preguntas-frecuentes#pregunta-que-es-alimentacion-natural$/);
  await expect(question.getByRole("status")).toContainText("No pudimos copiar automáticamente");
});

test("all answers are in the HTML and remain browsable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto("/preguntas-frecuentes");
  const html = await response!.text();
  for (const item of faq.questions) expect(html).toContain(item.question);
  await expect(page.locator("#faq-search")).toBeHidden();
  await expect(page.locator("#respuestas details[id^='pregunta-']")).toHaveCount(65);
  await (await topicNavigation(page)).getByRole("link", { name: /Dietas DNAture/ }).click();
  const question = page.locator("#pregunta-ingredientes-de-las-dietas");
  await question.locator("summary").click();
  await expect(question).toHaveAttribute("open", "");
  await expect(question.getByText(/ingredientes varían según la receta/)).toBeVisible();
  await expect(question.getByRole("button", { name: /Copiar enlace/ })).toBeHidden();
  await context.close();
});

test("narrow screens and reduced motion retain usable navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const duration = await page.locator("#respuestas details[id^='pregunta-']").first().evaluate((item) => getComputedStyle(item, "::details-content").transitionDuration);
  expect(duration).toBe("0s");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Preguntas frecuentes" })).toHaveAttribute("href", "/preguntas-frecuentes");
});
