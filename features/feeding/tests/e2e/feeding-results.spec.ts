import { expect, test, type Page } from "@playwright/test";
import { PET_STORAGE_KEY } from "@/features/experience/data/pet-storage";
import { DRAFT_KEY } from "../../lib/intake";
import { previewQuote } from "../fixtures/quote-preview";

async function results(page: Page, multiple = false, unavailable = false) {
  const pets = [
    { id: "pet-1", name: "Luna", species: "dog", breed: "Labrador Retriever" },
    { id: "pet-2", name: "Toby", species: "dog", breed: "Yorkshire Terrier" },
    { id: "cat", name: "Milo", species: "cat", breed: "Mestizo" },
  ].slice(0, multiple ? 3 : 1);
  await page.addInitScript(({ pets, key, draftKey }) => {
    localStorage.setItem(key, JSON.stringify({ version: 1, pets }));
    const draft: Record<string, string> = { _step: String(pets.length === 1 ? 3 : 7), days: "28" };
    for (const pet of pets) {
      draft[`${pet.id}._identity`] = JSON.stringify(pet);
      for (const [key, value] of Object.entries({ age: "3", weight: pet.id === "pet-2" ? "5" : "20", lifeStage: "adult", neutered: "yes", body: "ideal", activity: "normal", behavior: "calm", brachycephaly: "no", health: "healthy", allergyStatus: "no", goal: "wellness", meals: "2" })) draft[`${pet.id}.${key}`] = value;
    }
    sessionStorage.setItem(draftKey, JSON.stringify(draft));
  }, { pets, key: PET_STORAGE_KEY, draftKey: DRAFT_KEY });
  const quote = { ...previewQuote, pets: previewQuote.pets.slice(0, multiple ? 3 : 1).map((pet) => ({ ...pet, packages: unavailable ? pet.packages.map((pack) => ({ ...pack, ready: false, lines: [], total: 0, subtotal: 0, iva: 0, issues: ["Sin productos con existencias suficientes."] })) : pet.packages })) };
  await page.route("**/api/feeding/quote", (route) => route.fulfill({ json: quote }));
  await page.goto("/mi-dnature/mis-mascotas");
  await page.getByRole("button", { name: "Estimar porción y ver paquetes" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(multiple ? "Cada mascota, su propio plan." : "Hecho para Luna.");
}

test("personalized package comparison keeps details accessible and enquiries accurate on every screen", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await results(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
  await expect(page.getByText("600 g", { exact: true })).toBeVisible();
  await expect(page.getByText("300 g por comida", { exact: true })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(4);
  const base = page.getByRole("article", { name: "Paquete Base", exact: true });
  const premium = page.getByRole("article", { name: "Paquete Premium", exact: true });
  await expect(base.getByRole("link", { name: "Complete de res" })).not.toBeVisible();
  await expect(premium.getByText("Por completar", { exact: true })).toBeVisible();
  await expect(premium.getByRole("link", { name: /Pedir paquete/ })).toHaveCount(0);
  const href = await base.getByRole("link", { name: /Pedir paquete Base/ }).getAttribute("href");
  expect(new URL(href!).searchParams.get("text")).toContain("17 × Complete de res");
  await page.screenshot({ path: testInfo.outputPath("packages-desktop.png"), fullPage: true });
  const disclosure = base.locator("summary").filter({ hasText: "Ver productos y cantidades" });
  await disclosure.focus(); await page.keyboard.press("Enter");
  await expect(base.getByRole("link", { name: "Complete de res" })).toBeVisible();
  await expect(base.getByText("IVA (13%)", { exact: true })).toBeVisible();
  await premium.locator("summary").filter({ hasText: "Qué falta confirmar" }).click();
  await expect(premium.getByText(/Probiótico: confirmar existencias/)).toBeVisible();
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await disclosure.click();
  const functionalChoice = page.getByRole("radio", { name: /^Funcional/ });
  await functionalChoice.check();
  await expect(page.getByRole("article", { name: "Paquete Funcional", exact: true })).toBeVisible();
  await expect(base).not.toBeVisible();
  await functionalChoice.press("ArrowRight");
  await expect(page.getByRole("article", { name: "Paquete Masticación", exact: true })).toBeVisible();
  await page.getByRole("radio", { name: /^Base/ }).check();
  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("packages-mobile.png"), fullPage: true });
  await page.addStyleTag({ content: "body { zoom: 2; }" });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("switching pets separates quotes and referrals and preserves answers for editing", async ({ page }) => {
  await results(page, true);
  const switcher = page.getByRole("combobox", { name: "Ver la propuesta de" });
  await switcher.click(); await page.getByRole("option", { name: "Toby", exact: true }).click();
  await expect(page.getByRole("region", { name: "Plan de Toby", exact: true })).toBeVisible();
  await expect(page.getByText("150 g", { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Plan de Luna", exact: true })).toHaveCount(0);
  await expect(page.getByText(/g por comida/)).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Plan de Toby", exact: true }).locator("img")).toHaveAttribute("src", "/images/pets/yorkshire-terrier.svg");
  await switcher.click(); await page.getByRole("option", { name: "Milo", exact: true }).click();
  await expect(page.getByRole("link", { name: "Consultar con DNAture" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(0);
  await page.getByRole("button", { name: "Editar respuestas y recalcular" }).click();
  await expect(page.getByRole("article", { name: "Información de Luna" })).toContainText("20 kg");
  await expect(page.getByRole("article", { name: "Información de Toby" })).toContainText("5 kg");
});

test("unavailable packages remain review enquiries with explicit partial totals", async ({ page }) => {
  await results(page, false, true);
  await expect(page.getByRole("article")).toHaveCount(4);
  await expect(page.getByRole("link", { name: /Pedir paquete/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Revisar paquete/ })).toHaveCount(4);
  await expect(page.getByRole("article").getByText("Por completar", { exact: true })).toHaveCount(4);
});
