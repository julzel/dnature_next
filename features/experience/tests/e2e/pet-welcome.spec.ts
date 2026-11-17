import { expect, test } from "@playwright/test";

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`welcome introduces the guided experience before the first question (${reducedMotion})`, async ({ page }, testInfo) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/#experiencia-personalizada", { waitUntil: "commit" });
    const section = page.locator("#experiencia-personalizada");
    await expect(section.getByRole("heading", { name: "¡Qué bueno tenerte por aquí!" })).toHaveCount(0);
    await expect(section).toContainText("A continuación conoceremos más de tu mascota");
    const artwork = section.getByRole("img", { name: "Perros y gatos de distintos tamaños y razas, incluidos mestizos, sentados juntos." });
    await expect(artwork).toHaveAttribute("src", "/images/pets/pet-diversity-v2.svg");
    await artwork.scrollIntoViewIfNeeded();
    await expect.poll(() => artwork.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(section.getByRole("button", { name: "Gato", exact: true })).toHaveCount(0);
    const start = section.getByRole("button", { name: "Empecemos", exact: true });
    await expect(start.locator("span")).toBeVisible();
    await section.screenshot({ path: testInfo.outputPath("pet-welcome.png") });
    await start.focus();
    await start.press("Enter");
    await expect(section.getByRole("heading", { name: "¿Gato o perro?" })).toBeFocused();
    await expect(section).not.toContainText("Pregunta 1 de 3");
    await expect(start).toHaveCount(0);
    await expect(artwork).toHaveCount(0);
    await expect(section.getByRole("button", { name: "Gato", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  });
}

test("visitors can leave the welcome slide to browse", async ({ page }) => {
  await page.goto("/#experiencia-personalizada", { waitUntil: "commit" });
  await page.locator("#experiencia-personalizada").getByRole("link", { name: "Prefiero explorar" }).click();
  await expect(page).toHaveURL(/#explorar$/);
});
