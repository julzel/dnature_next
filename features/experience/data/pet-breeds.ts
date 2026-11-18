export type PetSpecies = "cat" | "dog";

export type BreedSize = "mini" | "small" | "medium" | "large" | "extra-large";

type Breed = {
  label: string;
  aliases?: string[];
  artwork?: string;
  /** Approximate adult silhouette category for illustrations only. */
  size?: BreedSize;
  sizeVariants?: Partial<Record<BreedSize, string[]>>;
};

// A local starter catalogue, not a complete registry. Users can select a custom
// breed, mixed breed or unknown. Names checked against FCI/CFA breed listings:
// https://www.fci.be/es/nomenclature/varietes.aspx
// https://cfa.org/breeds/
const dogBreeds: Breed[] = [
  { label: "Akita", size: "large" }, { label: "Alaskan Malamute", size: "large" }, { label: "Basenji", size: "medium" },
  { label: "Basset Hound", size: "medium" }, { label: "Beagle", size: "small", artwork: "beagle" }, { label: "Bichón frisé", size: "small" },
  { label: "Border Collie", size: "medium", artwork: "border-collie" }, { label: "Boston Terrier", size: "small", artwork: "boston-terrier" },
  { label: "Boyero australiano", size: "medium", aliases: ["Australian Cattle Dog", "Cattle Dog", "Blue Heeler"], artwork: "cattle-dog" },
  { label: "Bóxer", size: "large", aliases: ["Boxer"] },
  { label: "Bull Terrier", size: "medium", artwork: "bull-terrier" },
  { label: "Bulldog", size: "medium", aliases: ["Bulldog inglés", "English Bulldog"], artwork: "english-bulldog" },
  { label: "Bulldog francés", size: "small", aliases: ["French Bulldog"], artwork: "french-bulldog" },
  { label: "Caniche", aliases: ["Poodle", "Caniche toy", "Toy Poodle", "Caniche miniatura", "Miniature Poodle", "Caniche estándar", "Standard Poodle"], artwork: "poodle",
    sizeVariants: { mini: ["Caniche toy", "Toy Poodle"], small: ["Caniche miniatura", "Miniature Poodle"], large: ["Caniche estándar", "Standard Poodle"] } }, { label: "Cavalier King Charles Spaniel", size: "small" },
  { label: "Chihuahua", size: "mini", aliases: ["Chihuahueño"], artwork: "chihuahua" }, { label: "Chow Chow", size: "medium" },
  { label: "Cocker Spaniel inglés", size: "medium", aliases: ["Cocker Spaniel", "English Cocker Spaniel"], artwork: "cocker-spaniel" }, { label: "Collie", size: "large" },
  { label: "Dálmata", size: "large", aliases: ["Dalmatian"], artwork: "dalmatian" },
  { label: "Dóberman", size: "large", aliases: ["Dobermann", "Doberman", "Doberman Pinscher"], artwork: "doberman" },
  { label: "Golden Retriever", size: "large", artwork: "dog" }, { label: "Gran danés", size: "extra-large", aliases: ["Great Dane", "Dogo alemán"] },
  { label: "Husky siberiano", size: "large" }, { label: "Jack Russell Terrier", size: "small" },
  { label: "Labrador Retriever", size: "large", aliases: ["Labrador"], artwork: "labrador-retriever" }, { label: "Maltés", size: "mini" },
  { label: "Pastor alemán", size: "large", aliases: ["German Shepherd"], artwork: "german-shepherd" },
  { label: "Pastor australiano", size: "large" }, { label: "Pastor belga Malinois", size: "large" },
  { label: "Pit Bull", size: "medium", aliases: ["Pitbull", "American Pit Bull Terrier"], artwork: "pitbull" },
  { label: "Pomerania", size: "mini", aliases: ["Pomeranian", "Spitz"], artwork: "pomeranian" },
  { label: "Pug", size: "small", aliases: ["Carlino"], artwork: "pug" },
  { label: "Rottweiler", size: "large" }, { label: "Samoyedo", size: "large", aliases: ["Samoyed"], artwork: "samoyed" }, { label: "San Bernardo", size: "extra-large" },
  { label: "Schnauzer", size: "medium", aliases: ["Standard Schnauzer", "Schnauzer miniatura", "Miniature Schnauzer", "Schnauzer gigante", "Giant Schnauzer"], artwork: "schnauzer",
    sizeVariants: { small: ["Schnauzer miniatura", "Miniature Schnauzer"], large: ["Schnauzer gigante", "Giant Schnauzer"] } },
  { label: "Shar Pei", size: "medium" }, { label: "Shiba Inu", size: "medium" },
  { label: "Shih Tzu", size: "small" }, { label: "Staffordshire Bull Terrier", size: "medium" },
  { label: "Teckel", size: "small", aliases: ["Dachshund", "Salchicha", "Tekel"], artwork: "dachshund" },
  { label: "Weimaraner", size: "large", artwork: "weimaraner" },
  { label: "Welsh Corgi Pembroke", size: "small" }, { label: "West Highland White Terrier", size: "small", aliases: ["Westie"] },
  { label: "Yorkshire Terrier", size: "mini", aliases: ["Yorkie"], artwork: "yorkshire-terrier" },
];

