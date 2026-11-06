import { expect, test, type Locator } from "@playwright/test";

async function completePet(section: Locator, name: string, species: "Gato" | "Perro" = "Gato") {
  await section.getByRole("button", { name: species, exact: true }).click();
  await expect(section.getByRole("heading", { name: "¿Cómo se llama tu mascota?" })).toBeFocused();
  await section.getByRole("textbox", { name: "Nombre de tu mascota" }).fill(name);
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(section.getByRole("heading", { name: `¿De qué raza es ${name}?` })).toBeFocused();
  await section.getByRole("combobox", { name: "Raza", exact: true }).focus();
  await section.getByRole("option", { name: "Mestizo / sin raza definida", exact: true }).click();
  await section.getByRole("button", { name: "Ver perfil" }).click();
  await expect(section.getByRole("heading", { name: `¡Un gusto, ${name}!` })).toBeFocused();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.locator("#experiencia").getByRole("link", { name: "Experiencia personalizada", exact: true }).click();
});

test("adding and editing pets preserves each profile without duplicates", async ({ page }, testInfo) => {
  const section = page.locator("#experiencia-personalizada");
  await completePet(section, "Luna");
  await expect(section.getByRole("button", { name: "Ver mis mascotas" })).toHaveCount(0);
  await section.getByRole("button", { name: "Agregar otra mascota" }).click();
  await expect(section.getByRole("heading", { name: "¿Gato o perro?" })).toBeFocused();
  await expect(section.getByRole("button", { name: "Gato", exact: true })).toHaveAttribute("aria-pressed", "false");
  await expect(section.getByRole("article")).toHaveCount(0);
  await completePet(section, "Juve", "Perro");
  await section.getByRole("button", { name: "Ver mis mascotas" }).click();
  await expect(section.getByRole("heading", { name: "Tus mascotas", exact: true })).toBeFocused();
  await expect(section.getByRole("article")).toHaveCount(2);
  await expect(section.getByRole("article", { name: "Ficha de Luna", exact: true }).locator("dd")).toHaveText(["Luna", "Gato", "Mestizo / sin raza definida"]);
  await expect(section.getByRole("article", { name: "Ficha de Juve", exact: true }).locator("dd")).toHaveText(["Juve", "Perro", "Mestizo / sin raza definida"]);
  await section.getByRole("button", { name: "Editar a Luna", exact: true }).click();
  await expect(section.getByRole("button", { name: "Gato", exact: true })).toHaveAttribute("aria-pressed", "true");
  await completePet(section, "Lunita");
  await section.getByRole("button", { name: "Ver mis mascotas" }).click();
  await expect(section.getByRole("article")).toHaveCount(2);
  await expect(section.getByRole("article", { name: "Ficha de Luna", exact: true })).toHaveCount(0);
  await expect(section.getByRole("article", { name: "Ficha de Juve", exact: true }).locator("dd")).toContainText(["Juve", "Perro"]);
  await section.screenshot({ path: testInfo.outputPath("multiple-pets.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(page.viewportSize()!.width);
  await section.getByRole("button", { name: "Agregar otra mascota" }).click();
  await expect(section.getByRole("heading", { name: "¿Gato o perro?" })).toBeFocused();
  await section.getByRole("button", { name: "Ver mis mascotas" }).click();
  await expect(section.getByRole("heading", { name: "Tus mascotas", exact: true })).toBeFocused();
  await section.getByRole("button", { name: "Volver a la pregunta anterior" }).click();
  await expect(section.getByRole("heading", { name: "¿Gato o perro?" })).toBeFocused();
  await expect(section.getByRole("button", { name: "Gato", exact: true })).toHaveAttribute("aria-pressed", "false");
});

test("24 pets is the limit and editing at capacity does not add a pet", async ({ page }) => {
  test.setTimeout(90_000);
  const section = page.locator("#experiencia-personalizada");
  for (let index = 1; index <= 24; index++) {
    await completePet(section, `Mascota ${index}`);
    if (index < 24) await section.getByRole("button", { name: "Agregar otra mascota" }).click();
  }
  await section.getByRole("button", { name: "Ver mis mascotas" }).click();
  await expect(section.getByRole("article")).toHaveCount(24);
  await expect(section.getByRole("button", { name: "Agregar otra mascota" })).toHaveCount(0);
  await expect(section).not.toContainText(/de 24|límite|máximo/);
  await section.getByRole("button", { name: "Editar a Mascota 1", exact: true }).click();
  await completePet(section, "Nombre actualizado");
  await section.getByRole("button", { name: "Ver mis mascotas" }).click();
  await expect(section.getByRole("article")).toHaveCount(24);
  await expect(section.getByRole("article", { name: "Ficha de Nombre actualizado", exact: true })).toBeVisible();
  await expect(section.getByRole("button", { name: "Agregar otra mascota" })).toHaveCount(0);
});
