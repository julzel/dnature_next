import { expect, test } from "@playwright/test";
import { PET_STORAGE_KEY } from "../../data/pet-storage";
import { VISIT_STORAGE_KEY } from "../../data/visit-preference";

const pets = [
  { id: "luna", name: "Luna", species: "dog", breed: "Yorkshire Terrier" },
  { id: "milo", name: "Milo", species: "cat", breed: "Mestizo / sin raza definida" },
];

test("guided choice persists without redirecting returning visitors or reopening the chooser", async ({ page, context }) => {
  await page.goto("/");
  await page.getByRole("dialog").getByRole("link", { name: "Visita guiada", exact: true }).click();
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator("#experiencia-personalizada").getByRole("button", { name: "Empecemos" })).toBeAttached();
  await expect(page).toHaveURL(/\/$/);
  const tab = await context.newPage();
  await tab.goto("/");
  await expect(tab.getByRole("dialog")).toBeHidden();
  expect(await tab.evaluate((key) => JSON.parse(localStorage.getItem(key)!), VISIT_STORAGE_KEY)).toEqual({ version: 1, visit: "guided" });
});

test("single pet is welcomed with its breed art, remembered visit and direct continuation", async ({ page }, testInfo) => {
  await page.goto("/#experiencia-personalizada");
  await page.evaluate(({ petsKey, visitKey, pets }) => {
    localStorage.setItem(petsKey, JSON.stringify({ version: 1, pets }));
    localStorage.setItem(visitKey, JSON.stringify({ version: 1, visit: "guided" }));
  }, { petsKey: PET_STORAGE_KEY, visitKey: VISIT_STORAGE_KEY, pets: [pets[0]] });
  await page.reload();
  const section = page.locator("#experiencia-personalizada");
  await expect(section.getByRole("heading", { name: "¡Hola de nuevo, Luna!" })).toBeVisible();
  await expect(section).not.toContainText("Cada mascota tiene");
  await expect(section.locator("img")).toHaveAttribute("src", "/images/pets/yorkshire-terrier.svg");
  await expect(section.getByLabel("Tu tipo de visita")).toHaveCount(0);
  await expect(section.getByRole("link", { name: "Ver mis mascotas" })).toHaveAttribute("href", "/mi-dnature/mis-mascotas");
  await section.getByRole("button", { name: "Editar o agregar mascotas" }).click();
  await expect(section.getByRole("article", { name: "Ficha de Luna" })).toBeVisible();
  await section.getByRole("button", { name: "Volver a la bienvenida" }).click();
  await expect(section.getByRole("heading", { level: 2 })).toBeFocused();
  await page.evaluate((key) => localStorage.setItem(key, JSON.stringify({ version: 1, visit: "explore" })), VISIT_STORAGE_KEY);
  await page.reload();
  await expect(section.getByRole("link", { name: "Explorar productos" })).toHaveAttribute("href", "/productos");
  await page.reload();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(section.getByRole("link", { name: "Explorar productos" })).toBeVisible();
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await expect.poll(() => section.locator("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await section.screenshot({ path: testInfo.outputPath("returning-pet.png") });
});

test("multiple pets and other-tab updates refresh the welcome without losing the visit preference", async ({ page, context }, testInfo) => {
  await page.goto("/#experiencia-personalizada");
  await page.evaluate(({ key, pets, visitKey }) => {
    localStorage.setItem(key, JSON.stringify({ version: 1, pets }));
    localStorage.setItem(visitKey, JSON.stringify({ version: 1, visit: "explore" }));
  }, { key: PET_STORAGE_KEY, pets, visitKey: VISIT_STORAGE_KEY });
  await page.reload();
  const section = page.locator("#experiencia-personalizada");
  await expect(section.getByRole("heading", { name: "¡Qué bueno verlos de nuevo!" })).toBeVisible();
  for (const pet of pets) await expect(section.getByRole("heading", { name: pet.name, exact: true })).toBeVisible();
  await expect(section.locator("img").nth(1)).toHaveAttribute("src", "/images/pets/mixed-breed-cat.svg");
  await expect(section.getByRole("link", { name: "Explorar productos" })).toBeVisible();
  await expect.poll(() => section.locator("img").evaluateAll((images) => images.every((img) => (img as HTMLImageElement).complete))).toBe(true);
  await section.screenshot({ path: testInfo.outputPath("returning-tribe.png") });
  const tab = await context.newPage();
  await tab.goto("/#experiencia-personalizada");
  await tab.evaluate(({ key, pets }) => localStorage.setItem(key, JSON.stringify({ version: 1, pets })), { key: PET_STORAGE_KEY, pets: [pets[1]] });
  await expect(section.getByRole("heading", { name: "¡Hola de nuevo, Milo!" })).toBeAttached();
  await tab.evaluate((key) => localStorage.setItem(key, JSON.stringify({ version: 1, visit: "guided" })), VISIT_STORAGE_KEY);
  await expect(section.getByRole("link", { name: "Ver mis mascotas" })).toHaveAttribute("href", "/mi-dnature/mis-mascotas");
  await page.bringToFront();
  await section.getByRole("link", { name: "Ver mis mascotas" }).click();
  await expect(page).toHaveURL(/\/mi-dnature\/mis-mascotas$/);
  await expect(page.getByRole("heading", { name: "Hola, Milo." })).toBeVisible();
});

test("blocked preference storage keeps the visit usable and explains persistence failure", async ({ page }) => {
  await page.addInitScript((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(storageKey, value) {
      if (storageKey === key) throw new DOMException("Storage full", "QuotaExceededError");
      original.call(this, storageKey, value);
    };
  }, VISIT_STORAGE_KEY);
  await page.goto("/");
  await page.getByRole("dialog").getByRole("button", { name: "Explorar por mi cuenta", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByRole("status").filter({ hasText: "no pudimos guardar tu tipo de visita" })).toBeVisible();
  await page.evaluate((key) => localStorage.removeItem(key), VISIT_STORAGE_KEY);
  await page.reload();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  expect(await page.evaluate((key) => localStorage.getItem(key), VISIT_STORAGE_KEY)).toBeNull();
});


test("corrupt stored data keeps the first-visit flow available without replacing profiles", async ({ page }) => {
  await page.goto("/#experiencia-personalizada");
  await page.evaluate(({ petsKey, visitKey }) => {
    localStorage.setItem(petsKey, "invalid-pets");
    localStorage.setItem(visitKey, "invalid-visit");
  }, { petsKey: PET_STORAGE_KEY, visitKey: VISIT_STORAGE_KEY });
  await page.goto("/");
  await page.getByRole("dialog").getByRole("link", { name: "Visita guiada", exact: true }).click();
  const section = page.locator("#experiencia-personalizada");
  await expect(section.getByRole("alert")).toContainText("No pudimos leer los perfiles");
  await expect(section.getByRole("button", { name: "Empecemos" })).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), PET_STORAGE_KEY)).toBe("invalid-pets");
});
