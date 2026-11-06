export type PetSpecies = "cat" | "dog";

type Breed = { label: string; aliases?: string[] };

// A local starter catalogue, not a complete registry. Users can select a custom
// breed, mixed breed or unknown. Names checked against FCI/CFA breed listings:
// https://www.fci.be/es/nomenclature/varietes.aspx
// https://cfa.org/breeds/
const dogBreeds: Breed[] = [
  { label: "Akita" }, { label: "Alaskan Malamute" }, { label: "Basenji" },
  { label: "Basset Hound" }, { label: "Beagle" }, { label: "Bichón frisé" },
  { label: "Border Collie" }, { label: "Boston Terrier" }, { label: "Bóxer", aliases: ["Boxer"] },
  { label: "Bull Terrier" }, { label: "Bulldog" }, { label: "Bulldog francés" },
  { label: "Caniche", aliases: ["Poodle"] }, { label: "Cavalier King Charles Spaniel" },
  { label: "Chihuahua", aliases: ["Chihuahueño"] }, { label: "Chow Chow" },
  { label: "Cocker Spaniel inglés" }, { label: "Collie" },
  { label: "Dálmata" }, { label: "Dóberman", aliases: ["Dobermann", "Doberman"] },
  { label: "Golden Retriever" }, { label: "Gran danés", aliases: ["Great Dane", "Dogo alemán"] },
  { label: "Husky siberiano" }, { label: "Jack Russell Terrier" },
  { label: "Labrador Retriever" }, { label: "Maltés" }, { label: "Pastor alemán" },
  { label: "Pastor australiano" }, { label: "Pastor belga Malinois" },
  { label: "Pomerania", aliases: ["Pomeranian", "Spitz"] }, { label: "Pug", aliases: ["Carlino"] },
  { label: "Rottweiler" }, { label: "Samoyedo" }, { label: "San Bernardo" },
  { label: "Schnauzer" }, { label: "Shar Pei" }, { label: "Shiba Inu" },
  { label: "Shih Tzu" }, { label: "Staffordshire Bull Terrier" },
  { label: "Teckel", aliases: ["Dachshund", "Salchicha"] }, { label: "Weimaraner" },
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
