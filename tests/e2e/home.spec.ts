import { expect, test } from "@playwright/test";

test("home page is blank and non-indexable", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("DNAture | Nutrición con esencia en el ADN");
  expect((await page.locator("body").innerText()).trim()).toBe("");
  await expect(page.getByRole("banner")).toHaveCount(0);
  await expect(page.getByRole("main")).toHaveCount(0);
  await expect(page.getByRole("contentinfo")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  expect(errors).toEqual([]);
});


for (const [name, destination, heading] of [
  ["Nosotros", "/nosotros", "Quiénes somos"],
  ["Ciencia", "/ciencia", "Ciencia y nutrición fisiológica"],
] as const) {
  test(`${name} is reachable from the main navigation`, async ({ page }) => {
    await page.goto("/prototype");
    const menu = page.getByRole("button", { name: "Abrir menú", exact: true });
    const mobile = await menu.isVisible();
    if (mobile) await menu.click();
    await page.getByRole("navigation", { name: mobile ? "Navegación móvil" : "Navegación principal", exact: true }).getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(destination);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await page.getByRole("navigation", { name: "Ruta de navegación" }).getByRole("link", { name: "Inicio", exact: true }).click();
    await expect(page).toHaveURL("/");
  });
}

test("unknown routes return a usable Spanish 404 page", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Página no encontrada", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Volver al inicio", exact: true }).click();
  await expect(page).toHaveURL("/");
});
