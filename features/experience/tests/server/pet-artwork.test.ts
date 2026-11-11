import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { getBreedArtwork, getBreeds } from "../../data/pet-breeds";

test("every illustrated breed and alias resolves to an existing native SVG", () => {
  const illustrated = getBreeds("dog").filter((breed) => breed.artwork);
  assert.equal(illustrated.length, 21);
  for (const breed of illustrated) {
    const expected = `/images/pets/${breed.artwork}.svg`;
    for (const name of [breed.label, ...(breed.aliases ?? [])]) {
      assert.equal(getBreedArtwork("dog", `  ${name.toUpperCase()}  `), expected, name);
    }
    const path = join(process.cwd(), "public", expected);
    assert.ok(existsSync(path), expected);
    const svg = readFileSync(path, "utf8");
    assert.match(svg, /<path\s/);
    assert.doesNotMatch(svg, /<image\s|<script\s/);
  }
});

test("Spanish, English and accented saved names select the matching drawing", () => {
  for (const [name, file] of [
    ["Dalmata", "dalmatian"], ["Pastor alemán", "german-shepherd"],
    ["Poodle", "poodle"], ["Bulldog inglés", "english-bulldog"],
    ["French Bulldog", "french-bulldog"], ["Cattle Dog", "cattle-dog"],
    ["Pitbull", "pitbull"], ["Golden Retriever", "dog"],
  ]) assert.equal(getBreedArtwork("dog", name), `/images/pets/${file}.svg`);
});

test("missing, unknown and custom breeds use the correct species fallback", () => {
  for (const species of ["cat", "dog"] as const) {
    const expected = `/images/pets/mixed-breed-${species}.svg`;
    assert.ok(existsSync(join(process.cwd(), "public", expected)));
    for (const name of ["", "Mestizo / sin raza definida", "No lo sé", "Cruce de collie", "Cruce de Poodle", "Raza personalizada"]) {
      assert.equal(getBreedArtwork(species, name), expected);
    }
    for (const breed of getBreeds(species).filter((entry) => !entry.artwork)) {
      assert.equal(getBreedArtwork(species, breed.label), expected);
    }
  }
  assert.equal(getBreedArtwork("cat", "Caniche"), "/images/pets/mixed-breed-cat.svg");
  assert.equal(getBreedArtwork("dog", "Siamés"), "/images/pets/mixed-breed-dog.svg");
});
