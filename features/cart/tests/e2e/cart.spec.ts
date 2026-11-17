import { expect, test } from "@playwright/test";

const path = "/producto/oreja-de-res-sin-pelo-deshidratada";
const storageKey = "dnature.cart.v1";

test("later-page products persist in the cart and can generate a checkout order", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/producto/cuellos-de-pollo-deshidratados");
  const add = page.getByRole("button", { name: "Agregar al carrito", exact: true });
  await expect(add).toBeEnabled({ timeout: 45_000 });
  await add.click();
  await expect(page.getByText("Producto agregado al carrito.", { exact: true })).toBeVisible({ timeout: 20_000 });
  await page.getByRole("link", { name: /Ver carrito/ }).click();
  await expect(page.getByRole("main").getByRole("heading", { level: 3, name: /Cuellos de pollo/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("main").getByRole("heading", { level: 3, name: /Cuellos de pollo/ })).toBeVisible();
  await page.getByRole("button", { name: "Continuar al pedido" }).click();
  await page.getByLabel("Nombre completo", { exact: true }).fill("Prueba de carrito");
  await page.getByLabel("Teléfono de contacto", { exact: true }).fill("88888888");
  await page.getByRole("radio", { name: /Retiro/ }).check();
  await page.getByRole("button", { name: "Generar pedido", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tu pedido está listo para enviar" })).toBeVisible({ timeout: 20_000 });
  const message = new URL((await page.getByRole("link", { name: /Enviar pedido por WhatsApp/ }).getAttribute("href"))!).searchParams.get("text");
  expect(message).toContain("Cuellos de pollo");
});

test("adds the selected presentation and quantity, persists, updates and removes the cart line", async ({ page }, testInfo) => {
  await page.goto(path);
  const add = page.getByRole("button", { name: "Agregar al carrito", exact: true });
  await expect(add).toBeEnabled({ timeout: 45_000 });
  const quantity = page.getByRole("spinbutton", { name: "Cantidad", exact: true });
  await quantity.fill("2");
  await add.click();
  await expect(page.getByRole("status").filter({ hasText: "Producto agregado al carrito." })).toBeVisible();
  const selectedSku = await page.getByRole("radio", { checked: true }).inputValue();
  await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "[]")[0]?.quantity, storageKey)).toBe(2);
  await page.getByRole("link", { name: /Ver carrito/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tu carrito.");
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  await page.reload();
  await expect(page.getByRole("spinbutton", { name: "Cantidad" })).toHaveValue("2");
  await page.screenshot({ path: testInfo.outputPath("cart.png"), fullPage: true });
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!)[0].sku, storageKey)).toBe(selectedSku);
  await page.getByRole("spinbutton", { name: "Cantidad" }).fill("1");
  await page.getByRole("button", { name: "Actualizar", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Carrito actualizado." })).toBeVisible();
  await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!)[0]?.quantity, storageKey)).toBe(1);
  await page.getByRole("button", { name: /Aumentar cantidad de/ }).click();
  await expect.poll(async () => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!)[0]?.quantity, storageKey)).toBe(2);
  await page.getByRole("button", { name: /Quitar .* del carrito/ }).click();
  await expect(page.getByText("Tu carrito está vacío.", { exact: false })).toBeVisible();
});

test("the shared cart synchronizes between tabs", async ({ page, context }) => {
  const cartPage = await context.newPage();
  await cartPage.goto("/carrito");
  await expect(cartPage.getByText("Tu carrito está vacío.", { exact: false })).toBeVisible();
  await page.goto(path);
  const add = page.getByRole("button", { name: "Agregar al carrito", exact: true });
  await expect(add).toBeEnabled({ timeout: 45_000 });
  await add.click();
  await expect(cartPage.getByRole("main").getByRole("heading", { level: 3 })).toContainText("Oreja de res");
  await cartPage.getByRole("button", { name: /Quitar .* del carrito/ }).click();
  await expect(page.getByRole("link", { name: /Ver carrito/ })).toHaveCount(0);
  await cartPage.close();
});

test("failed browser persistence does not claim the product was added", async ({ page }) => {
  await page.addInitScript((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException("Storage unavailable", "QuotaExceededError");
      return original.call(this, name, value);
    };
  }, storageKey);
  await page.goto(path);
  const add = page.getByRole("button", { name: "Agregar al carrito", exact: true });
  await expect(add).toBeEnabled({ timeout: 45_000 });
  await add.click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("No pudimos guardar el carrito");
  await expect(add).toBeEnabled();
  await expect(page.getByText("Producto agregado al carrito.", { exact: true })).toHaveCount(0);
});

test("invalid quantities and failed validation preserve inputs and never announce success", async ({ page }) => {
  await page.goto(path);
  const add = page.getByRole("button", { name: "Agregar al carrito", exact: true });
  await expect(add).toBeEnabled({ timeout: 45_000 });
  const quantity = page.getByRole("spinbutton", { name: "Cantidad", exact: true });
  await quantity.fill("0");
  await expect(add).toBeDisabled();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("al menos 1");
  await quantity.fill("1.5");
  await expect(add).toBeDisabled();
  await quantity.fill("2");
  await page.route("**/producto/**", async (route) => {
    if (route.request().method() === "POST") await route.abort("failed");
    else await route.continue();
  });
  await add.click();
  await expect(page.getByRole("main").getByRole("alert")).toBeVisible();
  await expect(quantity).toHaveValue("2");
  await expect(add).toBeEnabled();
  await expect(page.getByText("Producto agregado al carrito.", { exact: true })).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBeNull();
});

test("pending validation prevents duplicate additions", async ({ page }) => {
  await page.goto(path);
  const add = page.getByRole("button", { name: "Agregar al carrito", exact: true });
  await expect(add).toBeEnabled({ timeout: 45_000 });
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  let posts = 0;
  await page.route("**/producto/**", async (route) => {
    if (route.request().method() === "POST") { posts++; await gate; }
    await route.continue();
  });
  await add.click();
  await expect(page.getByRole("button", { name: "Agregando…", exact: true })).toBeDisabled();
  await expect(page.getByRole("spinbutton", { name: "Cantidad" })).toBeDisabled();
  release();
  await expect(page.getByText("Producto agregado al carrito.", { exact: true })).toBeVisible();
  expect(posts).toBe(1);
});
