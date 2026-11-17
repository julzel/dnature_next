import { expect, test, type Page } from "@playwright/test";

const storageKey = "dnature.cart.v1";
const sample = { sku: "sample", parentSku: "sample", name: "Producto de prueba", presentation: "100 g", quantity: 2, price: 1900, path: "/producto/prueba", imageUrl: null };

async function seedCart(page: Page) {
  await page.addInitScript(({ key, item }) => { localStorage.setItem(key, JSON.stringify([item])); }, { key: storageKey, item: sample });
  await page.goto("/carrito");
  await page.getByRole("button", { name: "Continuar al pedido" }).click();
  await expect(page.getByRole("heading", { name: "Completa tu pedido" })).toBeVisible();
}
async function contactDetails(page: Page) {
  await page.getByLabel("Nombre completo", { exact: true }).fill("Ana Pérez");
  await page.getByLabel("Teléfono de contacto", { exact: true }).fill("88888888");
}
async function addressDetails(page: Page) {
  await page.getByLabel("Provincia", { exact: true }).fill("San José");
  await page.getByLabel("Cantón", { exact: true }).fill("Montes de Oca");
  await page.getByLabel("Distrito", { exact: true }).fill("San Pedro");
  await page.getByLabel("Dirección exacta y referencias", { exact: true }).fill("100 metros norte de la plaza, casa azul.");
}

