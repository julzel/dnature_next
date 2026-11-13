import { expect, test } from "@playwright/test";
import partners from "../../data/partners.json";

test("live search combines words and consultation mode, with keyboard and empty-state recovery", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/alianzas");
  const directory = page.locator("#directorio");
  const search = directory.getByRole("searchbox", { name: "Nombre, servicio o ubicación" });
  const mode = directory.getByRole("combobox", { name: "Modalidad de atención" });
  const status = directory.getByRole("status");
  await expect(search).toBeEnabled();
  await expect(status).toHaveText("10 profesionales para conocer");
  await search.fill("ECOGRAFIA quesada");
  await expect(status).toHaveText("1 profesional en tu búsqueda");
  await expect(directory.getByRole("article")).toHaveCount(1);
  await expect(directory.getByRole("heading", { name: "Alejandro Quesada Bolaños" })).toBeVisible();
  await mode.click();
  await page.getByRole("option", { name: "Presencial", exact: true }).click();
  await expect(status).toHaveText("0 profesionales en tu búsqueda");
  await expect(directory.getByRole("article")).toHaveCount(0);
  await directory.getByRole("button", { name: "Ver todos los profesionales" }).click();
  await expect(search).toBeFocused();
  await expect(status).toHaveText("10 profesionales para conocer");
  await mode.focus();
  await mode.press("Enter");
  await mode.press("ArrowDown");
  await mode.press("Enter");
  await expect(mode).toHaveText("En línea");
  await expect(status).toHaveText("3 profesionales en tu búsqueda");
  await search.fill("cartago nutricion");
  await expect(directory.getByRole("heading", { name: "Karla Tatiana Alvarado Rodríguez" })).toBeVisible();
  await expect(status).toHaveText("1 profesional en tu búsqueda");
  await directory.getByRole("button", { name: "Limpiar búsqueda de profesionales" }).click();
  await expect(search).toBeFocused();
  await expect(status).toHaveText("3 profesionales en tu búsqueda");
  expect(errors).toEqual([]);
});

test("profiles expose clear contact options and the page is discoverable", async ({ page }) => {
  await page.goto("/alianzas");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Profesionales aliados");
  const directory = page.locator("#directorio");
  for (const partner of partners) {
    const profile = directory.locator(`#${partner.id}`);
    await expect(profile.getByRole("heading", { name: partner.name, exact: true })).toBeVisible();
    for (const phone of partner.phones) {
      await expect(profile.getByRole("link", { name: `Llamar a ${partner.name}: ${phone.label}` })).toHaveAttribute("href", phone.href);
    }
  }
  await expect(directory.getByRole("link", { name: /^Reservar cita con/ })).toHaveCount(2);
  await expect(page.locator("#nancy-chacon-vega")).toContainText("Bienestar no veterinario");
  await expect(page.locator("#ana-laura-gonzalez-arias")).toContainText("Las citas se coordinan con Sara.");
  expect(await page.getByRole("main").innerText()).not.toMatch(/10%|regalía|pending_confirmation|source_cell|@gmail|dermatolohoaveterinariacr/);
  const footerLink = page.getByRole("contentinfo").getByRole("link", { name: "Profesionales aliados", exact: true });
  await expect(footerLink).toHaveAttribute("href", "/alianzas");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.getByRole("banner").getByRole("link", { name: "Alianzas", exact: true })).toHaveAttribute("aria-current", "page");
  await page.goto("/nosotros#acompanamiento");
  await expect(page.getByRole("link", { name: /Conocé profesionales aliados/ })).toHaveAttribute("href", "/alianzas");
});

test("mobile, tablet, desktop and enlarged text preserve the open layout", async ({ page }, testInfo) => {
  await page.goto("/alianzas");
  await page.evaluate(async () => { await document.fonts.ready; });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width >= 1024) {
      const banner = await page.getByRole("banner").boundingBox();
      expect(banner?.height).toBe(74);
    }
    if (width === 390 || width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: testInfo.outputPath(`alianzas-hero-${width}.png`) });
      await page.locator("#directorio").evaluate((directory) => window.scrollTo(0, directory.getBoundingClientRect().top + window.scrollY - 80));
      await page.screenshot({ path: testInfo.outputPath(`alianzas-directory-${width}.png`) });
    }
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  const contactSizes = await page.locator('#directorio a[href^="tel:"], #directorio a[target="_blank"]').evaluateAll((links) => links.map((link) => link.getBoundingClientRect().height));
  expect(contactSizes.every((height) => height >= 44)).toBe(true);
  await page.getByRole("main").evaluate((main) => {
    const elements = [main, ...main.querySelectorAll<HTMLElement>("*")];
    const sizes = elements.map((element) => parseFloat(getComputedStyle(element).fontSize));
    elements.forEach((element, index) => { element.style.fontSize = `${sizes[index] * 2}px`; });
  });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByRole("link", { name: "Llamar a Karla Tatiana Alvarado Rodríguez: +506 6233-3275" })).toBeVisible();
});

test("all profiles, contacts and truthful structured data render without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  const response = await page.goto("/alianzas");
  expect(response?.status()).toBe(200);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://dnaturefood.com/alianzas");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /profesionales/);
  await expect(page.locator("#directorio").getByRole("article")).toHaveCount(10);
  await expect(page.getByRole("searchbox", { name: "Nombre, servicio o ubicación" })).toBeDisabled();
  for (const partner of partners) await expect(page.getByRole("heading", { name: partner.name, exact: true })).toBeVisible();
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const collection = schemas.map((schema) => JSON.parse(schema)).find((schema) => schema["@type"] === "CollectionPage");
  expect(collection.mainEntity.itemListElement.map((item: { url: string }) => item.url)).toEqual(partners.map((partner) => `https://dnaturefood.com/alianzas#${partner.id}`));
  expect(JSON.stringify(collection)).not.toMatch(/MedicalBusiness|aggregateRating|discount|Offer/);
  await page.getByRole("link", { name: "Encontrá tu profesional" }).click();
  await expect(page).toHaveURL(/\/alianzas#directorio$/);
  await context.close();
});
