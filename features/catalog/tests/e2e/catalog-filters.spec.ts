import { expect, test, type Page } from "@playwright/test";

async function revealFilters(page: Page) {
  const toggle = page.getByRole("button", { name: /^Filtros/ });
  if (await toggle.isVisible() && await toggle.getAttribute("aria-expanded") !== "true") await toggle.click();
}

test("Deshidratados is the default, and clearing or sharing filters survives reload and history navigation", async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto("/productos");
  await expect(page.getByRole("heading", { name: "Deshidratados", exact: true })).toBeVisible({ timeout: 45_000 });
  await revealFilters(page);
  const categories = page.locator('#catalog-filters input[type="checkbox"][name="categoria"]');
  const dehydrated = page.getByRole("checkbox", { name: /^Deshidratados/ });
  await expect(dehydrated).toBeChecked();
  await expect(categories.filter({ visible: true })).toHaveCount(5);
  await expect(page.locator('#catalog-filters input[name="categoria"]:checked')).toHaveCount(1);

  await dehydrated.uncheck();
  await expect(page).toHaveURL(/\/productos\?categoria=todas$/);
  expect(await page.locator("#catalog-filters form").evaluate((form) => new FormData(form as HTMLFormElement).getAll("categoria"))).toEqual(["todas"]);
  await expect(page.getByRole("heading", { name: "Todos los productos", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Todos los productos", exact: true })).toBeVisible({ timeout: 45_000 });
  await revealFilters(page);
  await expect(dehydrated).not.toBeChecked();

  await page.getByRole("checkbox", { name: /^Recetas completas/ }).check();
  await expect(page).toHaveURL(/categoria=recetas-completas$/);
  await expect(page.getByRole("heading", { name: "Recetas completas", exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Todos los productos", exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Deshidratados", exact: true })).toBeVisible();
  await revealFilters(page);
  await expect(dehydrated).toBeChecked();
});
