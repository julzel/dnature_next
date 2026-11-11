import { expect, test } from "@playwright/test";

test.setTimeout(60_000);
let pageErrors: string[] = [];
test.beforeEach(({ page }) => {
  pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
});
test.afterEach(() => { expect(pageErrors).toEqual([]); });

test("sorting supports keyboard exploration, cancellation, typeahead, and browser history", async ({ page }) => {
  await page.goto("/productos?q=pollo");
  const sort = page.getByRole("combobox", { name: "Ordenar", exact: true });
  await expect(sort).toHaveAttribute("aria-expanded", "false", { timeout: 45_000 });
  await expect(sort).toHaveText("Más relevantes");

  await sort.focus();
  await sort.press("ArrowDown");
  await expect(page.getByRole("listbox", { name: "Ordenar" })).toBeVisible();
  await sort.press("End");
  const highestPrice = page.getByRole("option", { name: "Mayor precio", exact: true });
  await expect(sort).toHaveAttribute("aria-activedescendant", (await highestPrice.getAttribute("id"))!);
  await expect(page).toHaveURL(/\/productos\?q=pollo$/);
  await sort.press("Escape");
  await expect(sort).toHaveText("Más relevantes");
  await expect(sort).toBeFocused();

  await sort.press("m");
  await sort.press("e");
  await sort.press("n");
  const lowestPrice = page.getByRole("option", { name: "Menor precio", exact: true });
  await expect(sort).toHaveAttribute("aria-activedescendant", (await lowestPrice.getAttribute("id"))!);
  await sort.press("Enter");
  await expect(sort).toHaveText("Menor precio");
  await expect(sort).toHaveAttribute("aria-expanded", "false");
  await expect(sort).toBeFocused();
  await expect(page).toHaveURL(/q=pollo&orden=price-asc$/);
  await expect(page.locator('select[name="orden"]')).toHaveValue("price-asc");

  await page.goBack();
  await expect(sort).toHaveText("Más relevantes");
  await expect(page.getByPlaceholder("Producto, ingrediente o SKU")).toHaveValue("pollo");
});

test("pointer selection reorders products locally and outside clicks dismiss the options", async ({ page }) => {
  await page.goto("/productos");
  const sort = page.getByRole("combobox", { name: "Ordenar", exact: true });
  await expect(sort).toHaveAttribute("aria-expanded", "false", { timeout: 45_000 });
  const documentRequests: string[] = [];
  page.on("request", (request) => { if (request.resourceType() === "document") documentRequests.push(request.url()); });

  await sort.click();
  await expect(page.getByRole("option", { name: "Disponibles primero", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("option", { name: "Mayor precio", exact: true }).click();
  await expect(sort).toHaveText("Mayor precio");
  await expect(sort).toBeFocused();
  await expect(page).toHaveURL(/orden=price-desc$/);
  const prices = (await page.getByRole("list", { name: "Productos encontrados" }).locator("article > div > p").filter({ hasText: "₡" }).allTextContents())
    .map((price) => Number(price.replace(/\D/g, "")));
  expect(prices.length).toBeGreaterThan(1);
  expect(prices).toEqual([...prices].sort((a, b) => b - a));
  expect(documentRequests).toEqual([]);

  await sort.click();
  await page.getByRole("heading", { name: "Todos los productos", exact: true }).click();
  await expect(sort).toHaveAttribute("aria-expanded", "false");
  await expect(sort).toHaveText("Mayor precio");
  await sort.click();
  const viewport = page.viewportSize()!;
  await page.setViewportSize({ width: viewport.width, height: viewport.height - 32 });
  await expect(page.getByRole("listbox", { name: "Ordenar" })).toBeVisible();
});

test("the dropdown fits narrow screens and keeps options visible with enlarged text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/productos");
  const sort = page.getByRole("combobox", { name: "Ordenar", exact: true });
  await expect(sort).toHaveAttribute("aria-expanded", "false", { timeout: 45_000 });
  await page.addStyleTag({ content: '[role="combobox"], [role="option"] { font-size: 28px !important; }' });
  await sort.click();
  await sort.press("End");
  const list = page.getByRole("listbox", { name: "Ordenar" });
  const lastOption = page.getByRole("option", { name: "Mayor precio", exact: true });
  await expect(lastOption).toBeInViewport();
  const listBounds = await list.boundingBox();
  expect(listBounds!.x).toBeGreaterThanOrEqual(0);
  expect(listBounds!.x + listBounds!.width).toBeLessThanOrEqual(320);
  expect(listBounds!.y + listBounds!.height).toBeLessThanOrEqual(568);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await sort.press("Tab");
  await expect(sort).toHaveText("Mayor precio");
  await expect(sort).toHaveAttribute("aria-expanded", "false");
  await expect(sort).not.toBeFocused();
});
