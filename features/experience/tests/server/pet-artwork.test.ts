import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { getBreedArtwork, getBreeds, getBreedSize } from "../../data/pet-breeds";

test("every illustrated breed and alias resolves to an existing native SVG", () => {
  const illustrated = getBreeds("dog").filter((breed) => breed.artwork);
  assert.equal(illustrated.length, 23);
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
    ["Yorkshire Terrier", "yorkshire-terrier"], ["Yorkie", "yorkshire-terrier"],
    ["Cocker Spaniel inglés", "cocker-spaniel"], ["English Cocker Spaniel", "cocker-spaniel"],
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

test("display sizes distinguish the five categories and resolve breed aliases", () => {
  const examples = [
    ["Yorkshire Terrier", "mini"], ["Yorkie", "mini"],
    ["French Bulldog", "small"], ["Border Collie", "medium"],
    ["Pastor alemán", "large"], ["Great Dane", "extra-large"],
  ] as const;
  for (const [breed, size] of examples) {
    assert.equal(getBreedSize("dog", `  ${breed.toUpperCase()}  `), size);
  }
});

test("named size varieties retain their scale and existing breed drawing", () => {
  for (const [breed, size, artwork] of [
    ["Miniature Schnauzer", "small", "schnauzer"],
    ["Standard Schnauzer", "medium", "schnauzer"],
    ["Schnauzer gigante", "large", "schnauzer"],
    ["Toy Poodle", "mini", "poodle"],
    ["Caniche miniatura", "small", "poodle"],
    ["Caniche estándar", "large", "poodle"],
  ]) {
    assert.equal(getBreedSize("dog", breed), size, breed);
    assert.equal(getBreedArtwork("dog", breed), `/images/pets/${artwork}.svg`);
  }
  assert.equal(getBreedSize("dog", "Poodle"), null, "An unspecified variety is not an individual size measurement");
});

test("unknown sizes remain unknown and lookups stay specific to the species", () => {
  for (const species of ["cat", "dog"] as const) {
    for (const breed of ["", "No lo sé", "Mestizo / sin raza definida", "Criollo", "Cruce de Poodle", "Raza personalizada"]) {
      assert.equal(getBreedSize(species, breed), null, `${species}: ${breed}`);
    }
  }
  assert.equal(getBreedSize("cat", "Yorkshire Terrier"), null);
  assert.equal(getBreedSize("dog", "Maine Coon"), null);
  assert.equal(getBreedSize("cat", "Siamés"), "small");
  assert.equal(getBreedSize("cat", "Maine Coon"), "medium");
});

test("each known breed has a size or an explicit set of size varieties", () => {
  for (const species of ["cat", "dog"] as const) {
    for (const breed of getBreeds(species).slice(2)) {
      assert.ok(breed.size || breed.sizeVariants, breed.label);
      for (const aliases of Object.values(breed.sizeVariants ?? {})) {
        for (const alias of aliases) assert.ok(breed.aliases?.includes(alias), `${alias} must resolve to its breed`);
      }
    }
  }
});
