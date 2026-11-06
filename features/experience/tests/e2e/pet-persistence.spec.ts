import { expect, test } from "@playwright/test";
import { PET_STORAGE_KEY } from "../../data/pet-storage";
import { completePet } from "../helpers/complete-pet";

test("Continuar saves a single pet and the new page survives refresh", async ({ page }, testInfo) => {
  await page.goto("/#experiencia-personalizada");
  const section = page.locator("#experiencia-personalizada");
  await completePet(section, "Luna");
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page).toHaveURL(/\/mis-mascotas$/);
  await expect(page.getByRole("heading", { level: 1, name: "Mis mascotas" })).toBeVisible();
  await expect(page.getByRole("article", { name: "Ficha de Luna" }).locator("dd")).toHaveText(["Luna", "Gato", "Mestizo / sin raza definida"]);
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), PET_STORAGE_KEY);
  expect(stored).toMatchObject({ version: 1, pets: [{ name: "Luna", species: "cat", breed: "Mestizo / sin raza definida" }] });
  await page.reload();
  await expect(page.getByRole("article", { name: "Ficha de Luna" })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.getByRole("banner").locator('[data-header-section="bottom"]')).toHaveCSS("background-color", "rgb(255, 255, 255)");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(page.viewportSize()!.width);
  await page.screenshot({ path: testInfo.outputPath("my-pets.png"), fullPage: true });
});

test("the fifth slide saves all pets and restored profiles can be edited or extended", async ({ page }) => {
  await page.goto("/#experiencia-personalizada");
  const section = page.locator("#experiencia-personalizada");
  await completePet(section, "Luna");
  await expect(section.getByRole("button", { name: "Continuar", exact: true })).toBeVisible();
  await section.getByRole("button", { name: "Agregar otra mascota" }).click();
  await completePet(section, "Juve", "Perro");
  await expect(section.getByRole("button", { name: "Continuar", exact: true })).toHaveCount(0);
  await section.getByRole("button", { name: "Ver mis mascotas" }).click();
  await expect(section.getByRole("heading", { name: "Tus mascotas", exact: true })).toBeFocused();
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page).toHaveURL(/\/mis-mascotas$/);
  await expect(page.getByRole("article")).toHaveCount(2);
  await page.getByRole("link", { name: "Gestionar mascotas" }).click();
  await expect(section.getByRole("heading", { name: "Tus mascotas", exact: true })).toBeVisible();
  await section.getByRole("button", { name: "Editar a Luna", exact: true }).click();
  await completePet(section, "Lunita");
  await expect(section.getByRole("button", { name: "Continuar", exact: true })).toHaveCount(0);
  await section.getByRole("button", { name: "Agregar otra mascota" }).click();
  await completePet(section, "Sol");
  await expect(section.getByRole("button", { name: "Continuar", exact: true })).toHaveCount(0);
  await section.getByRole("button", { name: "Ver mis mascotas" }).click();
  await expect(section.getByRole("heading", { name: "Tus mascotas", exact: true })).toBeFocused();
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page).toHaveURL(/\/mis-mascotas$/);
  await expect(page.getByRole("article")).toHaveCount(3);
  for (const name of ["Lunita", "Juve", "Sol"]) await expect(page.getByRole("article", { name: `Ficha de ${name}`, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("article")).toHaveCount(3);
});

test("storage errors preserve the profiles and allow retrying", async ({ page }) => {
  await page.addInitScript((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(storageKey, value) {
      if (storageKey === key && !document.documentElement.hasAttribute("data-storage-available")) {
        throw new DOMException("Storage full", "QuotaExceededError");
      }
      original.call(this, storageKey, value);
    };
  }, PET_STORAGE_KEY);
  await page.goto("/#experiencia-personalizada");
  const section = page.locator("#experiencia-personalizada");
  await completePet(section, "Toby", "Perro");
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(section.getByRole("alert")).toContainText("No pudimos guardar tus mascotas");
  await expect(page).not.toHaveURL(/\/mis-mascotas$/);
  await expect(section.getByRole("article", { name: "Ficha de Toby" })).toBeVisible();
  await expect(section.getByRole("button", { name: "Continuar", exact: true })).toBeEnabled();
  await page.evaluate(() => document.documentElement.setAttribute("data-storage-available", "true"));
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page).toHaveURL(/\/mis-mascotas$/);
  await expect(page.getByRole("article", { name: "Ficha de Toby" })).toBeVisible();
});

test("empty and invalid storage have useful states without silently replacing data", async ({ page }) => {
  const response = await page.goto("/mis-mascotas");
  expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  await expect(page.getByRole("heading", { name: "Todavía no agregaste mascotas." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Crear el primer perfil" })).toHaveAttribute("href", "/#experiencia-personalizada");
  await page.evaluate((key) => localStorage.setItem(key, "invalid-json"), PET_STORAGE_KEY);
  await page.reload();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("No pudimos leer los perfiles guardados");
  await expect(page.getByRole("article")).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), PET_STORAGE_KEY)).toBe("invalid-json");
});