test("checkout requires a delivery choice and address, shows tax/shipping, and blocks unapplied quantity changes", async ({ page }, testInfo) => {
  await seedCart(page);
  const generate = page.getByRole("button", { name: "Generar pedido", exact: true });
  await generate.click();
  await expect(page.getByLabel("Nombre completo", { exact: true })).toBeFocused();
  await contactDetails(page);
  await page.getByRole("radio", { name: /Entrega a domicilio/ }).check();
  await page.getByRole("radio", { name: /Dentro de la GAM/ }).check();
  await generate.click();
  await expect(page.getByLabel("Provincia", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Provincia", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("form dl")).toContainText("₡7 794");
  await expect(page.locator("form dl")).toContainText("IVA (13%)₡494");
  await addressDetails(page);
  await page.getByRole("radio", { name: /Fuera de la GAM/ }).check();
  await expect(page.locator("form dl")).toContainText("Por cotizar");
  await expect(page.locator("form dl")).toContainText("Total sin envío₡4 294");
  await page.getByRole("radio", { name: /Retiro/ }).check();
  await expect(page.getByLabel("Dirección exacta y referencias", { exact: true })).toHaveCount(0);
  await expect(page.locator("form dl")).toContainText("Sin costo · retiro");
  await page.getByRole("navigation", { name: "Pasos del pedido" }).getByRole("button", { name: /Carrito/ }).click();
  await page.getByRole("spinbutton", { name: "Cantidad" }).fill("3");
  await expect(page.getByRole("button", { name: "Continuar al pedido" })).toBeDisabled();
  await page.getByRole("spinbutton", { name: "Cantidad" }).fill("2");
  await expect(page.getByRole("button", { name: "Continuar al pedido" })).toBeEnabled();
  await expect(page.getByRole("link", { name: "Carrito, 2 productos", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 800 });
  await expect(page.getByRole("link", { name: "Carrito, 2 productos", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0, 0); });
  await page.screenshot({ path: testInfo.outputPath("cart-mobile.png"), fullPage: true });
  await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("main h1, main h2, main h3, main p, main label, main input, main button, main dt, main dd"));
    const sizes = elements.map((element) => parseFloat(getComputedStyle(element).fontSize));
    elements.forEach((element, index) => { element.style.fontSize = `${sizes[index] * 2}px`; });
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("failed generation preserves data and pending generation cannot be submitted twice", async ({ page }) => {
  await seedCart(page); await contactDetails(page);
  await page.getByRole("radio", { name: /Retiro/ }).check();
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  let posts = 0;
  await page.route("**/carrito", async (route) => {
    if (route.request().method() === "POST") { posts++; await gate; await route.abort("failed"); }
    else await route.continue();
  });
  await page.getByRole("button", { name: "Generar pedido", exact: true }).click();
  await expect(page.getByRole("button", { name: "Verificando pedido…", exact: true })).toBeDisabled();
  await expect(page.getByLabel("Nombre completo", { exact: true })).toBeDisabled();
  release();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("No pudimos generar el pedido");
  await expect(page.getByLabel("Nombre completo", { exact: true })).toHaveValue("Ana Pérez");
  await expect(page.getByRole("button", { name: "Generar pedido", exact: true })).toBeEnabled();
  expect(posts).toBe(1);
  await expect(page.getByRole("link", { name: /Enviar pedido por WhatsApp/ })).toHaveCount(0);
});

test("a real cart generates GAM, pickup and outside-GAM orders without sending or clearing the cart", async ({ page }, testInfo) => {
  test.setTimeout(120_000);
  await page.goto("/producto/oreja-de-res-sin-pelo-deshidratada");
  const add = page.getByRole("button", { name: "Agregar al carrito", exact: true });
  await expect(add).toBeEnabled({ timeout: 45_000 });
  await add.click();
  await expect(page.getByText("Producto agregado al carrito.", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: /Ver carrito/ }).click();
  await page.getByRole("button", { name: "Continuar al pedido" }).click();
  await contactDetails(page);
  await page.getByRole("radio", { name: /Entrega a domicilio/ }).check();
  await page.getByRole("radio", { name: /Dentro de la GAM/ }).check();
  await addressDetails(page);
  await page.getByLabel("Notas del pedido", { exact: false }).fill("Por favor, avisar antes de llegar.");
  await page.getByRole("button", { name: "Generar pedido", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Tu pedido está listo para enviar" })).toBeFocused({ timeout: 30_000 });
  const send = page.getByRole("link", { name: /Enviar pedido por WhatsApp/ });
  const gamUrl = new URL((await send.getAttribute("href"))!);
  const gamMessage = gamUrl.searchParams.get("text")!;
  expect(gamUrl.hostname).toBe("wa.me");
  expect(gamMessage).toContain("Envío: ₡3 500");
  expect(gamMessage).toContain("IVA (13% sobre productos)");
  expect(gamMessage).toContain("100 metros norte de la plaza");
  expect(gamMessage).toContain("Por favor, avisar antes de llegar.");
  await expect(page.getByText("El pedido todavía no se ha enviado, confirmado ni pagado.", { exact: false })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("order-review.png"), fullPage: true });
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descargar pedido", exact: true }).click();
  expect((await downloadEvent).suggestedFilename()).toMatch(/^DNA-.*\.txt$/);
  await page.getByRole("button", { name: "Editar datos", exact: true }).click();
  await page.getByRole("radio", { name: /Retiro/ }).check();
  await page.getByRole("button", { name: "Generar pedido", exact: true }).click();
  await expect(send).toBeVisible({ timeout: 30_000 });
  const pickup = new URL((await send.getAttribute("href"))!).searchParams.get("text")!;
  expect(pickup).toContain("Entrega: retiro"); expect(pickup).toContain("Envío: ₡0");
  expect(pickup).not.toContain("casa azul");
  await page.getByRole("button", { name: "Editar datos", exact: true }).click();
  await page.getByRole("radio", { name: /Entrega a domicilio/ }).check();
  await page.getByRole("radio", { name: /Fuera de la GAM/ }).check();
  await page.getByRole("button", { name: "Generar pedido", exact: true }).click();
  await expect(send).toBeVisible({ timeout: 30_000 });
  const outside = new URL((await send.getAttribute("href"))!).searchParams.get("text")!;
  expect(outside).toContain("Envío: por cotizar; no incluido");
  expect(outside).toContain("Total sin envío:");
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).length, storageKey)).toBe(1);
  await page.evaluate((key) => {
    const items = JSON.parse(localStorage.getItem(key)!);
    items[0].quantity += 1;
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  }, storageKey);
  await expect(send).toHaveCount(0);
  await expect(page.getByText("El carrito cambió. Generá un nuevo resumen con tu selección actual.")).toBeVisible();
  await page.getByRole("navigation", { name: "Pasos del pedido" }).getByRole("button", { name: /Carrito/ }).click();
  await expect(page.getByRole("spinbutton", { name: "Cantidad" })).toHaveValue("2");
});
