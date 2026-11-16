import { expect, test, type Page } from "@playwright/test";
import { PET_STORAGE_KEY } from "@/features/experience/data/pet-storage";
import { DRAFT_KEY } from "../../lib/intake";

const pet = { id: "pet-1", name: "Luna", species: "dog", breed: "Labrador Retriever" };
async function seed(page: Page, pets = [pet]) {
  await page.addInitScript(({ key, pets }) => localStorage.setItem(key, JSON.stringify({ version: 1, pets })), { key: PET_STORAGE_KEY, pets });
  await page.goto("/mi-dnature/alimentacion");
}
async function essentials(page: Page, id = pet.id, weight = "20") {
  await page.getByLabel("Edad en años", { exact: true }).fill("3");
  await page.getByLabel("Peso actual en kg").fill(weight);
  await page.locator(`[name="${id}.lifeStage"]`).selectOption("adult");
  await page.locator(`[name="${id}.neutered"]`).selectOption("yes");
}
async function answer(page: Page, id = pet.id) {
  await essentials(page, id);
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  for (const [key, value] of Object.entries({ body: "ideal", activity: "normal", behavior: "calm", brachycephaly: "no" })) await page.locator(`[name="${id}.${key}"]`).selectOption(value);
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  for (const [key, value] of Object.entries({ health: "healthy", allergyStatus: "no", goal: "wellness" })) await page.locator(`[name="${id}.${key}"]`).selectOption(value);
  await page.getByRole("button", { name: /Revisar sus datos|Continuar con/ }).click();
}

