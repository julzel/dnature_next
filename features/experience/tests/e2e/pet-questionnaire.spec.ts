import { expect, test } from "@playwright/test";

type SlideFrame = { text: string; opacity: number; underlineAnimatingBeforeSlideEnds: boolean };

test.beforeEach(async ({ page }) => {
  // The personalized form is in the static shell; catalog streaming is unrelated.
  await page.goto("/", { waitUntil: "commit" });
  await page.getByRole("dialog").getByRole("link", { name: "Visita guiada", exact: true }).click();
  await page.locator("#experiencia-personalizada").getByRole("button", { name: "Empecemos", exact: true }).click();
  await expect(page.getByRole("heading", { name: "¿Gato o perro?", exact: true })).toBeFocused();
});

test("questions slide in the navigation direction without losing answers", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const section = page.locator("#experiencia-personalizada");
  const initialHeight = (await section.getByRole("heading", { name: "¿Gato o perro?" }).locator("..").boundingBox())!.height;
  const [frames] = await Promise.all([
    page.evaluate(() => new Promise<SlideFrame[]>((resolve) => {
      const frames: SlideFrame[] = [];
      const started = performance.now();
      function sample() {
        const stage = document.querySelector<HTMLElement>('#experiencia-personalizada [data-phase]')!;
        const text = stage.querySelector("h3")!.textContent!;
        const nameField = stage.querySelector('[name="petName"]')?.parentElement;
        frames.push({ text, opacity: Number(getComputedStyle(stage).opacity), underlineAnimatingBeforeSlideEnds:
          Boolean(nameField && stage.dataset.phase !== "idle" && getComputedStyle(nameField, "::after").animationName !== "none") });
        if ((text === "¿Cómo se llama tu mascota?" && stage.dataset.phase === "idle") || performance.now() - started > 3000) resolve(frames);
        else requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    })),
    section.getByRole("button", { name: "Gato", exact: true }).click(),
  ]);
  for (const frame of frames) {
    expect(frame.opacity).toBe(1);
    expect(frame.underlineAnimatingBeforeSlideEnds).toBe(false);
  }
  const question = section.getByRole("heading", { name: "¿Cómo se llama tu mascota?" });
  await expect(question.locator("..")).toHaveAttribute("data-direction", "forward");
  await expect(question).toBeFocused();
  await expect(question.locator("..")).toHaveAttribute("data-phase", "idle");
  expect((await question.locator("..").boundingBox())!.height).toBe(initialHeight);
  const nameInput = section.getByRole("textbox", { name: "Nombre de tu mascota" });
  await expect(nameInput).toHaveCSS("text-align", "start");
  await expect(nameInput).toHaveCSS("font-weight", "700");
  await expect.poll(() => nameInput.evaluate((input) => getComputedStyle(input.parentElement!, "::after").transform)).toBe("matrix(1, 0, 0, 1, 0, 0)");
  await section.getByRole("textbox", { name: "Nombre de tu mascota" }).fill("Luna");
  await section.getByRole("button", { name: "Volver a la pregunta anterior" }).click();
  const previous = section.getByRole("heading", { name: "¿Gato o perro?" });
  await expect(previous.locator("..")).toHaveAttribute("data-direction", "backward");
  await expect(previous).toBeFocused();
  await expect(previous.locator("..")).toHaveCSS("animation-name", "none");
  await expect(section.getByRole("button", { name: "Gato", exact: true })).toHaveAttribute("aria-pressed", "true");
  await section.getByRole("button", { name: "Gato", exact: true }).click();
  await expect(question).toBeFocused();
  await expect(section.getByRole("textbox", { name: "Nombre de tu mascota" })).toHaveValue("Luna");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(page.viewportSize()!.width);
});

