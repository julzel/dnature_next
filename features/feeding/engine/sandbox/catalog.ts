import { correctedDescription, type CatalogCorrection } from "./catalog-corrections";

export const categories = [
  { id: "all", label: "Todos los bocados", short: "Todos", icon: "spark", description: "Un poco de todo" },
  { id: "chew", label: "Masticables", short: "Masticables", icon: "bone", description: "Texturas por descubrir" },
  { id: "base", label: "Base alimenticia", short: "Alimentos", icon: "bowl", description: "La hora del plato" },
  { id: "supplement", label: "Suplementos", short: "Suplementos", icon: "leaf", description: "Pequeños complementos" },
  { id: "organ", label: "Órganos", short: "Órganos", icon: "heart", description: "Variedad de origen animal" },
] as const;

export type Category = typeof categories[number]["id"];
export type Editorial = "description" | "removal" | "pending";
export type QualityFilter = "all" | "missing-price" | "range-price" | "editorial" | "duplicate" | "review" | "missing-flags";
export type SourceRecord = { row: number; values: string[] };
export type Product = {
  id: string; row: number; name: string; category: Exclude<Category, "all">;
  presentation: string; price: number | null; priceRaw: string;
  species: string[]; stages: string[]; sizes: string[];
  goal: string; frequency: string; chewing: string; supervision: string;
  allergy: string; risk: string; priority: string; note: string; description: string;
  editorial: Editorial; duplicate: boolean; review: string | null; raw: string[];
  complementType: string;
  descriptionCorrection?: CatalogCorrection;
};
export type CatalogFilters = {
  search: string; category: Category; species: string; stage: string; size: string;
  quality: QualityFilter; risk: string; sort: "source" | "name" | "price-asc" | "price-desc";
};
export const initialFilters: CatalogFilters = {
  search: "", category: "all", species: "all", stage: "all", size: "all", quality: "all", risk: "all", sort: "source",
};

export function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Legacy field positions remain explicit while raw cells retain the workbook's physical order.
export function catalogValue(product: Pick<Product,"raw">, legacyIndex: number) {
  return product.raw[legacyIndex + (product.raw.length === 25 && legacyIndex >= 2 ? 1 : 0)] ?? "";
}

const categoryMap: Record<string, Product["category"]> = {
  "base alimenticia": "base", "complemento masticable": "chew", "suplemento funcional": "supplement", organo: "organ",
};
// Observations on the supplied source, not corrections or product instructions.
const reviewNotes: Record<number, string> = {
  142: "El nombre y el campo de alergias dicen caballo, pero la descripción habla de tráquea de res. Revisar con la fuente.",
};

export function prepareProducts(records: SourceRecord[]): Product[] {
  const counts = new Map<string, number>();
  records.forEach(({ values }) => counts.set(normalize(values[0]), (counts.get(normalize(values[0])) ?? 0) + 1));
  return records.map(({ row, values }) => {
    if (![24,25].includes(values.length)) throw new Error(`Unexpected catalog data at row ${row}`);
    const v=values.length === 25 ? [...values.slice(0,2),...values.slice(3)] : values;
    if (!v[0] || !categoryMap[normalize(v[1])]) throw new Error(`Unexpected catalog data at row ${row}`);
    const priceRaw = v[3].trim();
    const price = /^\d+(\.\d+)?$/.test(priceRaw) ? Number(priceRaw) : null;
    const description=correctedDescription(row,v[0].trim(),v[20]);
    return {
      id: `source-row-${row}`, row, name: v[0].trim(), category: categoryMap[normalize(v[1])],
      presentation: v[2], price, priceRaw,
      species: normalize(v[4]).split("/"), stages: normalize(v[5]).split("-"),
      sizes: normalize(v[6]).split(",").map((size) => size.trim().replace("pequenos", "pequeno")),
      goal: v[9], frequency: v[10], chewing: v[14], supervision: v[15], allergy: v[16],
      risk: v[17], priority: v[18], note: v[19], description: description.description,
      ...(description.correction ? {descriptionCorrection:description.correction}:{}),
      complementType:values.length === 25 ? values[2].trim():"",
      editorial: v[20].startsWith("ELIMINAR") ? "removal" : v[20].startsWith("PENDIENTE") ? "pending" : "description",
      duplicate: (counts.get(normalize(v[0])) ?? 0) > 1,
      review: description.review ?? (description.correction ? null:reviewNotes[row] ?? null),
      raw: values,
    };
  });
}

