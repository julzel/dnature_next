import { expect, test } from "@playwright/test";

// The normal SEO test build deliberately enables production indexing.
for (const path of ["/", "/nosotros", "/images/pets/dog.svg", "/this-page-does-not-exist"]) {
  test(`production build protects the canary alias at ${path}`, async ({ request }) => {
    const response = await request.get(path, { headers: { Host: "canary.dnaturefood.com" } });
    expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  });
}

test("the public production origin retains its indexing opt-in", async ({ request }) => {
  const response = await request.get("/nosotros", { headers: { Host: "dnaturefood.com" } });
  expect(response.status()).toBe(200);
  expect(response.headers()["x-robots-tag"]).toBeUndefined();
  expect(await response.text()).toContain('name="robots" content="index, follow"');
});