const catBreeds: Breed[] = [
  { label: "Abisinio", size: "small", aliases: ["Abyssinian"] }, { label: "American Shorthair", size: "small" },
  { label: "Azul ruso", size: "small", aliases: ["Russian Blue"] }, { label: "Balinés", size: "small", aliases: ["Balinese"] },
  { label: "Bengalí", size: "small", aliases: ["Bengal"] }, { label: "Bobtail americano", size: "small" },
  { label: "Bobtail japonés", size: "small" }, { label: "Bombay", size: "small" },
  { label: "Bosque de Noruega", size: "medium", aliases: ["Norwegian Forest"] }, { label: "British Shorthair", size: "small" },
  { label: "Burmés", size: "small", aliases: ["Burmese"] }, { label: "Cornish Rex", size: "small" }, { label: "Devon Rex", size: "small" },
  { label: "Exótico", size: "small", aliases: ["Exotic Shorthair"] }, { label: "Maine Coon", size: "medium" },
  { label: "Manx", size: "small" }, { label: "Oriental", size: "small" }, { label: "Persa", size: "small", aliases: ["Persian"] },
  { label: "Ragdoll", size: "medium" }, { label: "Sagrado de Birmania", size: "small", aliases: ["Birman"] },
  { label: "Scottish Fold", size: "small" }, { label: "Siamés", size: "small", aliases: ["Siamese"] },
  { label: "Siberiano", size: "medium", aliases: ["Siberian"] }, { label: "Somalí", size: "small", aliases: ["Somali"] },
  { label: "Sphynx", size: "small", aliases: ["Esfinge"] }, { label: "Tonquinés", size: "small", aliases: ["Tonkinese"] },
];

export function normalizeBreed(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
}

export function getBreeds(species: PetSpecies): Breed[] {
  return [
    { label: "Mestizo / sin raza definida", aliases: ["Criollo", "Mixto", "Mezcla", "Doméstico", "Común"] },
    { label: "No lo sé", aliases: ["Desconocida", "No sé"] },
    ...(species === "cat" ? catBreeds : dogBreeds).toSorted((a, b) => a.label.localeCompare(b.label, "es")),
  ];
}

function findBreed(species: PetSpecies, value: string): Breed | undefined {
  const name = normalizeBreed(value);
  return getBreeds(species).find((entry) =>
    [entry.label, ...(entry.aliases ?? [])].some((label) => normalizeBreed(label) === name),
  );
}

/** Match whole breed names and aliases; custom crosses keep the mixed-breed art. */
export function getBreedArtwork(species: PetSpecies, value: string): string {
  const breed = findBreed(species, value);
  return `/images/pets/${breed?.artwork ?? `mixed-breed-${species}`}.svg`;
}

/** Display metadata only; never used to infer weight, portions or product eligibility. */
export function getBreedSize(species: PetSpecies, value: string): BreedSize | null {
  const breed = findBreed(species, value);
  if (!breed) return null;
  const name = normalizeBreed(value);
  for (const [size, aliases] of Object.entries(breed.sizeVariants ?? {})) {
    if (aliases.some((alias) => normalizeBreed(alias) === name)) return size as BreedSize;
  }
  return breed.size ?? null;
}
