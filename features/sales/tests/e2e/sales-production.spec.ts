import { expect, test } from "@playwright/test";

test("internal sales page is unavailable in the production build", async ({ request }) => {
  const response = await request.get("/ventas-internos");
  expect(response.status()).toBe(404);
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
});