export function matchesQuality(product: Product, quality: QualityFilter) {
  switch (quality) {
    case "missing-price": return !product.priceRaw;
    case "range-price": return !!product.priceRaw && product.price === null;
    case "editorial": return product.editorial !== "description";
    case "duplicate": return product.duplicate;
    case "review": return !!product.review;
    case "missing-flags": return [21,22,23].some(index => !catalogValue(product,index));
    default: return true;
  }
}

export function filterProducts(products: Product[], filters: CatalogFilters) {
  const words = normalize(filters.search).split(/\s+/).filter(Boolean);
  return products.filter((product) => {
    const haystack = normalize(product.raw.join(" "));
    return (filters.category === "all" || product.category === filters.category)
      && (filters.species === "all" || product.species.includes(filters.species))
      && (filters.stage === "all" || product.stages.includes(filters.stage))
      && (filters.size === "all" || product.sizes.includes(filters.size))
      && (filters.risk === "all" || normalize(product.risk) === filters.risk)
      && matchesQuality(product, filters.quality)
      && words.every((word) => haystack.includes(word));
  }).sort((a, b) => {
    if (filters.sort === "name") return a.name.localeCompare(b.name, "es");
    if (filters.sort.startsWith("price")) {
      // Missing and multi-value prices stay unavailable, never zero.
      if (a.price === null && b.price === null) return a.row - b.row;
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return filters.sort === "price-asc" ? a.price - b.price : b.price - a.price;
    }
    return a.row - b.row;
  });
}

export function analyzeProducts(products: Product[]) {
  return {
    total: products.length,
    uniqueNames: new Set(products.map((product) => normalize(product.name))).size,
    categoryCounts: Object.fromEntries(categories.map(({ id }) => [id, id === "all" ? products.length : products.filter((p) => p.category === id).length])) as Record<Category, number>,
    missingPrices: products.filter((p) => !p.priceRaw).length,
    exactPrices: products.filter((p) => p.price !== null).length,
    rangePrices: products.filter((p) => p.priceRaw && p.price === null).length,
    editorial: products.filter((p) => p.editorial !== "description").length,
    removalNotes: products.filter((p) => p.editorial === "removal").length,
    pendingNotes: products.filter((p) => p.editorial === "pending").length,
    duplicateRows: products.filter((p) => p.duplicate).length,
    review: products.filter((p) => p.review).length,
    missingFlags: products.filter((p) => matchesQuality(p, "missing-flags")).length,
    dogsOnly: products.filter((p) => p.species.length === 1 && p.species.includes("perro")).length,
    catsOnly: products.filter((p) => p.species.length === 1 && p.species.includes("gato")).length,
    bothSpecies: products.filter((p) => p.species.length === 2).length,
  };
}

export function formatPrice(product: Product) {
  if (!product.priceRaw) return "Sin precio";
  if (product.price === null) return product.priceRaw;
  return new Intl.NumberFormat("es-CR", { maximumFractionDigits: 2 }).format(product.price);
}

export function makeCatalogCsv(products: Product[], headers: string[]) {
  const escape = (value: string) => {
    const safe = /^[\s]*[=+@-]/.test(value) ? `'${value}` : value;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return "\uFEFF" + [["Fila de origen", ...headers], ...products.map((p) => [String(p.row), ...p.raw])]
    .map((row) => row.map(escape).join(",")).join("\r\n");
}