test("guided steps validate inputs, keep the pet visible and display four live quotes", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await seed(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hola, Luna.");
  await expect.poll(() => page.locator("main img").evaluateAll((images) => images.every((img) => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("feeding-welcome.png"), fullPage: true });
  await page.getByRole("button", { name: "Conozcámoslos mejor" }).click();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.getByLabel("Edad en años", { exact: true })).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Datos esenciales");
  for (const width of [320, 390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.screenshot({ path: testInfo.outputPath("feeding-essentials.png"), fullPage: true });
  await answer(page);
  await expect(page.getByRole("article", { name: "Información de Luna" })).toContainText("Sin definir (opcional)");
  await page.screenshot({ path: testInfo.outputPath("feeding-review.png"), fullPage: true });
  const response = page.waitForResponse("**/api/feeding/quote");
  await page.getByRole("button", { name: "Estimar porción y ver paquetes" }).click();
  const result = await response;
  expect(result.status()).toBe(200);
  const data = await result.json();
  expect(data.pets[0].dailyGrams).toBe(600);
  expect(data.pets[0].meals).toBeNull();
  expect(data.pets[0].packages).toHaveLength(4);
  expect(data.pets[0].packages[0].lines.length).toBeGreaterThan(0);
  expect(data.pets[0].packages[0].total).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { name: "Su porción y sus paquetes" })).toBeFocused();
  for (const name of ["Base", "Funcional", "Masticación", "Premium"]) await expect(page.getByRole("article", { name: `Paquete ${name}`, exact: true })).toBeVisible();
  await expect(page.getByText("600 g", { exact: true })).toBeVisible();
  await expect(page.getByText(/g por comida/)).toHaveCount(0);
  await page.getByRole("button", { name: "Editar respuestas y recalcular" }).click();
  await page.getByRole("button", { name: "Editar datos esenciales de Luna" }).click();
  await expect(page.getByLabel("Peso actual en kg")).toHaveValue("20");
  await page.reload();
  await expect(page.getByLabel("Peso actual en kg")).toHaveValue("20");
  await expect(page.getByRole("article")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("failed requests retain answers and allow retry; changed input is recalculated", async ({ page }) => {
  await seed(page); await page.getByRole("button", { name: "Conozcámoslos mejor" }).click(); await answer(page);
  await page.route("**/api/feeding/quote", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ message: "Catálogo temporalmente no disponible." }) }), { times: 1 });
  await page.getByRole("button", { name: "Estimar porción y ver paquetes" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Catálogo temporalmente");
  await expect(page.getByRole("article", { name: "Información de Luna" })).toContainText("20 kg");
  await expect(page.getByRole("button", { name: "Estimar porción y ver paquetes" })).toBeEnabled();
  await page.getByRole("button", { name: "Editar últimos detalles de Luna" }).click();
  await page.locator('[name="pet-1.health"]').selectOption("condition");
  await page.getByRole("button", { name: "Guardar y revisar" }).click();
  await page.getByRole("button", { name: "Estimar porción y ver paquetes" }).click();
  await expect(page.getByRole("link", { name: "Consultar con DNAture" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
});

test("multiple pets keep independent answers, breed art, sticky profile and review editing", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page, [pet, { ...pet, id: "pet-2", name: "Toby", breed: "Yorkshire Terrier" }, { ...pet, id: "cat", name: "Milo", species: "cat", breed: "Mestizo" }]);
  await page.getByRole("button", { name: "Conozcámoslos mejor" }).click();
  await essentials(page);
  await page.getByLabel("Cambiar mascota").selectOption("1");
  await expect(page.getByLabel("Peso actual en kg")).toHaveValue("");
  await expect(page.getByRole("complementary").locator("img")).toHaveAttribute("src", "/images/pets/yorkshire-terrier.svg");
  await essentials(page, "pet-2", "5");
  await page.getByLabel("Cambiar mascota").selectOption("0");
  await page.getByRole("button", { name: /01\s*Datos esenciales/ }).click();
  await expect(page.getByLabel("Peso actual en kg")).toHaveValue("20");
  await answer(page);
  await expect(page.getByLabel("Peso actual en kg")).toHaveValue("5");
  await answer(page, "pet-2");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Un camino para Milo");
  await page.getByRole("button", { name: "Revisar sus datos" }).click();
  await expect(page.getByRole("article")).toHaveCount(3);
  await page.getByRole("button", { name: "Editar datos esenciales de Toby" }).click();
  await page.getByLabel("Peso actual en kg").fill("6");
  await page.getByRole("button", { name: "Guardar y revisar" }).scrollIntoViewIfNeeded();
  const sidebar = page.getByRole("complementary");
  await expect(sidebar).toHaveCSS("position", "sticky");
  await expect(sidebar).toBeInViewport();
  await expect(sidebar).toContainText("6 kg");
  await page.screenshot({ path: testInfo.outputPath("feeding-mobile.png"), fullPage: false });
  await page.reload();
  await expect(page.getByLabel("Peso actual en kg")).toHaveValue("6");
  await expect(page.getByLabel("Cambiar mascota")).toHaveValue("1");
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("empty, cat-only, invalid requests and invalid saved answers recover clearly", async ({ page, request }) => {
  const response = await page.goto("/mi-dnature/alimentacion");
  expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  await expect(page.getByRole("link", { name: "Iniciar visita guiada" })).toBeVisible();
  await page.evaluate(({ key, draftKey }) => { localStorage.setItem(key, JSON.stringify({ version: 1, pets: [{ id: "cat", name: "Milo", species: "cat", breed: "Mestizo" }] })); sessionStorage.setItem(draftKey, "invalid"); }, { key: PET_STORAGE_KEY, draftKey: DRAFT_KEY });
  await page.reload();
  await expect(page.getByRole("status")).toContainText("No pudimos recuperar");
  await page.getByRole("button", { name: "Conozcámoslos mejor" }).click();
  await page.getByRole("button", { name: "Revisar sus datos" }).click();
  await page.getByRole("button", { name: "Estimar porción y ver paquetes" }).click();
  await expect(page.getByRole("link", { name: "Consultar con DNAture" })).toBeVisible();
  const invalid = await request.post("/api/feeding/quote", { data: { days: 28, pets: [], total: 1 } });
  expect(invalid.status()).toBe(400);
  expect(invalid.headers()["cache-control"]).toBe("no-store");
});
