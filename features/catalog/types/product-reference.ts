/** Descriptive source data, not individual nutritional or clinical approval. */
export type ProductReference = {
  sourceRow: number;
  kind: string;
  species: ("dog" | "cat")[];
  lifeStages: string[];
  sizes: string[];
  chewing: string | null;
  supervision: string | null;
  allergens: string | null;
  restrictions: string;
  chokingRisk: string | null;
  complementary: boolean;
};

export type CatalogReferenceRow = {
  row: number;
  name: string;
  status: "Descripción comercial" | "Excluir" | "Continuidad pendiente";
  reference: ProductReference;
};

export type CatalogReferenceSource = {
  source: string;
  sourceSha256: string;
  workbookSha256: string;
  rows: CatalogReferenceRow[];
};
