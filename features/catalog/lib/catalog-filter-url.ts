import { categoryFilterSlug, type CatalogCategory, type CatalogFilters, type CatalogSort } from "./browse-catalog";

type SearchParams = { get(name: string): string | null; getAll(name: string): string[] };

const SORTS: readonly CatalogSort[] = ["relevance", "name", "price-asc", "price-desc"];

function singleParam(params: SearchParams, name: string): string {
  return params.getAll(name).length === 1 ? params.get(name) ?? "" : "";
}

export function readCatalogFilters(
  params: SearchParams,
  categories: readonly CatalogCategory[],
  defaultCategoryId = "",
): CatalogFilters {
  const requested = params.getAll("categoria");
  const categoryIds = categories.filter((category) => requested.length
    ? requested.some((value) => value === category.id || value === categoryFilterSlug(category))
    : category.id === defaultCategoryId).map(({ id }) => id);
  const sort = singleParam(params, "orden");
  return {
    query: singleParam(params, "q").slice(0, 100),
    categoryIds,
    inStockOnly: singleParam(params, "disponible") === "1",
    sort: SORTS.includes(sort as CatalogSort) ? sort as CatalogSort : "relevance",
  };
}

export function catalogFilterUrl(filters: CatalogFilters, categories: readonly CatalogCategory[]): string {
  const params = new URLSearchParams();
  const query = filters.query.slice(0, 100);
  if (query) params.set("q", query);
  for (const category of categories) {
    if (filters.categoryIds.includes(category.id)) params.append("categoria", categoryFilterSlug(category));
  }
  if (filters.inStockOnly) params.set("disponible", "1");
  if (filters.sort !== "relevance" && SORTS.includes(filters.sort)) params.set("orden", filters.sort);
  return params.size ? `/productos?${params}` : "/productos";
}
