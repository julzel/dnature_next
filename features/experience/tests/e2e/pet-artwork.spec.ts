import { expect, test } from "@playwright/test";
import { PET_STORAGE_KEY } from "../../data/pet-storage";

const profiles = [
  { id: "collie", name: "Rex", species: "dog", breed: "Border Collie", artwork: "border-collie" },
  { id: "poodle", name: "Toby", species: "dog", breed: "Poodle", artwork: "poodle" },
  { id: "cattle", name: "Blue", species: "dog", breed: "Cattle Dog", artwork: "cattle-dog" },
  { id: "pitbull", name: "Rocky", species: "dog", breed: "Pitbull", artwork: "pitbull" },
  { id: "unknown-dog", name: "Sol", species: "dog", breed: "Akita", artwork: "mixed-breed-dog" },
  { id: "custom-dog", name: "Max", species: "dog", breed: "Cruce de collie", artwork: "mixed-breed-dog" },
  { id: "unknown-cat", name: "Luna", species: "cat", breed: "Siamés", artwork: "mixed-breed-cat" },
];

test("saved profiles load matching breed engravings and species fallbacks", async ({ page }, testInfo) => {
  await page.addInitScript(({ key, pets }) => {
    localStorage.setItem(key, JSON.stringify({ version: 1, pets }));
  }, { key: PET_STORAGE_KEY, pets: profiles.map(({ id, name, species, breed }) => ({ id, name, species, breed })) });
  await page.goto("/mis-mascotas", { waitUntil: "commit" });
  for (const pet of profiles) {
    const profile = page.getByRole("article", { name: `Ficha de ${pet.name}`, exact: true });
    await expect(profile.locator("dd").last()).toHaveText(pet.breed);
    const image = profile.locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("src", `/images/pets/${pet.artwork}.svg`);
    await expect(image).toHaveAttribute("alt", "");
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  await page.getByRole("article", { name: "Ficha de Rex", exact: true }).screenshot({ path: testInfo.outputPath("breed-portrait.png") });
  await page.getByRole("article", { name: "Ficha de Luna", exact: true }).screenshot({ path: testInfo.outputPath("fallback-cat.png") });
  await page.reload({ waitUntil: "commit" });
  await expect(page.getByRole("article", { name: "Ficha de Toby", exact: true }).locator("img")).toHaveAttribute("src", "/images/pets/poodle.svg");
  await page.setViewportSize({ width: 320, height: 700 });
  await expect(page.getByRole("article")).toHaveCount(profiles.length);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});
