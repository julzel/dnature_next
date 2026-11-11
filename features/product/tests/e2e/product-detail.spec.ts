import { expect, test } from "@playwright/test";

const path = "/producto/oreja-de-res-sin-pelo-deshidratada";

test("product details have crawlable content and presentation-specific inquiries", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(path);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Oreja de res sin pelo deshidratada", { timeout: 45_000 });
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://dnaturefood.com${path}`);
  await expect(page).toHaveTitle("Oreja de res sin pelo deshidratada | DNAture");
  const radios = page.getByRole("radio");
  expect(await radios.count()).toBeGreaterThan(1);
  await radios.first().check();
  await expect(radios.first()).toBeChecked();
  const sku = await radios.first().inputValue();
  const inquiry = page.getByRole("link", { name: /Consultar (pedido por WhatsApp|disponibilidad)/ });
  await expect(inquiry).toHaveAttribute("href", new RegExp(encodeURIComponent(sku)));
  expect(new URL((await inquiry.getAttribute("href"))!).searchParams.get("text")).toContain(`https://dnaturefood.com${path}`);
  const related = page.getByRole("region", { name: /Seguí explorando/ });
  expect(await related.locator('a[href^="/producto/"]').count()).toBeGreaterThan(0);
  const profile = page.getByRole("region", { name: "Perfil de referencia del producto", exact: true });
  await expect(profile).toContainText("Perros");
  await expect(profile).toContainText("Avanzada");
  await expect(page.getByText("Supervisá su consumo.", { exact: true })).toBeVisible();
  await expect(page.getByText("Riesgo de atragantamiento indicado:")).toContainText("alto");
  expect(await page.locator('#product-precautions-title').evaluate((element) => Boolean(element.compareDocumentPosition(document.querySelector('a[href^="https://wa.me/"][href*="text="]')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await page.getByRole("navigation", { name: "Información del producto" }).getByRole("link", { name: "Ingredientes", exact: true }).click();
  await expect(page).toHaveURL(/#ingredientes$/);
  await expect(page.getByRole("heading", { name: "Ingredientes", exact: true })).toBeInViewport();
  await page.getByText("Sobre la información del producto", { exact: true }).click();
  await expect(page.getByText(/El perfil y las precauciones provienen/)).toBeVisible();
  await page.setViewportSize({ width: 320, height: 760 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect(errors).toEqual([]);
});

test("source editorial exclusions also apply to direct product URLs", async ({ page }) => {
  await page.goto("/producto/ajo-y-perejil");
  await expect(page.getByRole("heading", { name: "Producto no encontrado", exact: true })).toBeVisible({ timeout: 45_000 });
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});

test("presentation controls support the keyboard and 200 percent text at a narrow width", async ({ page }) => {
  await page.goto(path);
  const radios = page.getByRole("radio");
  await radios.first().focus();
  await radios.first().press("ArrowDown");
  await expect(radios.nth(1)).toBeChecked();
  await expect(radios.nth(1)).toBeFocused();
  await page.setViewportSize({ width: 320, height: 760 });
  // Model text-only enlargement, including the page's explicit pixel font sizes.
  await page.evaluate(() => {
    const text = [...document.querySelectorAll<HTMLElement>("main *")]
      .filter((element) => [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()))
      .map((element) => ({ element, size: parseFloat(getComputedStyle(element).fontSize) }));
    for (const { element, size } of text) element.style.fontSize = `${size * 2}px`;
  });
  const overflow = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: innerWidth,
    elements: [...document.querySelectorAll("main *")].filter((element) => element.getBoundingClientRect().right > innerWidth + 1).map((element) => ({ tag: element.tagName, className: element.className, text: element.textContent?.slice(0, 80) })),
  }));
  expect(overflow.width, JSON.stringify(overflow.elements)).toBeLessThanOrEqual(overflow.viewport);
  await expect(page.getByRole("link", { name: /Consultar (pedido por WhatsApp|disponibilidad)/ })).toBeVisible();
});

test("gallery thumbnails switch the displayed photo using native buttons", async ({ page }) => {
  await page.goto("/producto/corazon-de-res");
  const thumbnails = page.getByRole("group", { name: "Imágenes del producto" }).getByRole("button");
  await expect(thumbnails).toHaveCount(2, { timeout: 45_000 });
  const firstImage = await page.locator('main article img').first().getAttribute("src");
  await thumbnails.nth(1).click();
  await expect(thumbnails.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('main article img').first()).not.toHaveAttribute("src", firstImage!);
});

test("unknown products show a useful noindex missing-product state", async ({ page }) => {
  await page.goto("/producto/no-existe-este-producto");
  await expect(page.getByRole("heading", { name: "Producto no encontrado", exact: true })).toBeVisible({ timeout: 45_000 });
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("link", { name: "Explorar productos", exact: true })).toHaveAttribute("href", "/productos");
});

test("the server response contains product HTML, metadata, and related links for crawlers", async ({ request }) => {
  const response = await request.get(path, { headers: { "User-Agent": "Google-InspectionTool" } });
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain("Oreja de res sin pelo deshidratada | DNAture");
  expect(html).toMatch(/<h1[^>]*>Oreja de res sin pelo deshidratada<\/h1>/);
  expect(html).toMatch(/<h2[^>]*>Ingredientes<\/h2>/);
  expect(html).toContain("Perfil orientativo del catálogo");
  expect(html).toContain("Supervisá su consumo");
  expect(html).not.toContain("Cantidad recomendada");
  expect(html).toContain('href="/producto/');
  expect(html).toContain(`href="https://dnaturefood.com${path}"`);
});

test.describe("ordinary browsers without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the streamed shell provides contact and catalog navigation", async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "Consultá este producto", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Consultar por WhatsApp", exact: true })).toHaveAttribute("href", "https://wa.me/50671848868");
  });
});
