import { expect, type Locator } from "@playwright/test";

export async function completePet(section: Locator, name: string, species: "Gato" | "Perro" = "Gato") {
  const start = section.getByRole("button", { name: "Empecemos", exact: true });
  if (await start.isVisible()) await start.click();
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
