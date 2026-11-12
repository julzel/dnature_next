import { expect, test } from "@playwright/test";

test("browser-added search attributes do not trigger hydration errors", async ({ page, request }) => {
  const response = await request.get("/nosotros");
  expect(await response.text()).not.toMatch(/<input[^>]*id="header-search-query"/);
  const hydrationErrors: string[] = [];
  page.on("pageerror", (error) => { if (/hydrat|didn't match/i.test(error.message)) hydrationErrors.push(error.message); });
  page.on("console", (message) => { if (message.type() === "error" && /hydrat|didn't match/i.test(message.text())) hydrationErrors.push(message.text()); });
  await page.addInitScript(() => {
    // Reproduce a browser/autofill tool decorating inputs as soon as they appear.
    const observer = new MutationObserver(() => {
      const input = document.getElementById("header-search-query");
      if (input && !input.hasAttribute("__gCrUniqueid")) input.setAttribute("__gCrUniqueid", "1");
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.goto("/nosotros");
  const toggle = page.getByRole("button", { name: "Abrir búsqueda", exact: true });
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Buscar en DNAture" });
  const input = dialog.getByRole("searchbox", { name: "Buscar en el sitio" });
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute("__gcruniqueid", "1");
  await input.fill("criterios");
  await expect(dialog.getByRole("status")).toHaveText("1 página encontrada.");
  const result = dialog.getByRole("link", { name: "Nuestros criterios de publicación", exact: true });
  await input.press("ArrowDown");
  await expect(result).toBeFocused();
  await result.press("ArrowUp");
  await expect(input).toBeFocused();
  await input.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(toggle).toBeFocused();
  expect(hydrationErrors).toEqual([]);
});
