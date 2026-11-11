export type PetSpecies = "cat" | "dog";

type Breed = { label: string; aliases?: string[]; artwork?: string };

// A local starter catalogue, not a complete registry. Users can select a custom
// breed, mixed breed or unknown. Names checked against FCI/CFA breed listings:
// https://www.fci.be/es/nomenclature/varietes.aspx
// https://cfa.org/breeds/
const dogBreeds: Breed[] = [
  { label: "Akita" }, { label: "Alaskan Malamute" }, { label: "Basenji" },
  { label: "Basset Hound" }, { label: "Beagle", artwork: "beagle" }, { label: "Bichón frisé" },
  { label: "Border Collie", artwork: "border-collie" }, { label: "Boston Terrier", artwork: "boston-terrier" },
  { label: "Boyero australiano", aliases: ["Australian Cattle Dog", "Cattle Dog", "Blue Heeler"], artwork: "cattle-dog" },
  { label: "Bóxer", aliases: ["Boxer"] },
  { label: "Bull Terrier", artwork: "bull-terrier" },
  { label: "Bulldog", aliases: ["Bulldog inglés", "English Bulldog"], artwork: "english-bulldog" },
  { label: "Bulldog francés", aliases: ["French Bulldog"], artwork: "french-bulldog" },
  { label: "Caniche", aliases: ["Poodle"], artwork: "poodle" }, { label: "Cavalier King Charles Spaniel" },
  { label: "Chihuahua", aliases: ["Chihuahueño"], artwork: "chihuahua" }, { label: "Chow Chow" },
  { label: "Cocker Spaniel inglés" }, { label: "Collie" },
  { label: "Dálmata", aliases: ["Dalmatian"], artwork: "dalmatian" },
  { label: "Dóberman", aliases: ["Dobermann", "Doberman", "Doberman Pinscher"], artwork: "doberman" },
  { label: "Golden Retriever", artwork: "dog" }, { label: "Gran danés", aliases: ["Great Dane", "Dogo alemán"] },
  { label: "Husky siberiano" }, { label: "Jack Russell Terrier" },
  { label: "Labrador Retriever", aliases: ["Labrador"], artwork: "labrador-retriever" }, { label: "Maltés" },
  { label: "Pastor alemán", aliases: ["German Shepherd"], artwork: "german-shepherd" },
  { label: "Pastor australiano" }, { label: "Pastor belga Malinois" },
  { label: "Pit Bull", aliases: ["Pitbull", "American Pit Bull Terrier"], artwork: "pitbull" },
  { label: "Pomerania", aliases: ["Pomeranian", "Spitz"], artwork: "pomeranian" },
  { label: "Pug", aliases: ["Carlino"], artwork: "pug" },
  { label: "Rottweiler" }, { label: "Samoyedo", aliases: ["Samoyed"], artwork: "samoyed" }, { label: "San Bernardo" },
  { label: "Schnauzer", aliases: ["Standard Schnauzer", "Schnauzer miniatura", "Miniature Schnauzer", "Schnauzer gigante", "Giant Schnauzer"], artwork: "schnauzer" },
  { label: "Shar Pei" }, { label: "Shiba Inu" },
  { label: "Shih Tzu" }, { label: "Staffordshire Bull Terrier" },
  { label: "Teckel", aliases: ["Dachshund", "Salchicha", "Tekel"], artwork: "dachshund" },
  { label: "Weimaraner", artwork: "weimaraner" },
  { label: "Welsh Corgi Pembroke" }, { label: "West Highland White Terrier", aliases: ["Westie"] },
  { label: "Yorkshire Terrier", aliases: ["Yorkie"] },
];

const catBreeds: Breed[] = [
  { label: "Abisinio", aliases: ["Abyssinian"] }, { label: "American Shorthair" },
  { label: "Azul ruso", aliases: ["Russian Blue"] }, { label: "Balinés", aliases: ["Balinese"] },
  { label: "Bengalí", aliases: ["Bengal"] }, { label: "Bobtail americano" },
  { label: "Bobtail japonés" }, { label: "Bombay" },
  { label: "Bosque de Noruega", aliases: ["Norwegian Forest"] }, { label: "British Shorthair" },
  { label: "Burmés", aliases: ["Burmese"] }, { label: "Cornish Rex" }, { label: "Devon Rex" },
  { label: "Exótico", aliases: ["Exotic Shorthair"] }, { label: "Maine Coon" },
  { label: "Manx" }, { label: "Oriental" }, { label: "Persa", aliases: ["Persian"] },
  { label: "Ragdoll" }, { label: "Sagrado de Birmania", aliases: ["Birman"] },
  { label: "Scottish Fold" }, { label: "Siamés", aliases: ["Siamese"] },
  { label: "Siberiano", aliases: ["Siberian"] }, { label: "Somalí", aliases: ["Somali"] },
  { label: "Sphynx", aliases: ["Esfinge"] }, { label: "Tonquinés", aliases: ["Tonkinese"] },
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

/** Match whole breed names and aliases; custom crosses keep the mixed-breed art. */
export function getBreedArtwork(species: PetSpecies, value: string): string {
  const name = normalizeBreed(value);
  const breed = getBreeds(species).find((entry) =>
    [entry.label, ...(entry.aliases ?? [])].some((label) => normalizeBreed(label) === name),
  );
  return `/images/pets/${breed?.artwork ?? `mixed-breed-${species}`}.svg`;
}