test("validates the name and completes a pet profile by keyboard", async ({ page }, testInfo) => {
  const section = page.locator("#experiencia-personalizada");
  await expect(section.getByRole("heading", { name: "¿Gato o perro?" })).toBeVisible();
  await expect(section.getByRole("textbox", { name: "Nombre de tu mascota" })).toHaveCount(0);
  await section.screenshot({ path: testInfo.outputPath("pet-species.png") });
  await section.getByRole("button", { name: "Gato", exact: true }).click();
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(section.getByRole("alert")).toHaveText("Escribí el nombre de tu mascota para continuar.");
  const name = section.getByRole("textbox", { name: "Nombre de tu mascota" });
  await expect(name).toBeFocused();
  await name.fill("  Luna  ");
  await name.press("Enter");
  await expect(section.getByRole("heading", { name: "¿De qué raza es Luna?" })).toBeFocused();
  const breed = section.getByRole("combobox", { name: "Raza", exact: true });
  await breed.fill("siam");
  await expect(section.getByRole("option", { name: "Siamés · Siamese", exact: true })).toBeVisible();
  await breed.press("ArrowDown");
  await breed.press("Enter");
  await expect(breed).toHaveValue("Siamés");
  await expect(section.getByRole("listbox")).toBeHidden();
  await breed.press("Enter");
  await expect(section.getByRole("heading", { name: "¡Un gusto, Luna!" })).toBeFocused();
  await expect(section.locator("dd")).toHaveText(["Luna", "Gato", "Siamés"]);
  await section.screenshot({ path: testInfo.outputPath("pet-review.png") });
  await section.getByRole("button", { name: "Editar respuestas" }).click();
  await section.getByRole("button", { name: "Gato", exact: true }).click();
  await expect(name).toHaveValue("Luna");
  await section.screenshot({ path: testInfo.outputPath("pet-name.png") });
});

test("changing species clears the breed and preserves the pet name", async ({ page }, testInfo) => {
  const section = page.locator("#experiencia-personalizada");
  await section.getByRole("button", { name: "Perro", exact: true }).click();
  await section.getByRole("textbox", { name: "Nombre de tu mascota" }).fill("Toby");
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  const breed = section.getByRole("combobox", { name: "Raza", exact: true });
  await breed.fill("poodle");
  await expect(section.getByRole("option", { name: "Caniche · Poodle", exact: true })).toBeVisible();
  await expect(section.getByRole("option", { name: "Usar «poodle»", exact: true })).toHaveCount(0);
  await breed.fill("great");
  await expect(section.getByRole("option", { name: "Gran danés · Great Dane", exact: true })).toBeVisible();
  await expect(section.getByRole("listbox")).not.toContainText("Dogo alemán");
  await breed.fill("poodle");
  await section.getByRole("option", { name: "Caniche · Poodle", exact: true }).click();
  await expect(breed).toHaveValue("Caniche");
  await section.getByRole("button", { name: "Volver a la pregunta anterior" }).click();
  await expect(section.getByRole("textbox", { name: "Nombre de tu mascota" })).toHaveValue("Toby");
  await section.getByRole("button", { name: "Volver a la pregunta anterior" }).click();
  await expect(section.getByRole("button", { name: "Perro", exact: true })).toHaveAttribute("aria-pressed", "true");
  await section.getByRole("button", { name: "Gato", exact: true }).click();
  await expect(section.getByRole("textbox", { name: "Nombre de tu mascota" })).toHaveValue("Toby");
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(breed).toHaveValue("");
  await breed.fill("caniche");
  await expect(section.getByRole("option", { name: "Caniche", exact: true })).toHaveCount(0);
  await breed.fill("");
  await section.screenshot({ path: testInfo.outputPath("pet-breeds.png") });
  await section.getByRole("option", { name: "No lo sé", exact: true }).click();
  await section.getByRole("button", { name: "Ver perfil" }).click();
  await expect(section.locator("dd")).toHaveText(["Toby", "Gato", "No lo sé"]);
});

test("supports custom breeds, escape, and narrow screens with reduced motion", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 700 });
  const section = page.locator("#experiencia-personalizada");
  await section.getByRole("button", { name: "Perro", exact: true }).click();
  await section.getByRole("textbox", { name: "Nombre de tu mascota" }).fill("Sol");
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  const breed = section.getByRole("combobox", { name: "Raza", exact: true });
  await breed.fill("Cruce de collie");
  await breed.press("Escape");
  await expect(breed).toHaveAttribute("aria-expanded", "false");
  await section.getByRole("button", { name: "Ver perfil" }).click();
  await expect(section.getByRole("alert")).toBeVisible();
  await breed.press("ArrowDown");
  await breed.press("Enter");
  await expect(breed).toHaveValue("Cruce de collie");
  await section.getByRole("button", { name: "Ver perfil" }).click();
  await expect(section.locator("dd")).toHaveText(["Sol", "Perro", "Cruce de collie"]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await expect(section.getByRole("heading", { name: "¡Un gusto, Sol!" }).locator("..")).toHaveCSS("animation-name", "none");
  const dogImage = section.getByRole("article", { name: "Ficha de Sol" }).locator('img[data-species="dog"]');
  await expect(dogImage).toHaveCSS("animation-name", "none");
  await expect(dogImage).toHaveCSS("opacity", "1");
  await section.screenshot({ path: testInfo.outputPath("pet-narrow.png") });
});

