import { expect, test, type Page } from "@playwright/test";
import { PET_STORAGE_KEY } from "@/features/experience/data/pet-storage";
import { DRAFT_KEY } from "../../lib/intake";

const pet = { id: "pet-1", name: "Luna", species: "dog", breed: "Labrador Retriever" };
async function seed(page: Page) {
  await page.addInitScript(({ key, pets }) => localStorage.setItem(key, JSON.stringify({ version: 1, pets })), { key: PET_STORAGE_KEY, pets: [pet] });
  await page.goto("/mi-dnature/alimentacion");
}
async function answer(page: Page) {
  await page.getByLabel("Edad en años", { exact: true }).fill("3");
  await page.getByLabel("Peso actual en kg").fill("20");
  const values = { lifeStage: "adult", neutered: "yes", body: "ideal", activity: "normal", health: "healthy", allergyStatus: "no", brachycephaly: "no", goal: "wellness", behavior: "calm" };
  for (const [key, value] of Object.entries(values)) await page.locator(`[name="pet-1.${key}"]`).selectOption(value);
}

test("guided intake uses the live catalog and displays four quotes with the daily portion", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await seed(page); await answer(page);
  const response = page.waitForResponse("**/api/feeding/quote");
  await page.getByRole("button", { name: "Estimar porción y ver paquetes" }).click();
  const result = await response;
  expect(result.status()).toBe(200);
  const data = await result.json();
  expect(data.pets[0].dailyGrams).toBe(600);
  expect(data.pets[0].packages).toHaveLength(4);
  expect(data.pets[0].packages[0].lines.length).toBeGreaterThan(0);
  expect(data.pets[0].packages[0].total).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { name: "Su porción y sus paquetes" })).toBeFocused();
  for (const name of ["Base", "Funcional", "Masticación", "Premium"]) await expect(page.getByRole("article", { name: `Paquete ${name}`, exact: true })).toBeVisible();
  await expect(page.getByText("600 g", { exact: true })).toBeVisible();
  for (const width of [320, 390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.screenshot({ path: testInfo.outputPath("feeding-results.png"), fullPage: true });
  await page.getByRole("button", { name: "Editar respuestas y recalcular" }).click();
  await expect(page.getByLabel("Peso actual en kg")).toHaveValue("20");
  await page.reload();
  await expect(page.getByLabel("Peso actual en kg")).toHaveValue("20");
  await expect(page.getByRole("article")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("failed requests retain answers and allow retry; changed input is recalculated", async ({ page }) => {
  await seed(page); await answer(page);
  await page.route("**/api/feeding/quote", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "Catálogo temporalmente no disponible." }) }), { times: 1 });
  await page.getByRole("button", { name: "Estimar porción y ver paquetes" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Catálogo temporalmente");
  await expect(page.getByLabel("Peso actual en kg")).toHaveValue("20");
  await expect(page.getByRole("button", { name: "Estimar porción y ver paquetes" })).toBeEnabled();
  await page.locator('[name="pet-1.health"]').selectOption("condition");
  await page.getByRole("button", { name: "Estimar porción y ver paquetes" }).click();
  await expect(page.getByRole("link", { name: "Consultar con DNAture" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
});

test("empty, cat-only, invalid requests and invalid saved answers recover clearly", async ({ page, request }) => {
  const response = await page.goto("/mi-dnature/alimentacion");
  expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  await expect(page.getByRole("link", { name: "Iniciar visita guiada" })).toBeVisible();
  await page.evaluate(({ key, draftKey }) => { localStorage.setItem(key, JSON.stringify({ version: 1, pets: [{ id: "cat", name: "Milo", species: "cat", breed: "Mestizo" }] })); sessionStorage.setItem(draftKey, "invalid"); }, { key: PET_STORAGE_KEY, draftKey: DRAFT_KEY });
  await page.reload();
  await expect(page.getByRole("status")).toContainText("No pudimos recuperar");
  await page.getByRole("button", { name: "Estimar porción y ver paquetes" }).click();
  await expect(page.getByRole("link", { name: "Consultar con DNAture" })).toBeVisible();
  const invalid = await request.post("/api/feeding/quote", { data: { days: 28, pets: [], total: 1 } });
  expect(invalid.status()).toBe(400);
  expect(invalid.headers()["cache-control"]).toBe("no-store");
});
