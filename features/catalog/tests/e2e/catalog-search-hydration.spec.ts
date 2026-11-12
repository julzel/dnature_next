import { expect, test } from "@playwright/test";

test("browser-decorated catalog search hydrates and retains live search and native filters", async ({ page }) => {
  test.setTimeout(60_000);
  const hydrationErrors: string[] = [];
  page.on("pageerror", (error) => { if (/hydrat|didn't match/i.test(error.message)) hydrationErrors.push(error.message); });
  page.on("console", (message) => { if (message.type() === "error" && /hydrat|didn't match/i.test(message.text())) hydrationErrors.push(message.text()); });
  let decoratedNodes = 0;
  await page.route("**/productos?*", async (route) => {
    if (route.request().resourceType() !== "document") return route.continue();
    const response = await route.fetch();
    const html = (await response.text()).replace(/<form\b[^>]*role="search"[^>]*>[\s\S]*?<\/form>/g, (form) => form.replace(/<(form|input)\b/g, (_tag, name) => `<${name} __gcruniqueid="${++decoratedNodes}"`));
    await route.fulfill({ response, body: html });
  });
  await page.goto("/productos?categoria=deshidratados&q=res");
  const input = page.getByRole("searchbox", { name: "Buscar productos", exact: true });
  await expect(input).toHaveValue("res", { timeout: 45_000 });
  expect(decoratedNodes).toBeGreaterThanOrEqual(3);
  await expect(input).toHaveAttribute("__gcruniqueid", /\d+/);
  const form = page.getByRole("search").filter({ has: input });
  await expect(form).toHaveAttribute("method", "get");
  expect(await form.evaluate((element) => new FormData(element as HTMLFormElement).getAll("categoria"))).toEqual(["deshidratados"]);
  await input.fill("Cuellos de pollo");
  await expect(page.getByRole("heading", { name: "Cuellos de pollo deshidratados", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/q=Cuellos/);
  expect(await form.evaluate((element) => new FormData(element as HTMLFormElement).get("q"))).toBe("Cuellos de pollo");
  await form.getByRole("button", { name: "Limpiar búsqueda", exact: true }).click();
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();
  expect(hydrationErrors).toEqual([]);
});
