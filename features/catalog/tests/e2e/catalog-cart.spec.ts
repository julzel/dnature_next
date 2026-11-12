import { expect, test, type Page } from "@playwright/test";

const storageKey = "dnature.cart.v1";
const simpleName = "Cuellos de pollo deshidratados";
const variableName = "Oreja de res sin pelo deshidratada";
async function openProduct(page: Page, name: string) {
  await page.goto(`/productos?q=${encodeURIComponent(name)}`);
  const group = page.getByRole("group", { name: `Carrito: ${name}`, exact: true });
  await expect(group).toBeVisible({ timeout: 45_000 });
  return group;
}
async function storedQuantity(page: Page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "[]").reduce((total: number, item: { quantity: number }) => total + item.quantity, 0), storageKey);
}

test("catalog additions become live steppers, persist and remove at zero", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  const group = await openProduct(page, simpleName);
  const add = group.getByRole("button", { name: "Agregar al carrito", exact: true });
  await expect(add).toBeEnabled();
  await expect(group.getByRole("spinbutton")).toHaveCount(0);
  await add.click();
  const quantity = group.getByRole("spinbutton");
  await expect(quantity).toHaveValue("1", { timeout: 20_000 });
  await expect(quantity).toBeFocused();
  await expect.poll(() => storedQuantity(page)).toBe(1);
  await expect(page.getByRole("link", { name: "Carrito, 1 producto", exact: true })).toBeVisible();
  await page.reload();
  await expect(quantity).toHaveValue("1", { timeout: 45_000 });
  await group.getByRole("button", { name: /Aumentar cantidad/ }).click();
  await expect.poll(() => storedQuantity(page), { timeout: 20_000 }).toBe(2);
  await quantity.fill("3");
  await expect.poll(() => storedQuantity(page), { timeout: 20_000 }).toBe(3);
  await quantity.fill("1.5");
  await expect(group.getByRole("alert")).toContainText("entera");
  expect(await storedQuantity(page)).toBe(3);
  await quantity.fill("0");
  await expect(add).toBeVisible();
  await expect.poll(() => storedQuantity(page)).toBe(0);
  await expect(page.getByRole("link", { name: "Carrito, 0 productos", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await group.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await page.screenshot({ path: testInfo.outputPath("catalog-cart-mobile.png") });
});

test("variable products require an explicit presentation and synchronize with cart removals", async ({ page, context }) => {
  test.setTimeout(90_000);
  const group = await openProduct(page, variableName);
  await expect(group.getByRole("combobox")).toHaveCount(0);
  await group.getByRole("button", { name: "Agregar al carrito", exact: true }).click();
  const select = group.getByRole("combobox");
  await expect(select).toBeFocused();
  await select.click();
  await group.getByRole("option", { name: /^pequeño/ }).click();
  await group.getByRole("button", { name: "Agregar al carrito", exact: true }).click();
  await expect(group.getByRole("spinbutton")).toHaveValue("1", { timeout: 20_000 });
  await expect(select).toContainText("pequeño");
  const cartPage = await context.newPage();
  await cartPage.goto("/carrito");
  await expect(cartPage.getByRole("heading", { level: 3, name: variableName })).toBeVisible();
  await cartPage.getByRole("button", { name: `Quitar ${variableName} del carrito` }).click();
  await expect(group.getByRole("spinbutton")).toHaveCount(0);
  await expect(select).toHaveCount(0);
  await expect(group.getByRole("button", { name: "Agregar al carrito", exact: true })).toBeVisible();
  await cartPage.close();
});

test("failed and pending additions preserve the cart and prevent duplicate submissions", async ({ page }) => {
  test.setTimeout(60_000);
  const group = await openProduct(page, simpleName);
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  let posts = 0;
  await page.route("**/productos?**", async (route) => {
    if (route.request().method() === "POST") { posts++; await gate; await route.abort("failed"); }
    else await route.continue();
  });
  await group.getByRole("button", { name: "Agregar al carrito", exact: true }).click();
  await expect(group.getByRole("button", { name: "Agregando…", exact: true })).toBeDisabled();
  await expect(group.getByRole("status")).toContainText("Verificando");
  release();
  await expect(group.getByRole("alert")).toContainText("No pudimos actualizar");
  await expect(group.getByRole("button", { name: "Agregar al carrito", exact: true })).toBeEnabled();
  expect(await storedQuantity(page)).toBe(0);
  expect(posts).toBe(1);
});

test("restores a persisted quantity on narrow screens and sold-out entries have no purchase controls", async ({ page }, testInfo) => {
  test.setTimeout(60_000);
  await page.addInitScript((key) => localStorage.setItem(key, JSON.stringify([{ sku: "4d650574-b071-4c76-8d4a-45982464d902", parentSku: "4d650574-b071-4c76-8d4a-45982464d902", name: "Cuellos de pollo deshidratados", presentation: "Presentación única", quantity: 1, price: 2500, path: "/producto/cuellos-de-pollo-deshidratados", imageUrl: null }])), storageKey);
  await page.setViewportSize({ width: 390, height: 844 });
  const group = await openProduct(page, simpleName);
  await expect(group.getByRole("spinbutton")).toHaveValue("1");
  await group.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await page.screenshot({ path: testInfo.outputPath("catalog-stepper-mobile.png") });
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.goto("/productos?categoria=todas");
  const sold = page.locator('li[data-availability="sold-out"]');
  await expect(sold.first()).toBeVisible({ timeout: 45_000 });
  await expect(sold.getByRole("group", { name: /^Carrito:/ })).toHaveCount(0);
});
