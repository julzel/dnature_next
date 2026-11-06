export type PetSpecies = "cat" | "dog";

type Breed = { label: string; aliases?: string };

// A local starter catalogue, not a complete registry. Users can select a custom
// breed, mixed breed or unknown. Names checked against FCI/CFA breed listings:
// https://www.fci.be/es/nomenclature/varietes.aspx
// https://cfa.org/breeds/
const dogBreeds: Breed[] = [
  { label: "Akita" }, { label: "Alaskan Malamute" }, { label: "Basenji" },
  { label: "Basset Hound" }, { label: "Beagle" }, { label: "Bichón frisé" },
  { label: "Border Collie" }, { label: "Boston Terrier" }, { label: "Bóxer", aliases: "boxer" },
  { label: "Bull Terrier" }, { label: "Bulldog" }, { label: "Bulldog francés" },
  { label: "Caniche", aliases: "poodle" }, { label: "Cavalier King Charles Spaniel" },
  { label: "Chihuahua", aliases: "chihuahueño" }, { label: "Chow Chow" },
  { label: "Cocker Spaniel inglés" }, { label: "Collie" },
  { label: "Dálmata" }, { label: "Dóberman", aliases: "dobermann doberman" },
  { label: "Golden Retriever" }, { label: "Gran danés", aliases: "great dane dogo alemán" },
  { label: "Husky siberiano" }, { label: "Jack Russell Terrier" },
  { label: "Labrador Retriever" }, { label: "Maltés" }, { label: "Pastor alemán" },
  { label: "Pastor australiano" }, { label: "Pastor belga Malinois" },
  { label: "Pomerania", aliases: "pomeranian spitz" }, { label: "Pug", aliases: "carlino" },
  { label: "Rottweiler" }, { label: "Samoyedo" }, { label: "San Bernardo" },
  { label: "Schnauzer" }, { label: "Shar Pei" }, { label: "Shiba Inu" },
  { label: "Shih Tzu" }, { label: "Staffordshire Bull Terrier" },
  { label: "Teckel", aliases: "dachshund salchicha" }, { label: "Weimaraner" },
  { label: "Welsh Corgi Pembroke" }, { label: "West Highland White Terrier", aliases: "westie" },
  { label: "Yorkshire Terrier", aliases: "yorkie" },
];

const catBreeds: Breed[] = [
  { label: "Abisinio", aliases: "abyssinian" }, { label: "American Shorthair" },
  { label: "Azul ruso", aliases: "russian blue" }, { label: "Balinés", aliases: "balinese" },
  { label: "Bengalí", aliases: "bengal" }, { label: "Bobtail americano" },
  { label: "Bobtail japonés" }, { label: "Bombay" },
  { label: "Bosque de Noruega", aliases: "norwegian forest" }, { label: "British Shorthair" },
  { label: "Burmés", aliases: "burmese" }, { label: "Cornish Rex" }, { label: "Devon Rex" },
  { label: "Exótico", aliases: "exotic shorthair" }, { label: "Maine Coon" },
  { label: "Manx" }, { label: "Oriental" }, { label: "Persa", aliases: "persian" },
  { label: "Ragdoll" }, { label: "Sagrado de Birmania", aliases: "birman" },
  { label: "Scottish Fold" }, { label: "Siamés", aliases: "siamese" },
  { label: "Siberiano", aliases: "siberian" }, { label: "Somalí", aliases: "somali" },
  { label: "Sphynx", aliases: "esfinge" }, { label: "Tonquinés", aliases: "tonkinese" },
];

export function normalizeBreed(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
}

export function getBreeds(species: PetSpecies): Breed[] {
  return [
    { label: "Mestizo / sin raza definida", aliases: "criollo mixto mezcla domestico comun" },
    { label: "No lo sé", aliases: "desconocida no se" },
    ...(species === "cat" ? catBreeds : dogBreeds).toSorted((a, b) => a.label.localeCompare(b.label, "es")),
  ];
}
