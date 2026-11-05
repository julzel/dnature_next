import { expect, test } from "@playwright/test";

test("home page preserves its content, responsive layout, and appearance", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("main")).toMatchAriaSnapshot(`
    - main:
      - img "Next.js logo"
      - heading "To get started, edit the page.tsx file." [level=1]:
        - text: To get started, edit the
        - code: page.tsx
        - text: file.
      - paragraph:
        - text: Looking for a starting point or more instructions? Head over to
        - link "Templates":
          - /url: https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
        - text: or the
        - link "Learning":
          - /url: https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
        - text: center.
      - link "Vercel logomark Deploy Now":
        - /url: https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
        - img "Vercel logomark"
        - text: Deploy Now
      - link "Documentation":
        - /url: https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app
  `);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    page.viewportSize()!.width,
  );
  await expect(page.getByRole("link", { name: "Documentation", exact: true })).toBeInViewport();
  await expect(page).toHaveScreenshot("home.png", { fullPage: true });
});
