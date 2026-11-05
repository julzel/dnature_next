import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/prototype"); });

test("experience tabs support keyboard selection without hiding the catalog", async ({ page }) => {
  const discover = page.getByRole("tab", { name: "Descubrir", exact: true });
  await discover.focus();
  await discover.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Mi DNAture", exact: true })).toBeFocused();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Menos pasos. Más tiempo juntos.");
  await page.getByRole("tab", { name: "Mi DNAture", exact: true }).press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Ciencia", exact: true })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("La confianza necesita evidencia.");
  await expect(page.getByRole("link", { name: "Ver productos", exact: true })).toHaveAttribute("href", "#productos");
  await page.getByRole("tab", { name: "Ciencia", exact: true }).press("Home");
  await expect(discover).toHaveAttribute("aria-selected", "true");
});

test("pet discovery is optional, explains its limits, and returns focus on Escape", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Empezar por mi mascota", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "¿Quién te acompaña?", exact: true });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("radio", { name: "Gato", exact: true }).check();
  await expect(dialog.getByRole("status")).toContainText("La especie es un punto de partida");
  await expect(dialog.getByRole("link", { name: "Prefiero ver las familias de productos" })).toHaveAttribute("href", "#productos");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(dialog.getByRole("radio", { name: "Gato", exact: true })).not.toBeChecked();
});

test("family filters and details work without presenting an unverified offer", async ({ page }) => {
  const filters = page.getByRole("group", { name: "Filtrar familias" });
  await expect(page.locator(".family-card")).toHaveCount(9);
  await filters.getByRole("button", { name: "Recetas", exact: true }).click();
  await expect(page.locator(".family-card")).toHaveCount(4);
  await filters.getByRole("button", { name: "Suplementos", exact: true }).click();
  await expect(page.locator(".family-card")).toHaveCount(1);
  const trigger = page.getByRole("button", { name: "Conocer Suplementos", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Suplementos", exact: true });
  await expect(dialog).toContainText("disponibilidad comercial están por confirmar");
  await expect(dialog.getByRole("button", { name: /comprar|agregar/i })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await filters.getByRole("button", { name: "Todas", exact: true }).click();
  await expect(page.locator(".family-card")).toHaveCount(9);
});

test("search provides matching families and a recoverable empty state", async ({ page }) => {
  await page.getByRole("button", { name: "Buscar en DNAture", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "¿Qué querés explorar?", exact: true });
  const search = dialog.getByRole("searchbox");
  await search.fill("suplementos");
  await expect(dialog.getByRole("link", { name: "Suplementos", exact: true })).toBeVisible();
  await expect(dialog.getByRole("status")).toHaveText("1 familia encontrada");
  await search.fill("does-not-exist");
  await expect(dialog.getByText("No encontramos una familia con ese nombre.")).toBeVisible();
  await dialog.getByRole("button", { name: "Ver todas las familias", exact: true }).click();
  await expect(dialog.getByRole("status")).toHaveText("9 familias encontradas");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Buscar en DNAture", exact: true })).toBeFocused();
});

test("cart communicates the prototype state and supports browsing", async ({ page }) => {
  await page.getByRole("button", { name: "Ver carrito, 0 productos", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Tu carrito está vacío", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("todavía no permite realizar compras");
  await dialog.getByRole("link", { name: "Explorar productos", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#productos$/);
});

test("FAQs are operable with the keyboard", async ({ page }) => {
  const question = page.locator("summary").filter({ hasText: "¿Todas las recetas cumplen la misma función?" });
  await question.focus();
  await question.press("Enter");
  await expect(page.getByText("No. Las Recetas Complete, de Trucha, Cocidas y Wild son familias distintas.", { exact: false })).toBeVisible();
});
