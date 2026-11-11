import { expect, test, type Locator } from "@playwright/test";

async function checkTransition(element: Locator, withBackground = false) {
  const state = await element.evaluate((node) => {
    const transition = node.getAnimations().find((animation) => animation instanceof CSSTransition && animation.transitionProperty === "background-size");
    if (!transition) return null;
    const background = node.getAnimations().find((animation) => animation instanceof CSSTransition && animation.transitionProperty === "background-color");
    const backgroundDuration = background?.effect?.getTiming().duration;
    const borderDuration = transition.effect?.getTiming().duration;
    const padding = getComputedStyle(node).paddingInlineStart;
    transition.pause();
    transition.currentTime = 210;
    const style = getComputedStyle(node);
    const intermediate = parseFloat(style.backgroundSize);
    const image = style.backgroundImage;
    const position = style.backgroundPosition;
    transition.finish();
    return { intermediate, image, position, backgroundDuration, borderDuration, padding };
  });
  expect(state).not.toBeNull();
  expect(state!.intermediate).toBeGreaterThan(0);
  expect(state!.intermediate).toBeLessThan(100);
  expect(state!.image).toContain("rgb(0, 169, 181)");
  expect(state!.position).toContain("50% 100%");
  if (withBackground) {
    expect(state!.backgroundDuration).toBe(state!.borderDuration);
    expect(state!.backgroundDuration).toBeGreaterThan(0);
    expect(state!.padding).toBe("16px");
  }
}

test("teal borders animate outward from the center on pet choices and the name input", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#experiencia-personalizada", { waitUntil: "commit" });
  const section = page.locator("#experiencia-personalizada");
  await section.getByRole("button", { name: "Empecemos", exact: true }).click();
  await expect(section.getByRole("heading", { name: "¿Gato o perro?" })).toBeFocused();
  const cat = section.getByRole("button", { name: "Gato", exact: true });
  await cat.hover();
  await checkTransition(cat, true);
  await expect(cat.locator("svg")).toHaveCount(1);
  await cat.click();
  await expect(section.getByRole("heading", { name: "¿Cómo se llama tu mascota?" })).toBeFocused();
  const input = section.getByRole("textbox", { name: "Nombre de tu mascota" });
  await input.hover();
  await checkTransition(input.locator(".."));
});
