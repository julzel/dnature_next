import { expect, test } from "@playwright/test";

const imageUrl = "https://images.ctfassets.net/vyl67gce90hn/6s0ulvyltbZ7pSGEujm6BT/7ba356a4deed19234e05b92865c1d2a6/oreja_resss.jpg";
const items = [
  { sku: "a", parentSku: "a", name: "Bocados de res deshidratados", category: "Deshidratados", presentation: "80 g", quantity: 2, price: 3950, path: "/producto/a", imageUrl },
  { sku: "b", parentSku: "b", name: "Complemento de ejemplo", category: "Complementos", presentation: "50 g", quantity: 1, price: 2850, path: "/producto/b", imageUrl },
];

test("responsive cart overview and steps preserve customer input", async ({ page }, testInfo) => {
  await page.addInitScript((items) => localStorage.setItem("dnature.cart.v1", JSON.stringify(items)), items);
  await page.goto("/carrito");
  await expect(page.getByRole("heading", { name: "Productos seleccionados (3)" })).toBeVisible();
  const summary = page.getByRole("complementary", { name: "Resumen de compra" });
  await expect(summary).toContainText("₡10 750");
  await expect(summary).toContainText("₡1 398");
  await expect(summary).toContainText("₡12 148");
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const productsBox = await page.getByRole("region", { name: "Productos seleccionados (3)" }).boundingBox();
    const summaryBox = await summary.boundingBox();
    if (width >= 1024) expect(summaryBox!.x).toBeGreaterThan(productsBox!.x + productsBox!.width);
    else expect(summaryBox!.y).toBeGreaterThan(productsBox!.y + productsBox!.height);
    if (width === 1440 || width === 390) await page.screenshot({ path: testInfo.outputPath(`cart-${width}.png`), fullPage: true });
  }
  await page.getByRole("button", { name: "Continuar al pedido" }).click();
  await expect(page.getByRole("heading", { name: "Prepará tu pedido" })).toBeFocused();
  await expect(page.locator('[aria-current="step"]')).toHaveText("02Datos y entrega");
  await page.getByLabel("Nombre completo", { exact: true }).fill("Ana Pérez");
  await page.getByRole("navigation", { name: "Pasos del pedido" }).getByRole("button", { name: /Carrito/ }).click();
  await expect(page.getByRole("heading", { name: "Productos seleccionados (3)" })).toBeFocused();
  await page.getByRole("button", { name: "Continuar al pedido" }).click();
  await expect(page.getByLabel("Nombre completo", { exact: true })).toHaveValue("Ana Pérez");
  await page.getByRole("navigation", { name: "Pasos del pedido" }).getByRole("button", { name: /Carrito/ }).click();
  await page.getByRole("button", { name: /Quitar Bocados/ }).click();
  await expect(page.getByRole("heading", { name: "Productos seleccionados (1)" })).toBeVisible();
});