for (const pet of [
  { species: "dog", choice: "Perro", name: "Juve", breed: "Akita" },
  { species: "cat", choice: "Gato", name: "Luna", breed: "Persa" },
] as const) {
test(`the ${pet.species} artwork loads in the selector and reveals in the profile`, async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const section = page.locator("#experiencia-personalizada");
  const choiceImage = section.getByRole("button", { name: pet.choice, exact: true }).locator("img");
  await expect(choiceImage).toHaveAttribute("src", `/images/pets/${pet.species}.svg`);
  await expect(choiceImage).toHaveAttribute("alt", "");
  await expect(choiceImage).toHaveAttribute("data-animated", "false");
  await expect.poll(() => choiceImage.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await section.getByRole("button", { name: pet.choice, exact: true }).click();
  await expect(section.getByRole("heading", { name: "¿Cómo se llama tu mascota?" })).toBeFocused();
  await section.getByRole("textbox", { name: "Nombre de tu mascota" }).fill(pet.name);
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(section.getByRole("heading", { name: `¿De qué raza es ${pet.name}?` })).toBeFocused();
  await section.getByRole("combobox", { name: "Raza", exact: true }).fill(pet.breed);
  await section.getByRole("option", { name: pet.breed, exact: true }).click();
  await section.getByRole("button", { name: "Ver perfil" }).click();
  await expect(section.getByRole("heading", { name: `¡Un gusto, ${pet.name}!` })).toBeFocused();
  const profile = section.getByRole("article", { name: `Ficha de ${pet.name}` });
  const image = profile.locator("img");
  await expect(profile).toHaveAttribute("data-revealed", "true");
  await expect(image).toHaveAttribute("src", `/images/pets/${pet.species}-small.svg`);
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  await expect(image).toHaveCSS("animation-name", /reveal-species/);
  const opacity = await image.evaluate((element) => {
    const animation = element.getAnimations()[0];
    animation.pause();
    animation.currentTime = 160;
    const during = parseFloat(getComputedStyle(element).opacity);
    animation.finish();
    return { during, after: parseFloat(getComputedStyle(element).opacity) };
  });
  expect(opacity.during).toBeGreaterThan(0);
  expect(opacity.during).toBeLessThan(1);
  expect(opacity.after).toBe(1);
  await expect(profile.locator("dd").last()).toHaveCSS("opacity", "1");
  await profile.screenshot({ path: testInfo.outputPath(`${pet.species}-profile.png`) });
});
}

test("the unfiltered breed list includes entries beyond the first eight", async ({ page }) => {
  const section = page.locator("#experiencia-personalizada");
  await section.getByRole("button", { name: "Perro", exact: true }).click();
  await section.getByRole("textbox", { name: "Nombre de tu mascota" }).fill("Juve");
  await section.getByRole("button", { name: "Continuar", exact: true }).click();
  const breed = section.getByRole("combobox", { name: "Raza", exact: true });
  await breed.focus();
  const options = section.getByRole("option");
  expect(await options.count()).toBeGreaterThan(8);
  const lastBreed = section.getByRole("option", { name: "Yorkshire Terrier", exact: true });
  await lastBreed.scrollIntoViewIfNeeded();
  await expect(lastBreed).toBeInViewport();
  await lastBreed.click();
  await expect(breed).toHaveValue("Yorkshire Terrier");
  await section.getByRole("button", { name: "Ver perfil" }).click();
  await expect(section.locator("dd")).toHaveText(["Juve", "Perro", "Yorkshire Terrier"]);
});
