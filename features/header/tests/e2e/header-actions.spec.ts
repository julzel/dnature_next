import { expect, test, type Locator } from "@playwright/test";
import { dismissArrivalDialog } from "../../../../tests/helpers/dismiss-arrival-dialog";

async function appearance(control: Locator) {
  return control.evaluate((element) => {
    const style = getComputedStyle(element);
    const icon = getComputedStyle(element.querySelector("svg")!);
    return {
      color: style.color, background: style.backgroundColor,
      border: style.borderBottom, radius: style.borderRadius,
      width: style.width, height: style.height,
      outline: style.outline, offset: style.outlineOffset,
      iconWidth: icon.width, iconHeight: icon.height, stroke: icon.strokeWidth,
    };
  });
}

for (const width of [320, 1024, 1440]) {
  test(`header controls share all interaction states at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/nosotros"]) {
      await page.goto(path);
      if (path === "/") await dismissArrivalDialog(page);
      const header = page.getByRole("banner");
      const cart = header.getByRole("link", { name: /^Carrito,/ });
      const search = header.getByRole("button", { name: "Abrir búsqueda", exact: true });
      await page.mouse.move(0, 200);
      expect(await appearance(cart)).toEqual(await appearance(search));
      await cart.hover();
      const hover = await appearance(cart);
      await search.hover();
      expect(await appearance(search)).toEqual(hover);
      expect(hover.radius).toBe("0px");
      expect(hover.color).toBe("rgb(32, 50, 55)");
      expect(hover.iconWidth).toBe("22px");
      await page.mouse.move(0, 200);
      await page.keyboard.press("Tab");
      await cart.focus();
      const focus = await appearance(cart);
      await search.focus();
      expect(await appearance(search)).toEqual(focus);
      expect(focus.outline).toContain("solid");
      expect(focus.outline).toContain("3px");
      await search.evaluate((element: HTMLButtonElement) => element.blur());
      const pressed = [];
      for (const control of [cart, search]) {
        await control.hover();
        await page.mouse.down();
        pressed.push(await appearance(control));
        await page.mouse.move(0, 200);
        await page.mouse.up();
        await control.evaluate((element: HTMLElement) => element.blur());
      }
      expect(pressed[0]).toEqual(pressed[1]);
      await search.click();
      await expect(search).toHaveAttribute("aria-expanded", "true");
      const expanded = await appearance(search);
      expect(expanded.background).toBe(hover.background);
      expect(expanded.color).toBe(hover.color);
      await page.keyboard.press("Escape");
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      if (width >= 1024) {
        const nav = header.getByRole("navigation", { name: "Navegación principal" });
        const box = (await nav.boundingBox())!;
        expect(Math.abs(box.x + box.width / 2 - width / 2)).toBeLessThan(1);
        await expect(nav.locator("svg")).toHaveCount(0);
        expect((await cart.boundingBox())!.x).toBeGreaterThan(box.x + box.width);
      }
    }
    await page.goto("/carrito");
    const currentCart = page.getByRole("banner").getByRole("link", { name: /^Carrito,/ });
    await expect(currentCart).toHaveAttribute("aria-current", "page");
    await expect(currentCart).toHaveCSS("border-bottom-color", "rgb(0, 169, 181)");
  });
}
