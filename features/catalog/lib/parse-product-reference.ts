import type { CatalogReferenceRow, ProductReference } from "../types/product-reference";

const statuses = new Set(["Descripción comercial", "Excluir", "Continuidad pendiente"]);
const kinds: Record<string, string> = {
  "Base alimenticia": "Base alimenticia",
  "complemento masticable": "Complemento masticable",
  "Suplemento funcional": "Suplemento funcional",
  Organo: "Órgano",
};

function meaningful(value: string): string | null {
  return /^(sin dato|n\/a)$/i.test(value) ? null : value;
}

/** Import only descriptive fields. Doses, benefits, breed claims and private comments stay in the source. */
export function parseProductReference(markdown: string): CatalogReferenceRow[] {
  markdown = markdown.replace(/\r\n/g, "\n");
  const rows: CatalogReferenceRow[] = [];
  const seen = new Set<number>();
  for (const match of markdown.matchAll(/^## Fila (\d+)\r?\n([\s\S]*?)(?=^## Fila |$(?![\s\S]))/gm)) {
    const row = Number(match[1]);
    const heading = match[2].match(/^\*\*(.+?)\*\* · (.+?)\.$/m);
    if (seen.has(row) || !heading || !statuses.has(heading[2])) throw new Error(`Invalid catalog source row ${row}.`);
    seen.add(row);
    const fields = new Map<string, string>();
    for (const field of match[2].matchAll(/^- \*\*(.+?):\*\* (.+)$/gm)) {
      if (fields.has(field[1])) throw new Error(`Duplicate field in catalog source row ${row}.`);
      fields.set(field[1], field[2].trim());
    }
    function field(name: string) {
      const value = fields.get(name);
      if (!value) throw new Error(`Missing ${name} in catalog source row ${row}.`);
      return value;
    }
    function validate(values: string[], allowed: string[], name: string) {
      if (values.some((value) => !allowed.includes(value))) throw new Error(`Unknown ${name} in catalog source row ${row}.`);
      return values;
    }
    const kind = kinds[field("Tipo")];
    if (!kind) throw new Error(`Unknown product type in catalog source row ${row}.`);
    const species = field("Especie").toLowerCase().split("/").map((value): "dog" | "cat" => {
      if (value === "perro") return "dog";
      if (value === "gato") return "cat";
      throw new Error(`Unknown species in catalog source row ${row}.`);
    });
    const supervision = field("Supervisión").toLowerCase();
    const chokingRisk = field("Riesgo atragantamiento");
    const chewing = field("Tipo de masticación");
    validate([supervision], ["no", "obligatoria", "sí", "si", "primera vez"], "supervision");
    validate([chokingRisk], ["Baja", "Media", "Alta"], "choking risk");
    validate([chewing], ["N/A", "Principiante", "Media", "Avanzada"], "chewing level");
    const complementary = /no es una dieta completa/i.test(field("NOTA"));
    const reference: ProductReference = {
      sourceRow: row,
      kind: complementary ? "Complemento alimenticio" : kind,
      species,
      lifeStages: validate(field("Etapa").split("-").map((value) => value.trim()), ["Cachorro", "Adulto", "Senior"], "life stage"),
      sizes: validate(field("Tamaño recomendado").toLowerCase().replace("pequeños", "pequeño").split(",").map((value) => value.trim()), ["mini", "pequeño", "mediano", "grande"], "size"),
      chewing: meaningful(chewing),
      // Never turn a source 'No' or low risk into a claim that unsupervised use is safe.
      supervision: ["obligatoria", "sí", "si"].includes(supervision) ? "Supervisá su consumo" : supervision === "primera vez" ? "Supervisá especialmente el primer uso" : null,
      allergens: meaningful(field("Riesgo alergias")),
      restrictions: field("NO recomendado para"),
      chokingRisk: chokingRisk === "Alta" ? "Alto" : chokingRisk === "Media" ? "Medio" : null,
      complementary,
    };
    rows.push({ row, name: heading[1], status: heading[2] as CatalogReferenceRow["status"], reference });
  }
  const headingCount = [...markdown.matchAll(/^## Fila /gm)].length;
  if (!rows.length || rows.length !== headingCount) throw new Error("The catalog source could not be imported completely.");
  return rows;
}
