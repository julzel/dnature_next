import { expect, test } from "@playwright/test";

test("home page loads its content and images without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Create Next App");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "To get started, edit the page.tsx file.",
  );
  await expect(page.getByRole("main")).toBeVisible();
  for (const name of ["Next.js logo", "Vercel logomark"]) {
    const image = page.getByRole("img", { name });
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
      .toBe(true);
  }
  expect(errors).toEqual([]);
});

for (const [name, destination] of [
  ["Deploy Now", "https://vercel.com/new"],
  ["Documentation", "https://nextjs.org/docs"],
] as const) {
  test(`${name} opens the expected destination in a new tab`, async ({ page, context }) => {
    // Exercise the real click without relying on external sites or sending requests to them.
    await context.route(`${destination}**`, (route) =>
      route.fulfill({ contentType: "text/html", body: "<h1>Destination</h1>" }),
    );
    await page.goto("/");
    const link = page.getByRole("link", { name: new RegExp(`${name}$`) });
    await expect(link).toBeVisible();
    const [popup] = await Promise.all([
      page.waitForEvent("popup"),
      link.click(),
    ]);
    await expect(popup).toHaveURL(
      (url) => `${url.origin}${url.pathname}` === destination,
    );
    await expect(popup.getByRole("heading")).toHaveText("Destination");
    await expect(page).toHaveURL("/");
  });
}

test("unknown routes return a usable 404 page", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();
  await expect(page.getByText("This page could not be found.", { exact: true })).toBeVisible();
});
