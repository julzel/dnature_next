import { catalogValue, normalize, type Product } from "@/features/feeding/engine/sandbox/catalog";

export type BreedOption = { value: string; label: string };
const aliases: Record<string, string> = {
  "french poodle o canishes": "caniche", "french poodle": "caniche", poodle: "caniche", caniches: "caniche",
  "caniche (french poodle)": "caniche", dobemann: "doberman", dobermann: "doberman", pinscher: "pincher",
  pekingese: "pequines", "bulldog frances": "bulldog frances", "bulldog ingles": "bulldog ingles",
};
const labels: Record<string, string> = {
  caniche: "Caniche (French Poodle)", "pastor aleman": "Pastor Alemán", "bull terrier": "Bull Terrier",
  dachshund: "Dachshund (Salchicha)",
};
export function breedKey(value: string) {
  const key = normalize(value).replace(/\s+/g, " ");
  return aliases[key] ?? key;
}
export function breedLabel(value: string, options: BreedOption[] = []) {
  if (!value || value === "unknown") return "No sé su raza";
  if (value === "mixed") return "Mestizo / sin raza definida";
  return options.find(option => option.value === breedKey(value))?.label ?? labels[breedKey(value)] ?? value;
}
function namedBreeds(product: Pick<Product, "raw">) {
  return catalogValue(product,7).replace(/\s+y razas\b.*$/i, "").split(/,|\s+y\s+/i)
    .map(label => label.trim()).filter(label => label && !/^(todas las razas|n\/?a|no aplica)$/i.test(label));
}
// The current workbook names canine breeds, including on Perro/Gato rows. It has no named feline breeds.
export function catalogBreedOptions(products: Product[]): BreedOption[] {
  const options = new Map<string, BreedOption>();
  for (const product of products.filter(product => product.editorial === "description" && product.species.includes("perro"))) {
    for (const label of namedBreeds(product)) {
      const value = breedKey(label);
      options.set(value, { value, label: labels[value] ?? options.get(value)?.label ?? label });
    }
  }
  return [...options.values()].toSorted((a, b) => a.label.localeCompare(b.label, "es"));
}
type BreedProfile = { species: "dog" | "cat"; breed?: string };
export const brachycephalicBreeds=["pug", "bulldog", "bulldog frances", "bulldog ingles", "boxer", "shih tzu", "pequines", "boston terrier"] as const;
function knownDogBreed(profile: BreedProfile) {
  const key = breedKey(profile.breed ?? "");
  return profile.species === "dog" && key && !["unknown", "mixed", "other"].includes(key) ? key : null;
}
function matchesBreed(named: string, selected: string) {
  return named === selected || (named === "bulldog" && ["bulldog frances", "bulldog ingles"].includes(selected));
}
export function breedAffinity(product: Pick<Product, "raw">, profile: BreedProfile) {
  const selected = knownDogBreed(profile);
  return Boolean(selected && namedBreeds(product).some(name => matchesBreed(breedKey(name), selected)));
}
export function breedRestriction(product: Pick<Product, "raw">, profile: BreedProfile) {
  const selected = knownDogBreed(profile);
  if (!selected) return false;
  const contraindications = normalize(catalogValue(product,12));
  if (/braquicefal/.test(contraindications) && brachycephalicBreeds.some(breed=>breed === selected)) return true;
  const terms = [selected, ...Object.keys(aliases).filter(alias => aliases[alias] === selected)];
  if (["bulldog frances", "bulldog ingles"].includes(selected)) terms.push("bulldog");
  return terms.some(term => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(contraindications));
}
