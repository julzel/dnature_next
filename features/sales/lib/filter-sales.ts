import type { SalesDataset, SalesProduct } from "../types/sales";

export type SalesFilters = {
  period: "30" | "90" | "6m";
  search: string;
  category: string;
  channel: string;
  currency: string;
  sort: "units" | "orders" | "gross" | "name";
};

export type SalesRow = SalesProduct & { units: number; orders: number; gross: number };

function searchText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

export function visibleSales(dataset: SalesDataset, filters: SalesFilters) {
  const days = filters.period === "30" ? 30 : filters.period === "90" ? 90 : null;
  const start = days === null ? dataset.fromDate : new Date(Date.parse(`${dataset.today}T00:00:00Z`) - (days - 1) * 86_400_000).toISOString().slice(0, 10);
  const productBySku = new Map(dataset.products.map((product) => [product.sku, product]));
  const rows = new Map<string, SalesRow>();
  const search = searchText(filters.search.trim());

  for (const bucket of dataset.buckets) {
    if (bucket.date < start || bucket.currency !== filters.currency || (filters.channel && bucket.channel !== filters.channel)) continue;
    const product = productBySku.get(bucket.sku);
    if (!product) continue;
    if (filters.category === "uncategorized" ? product.categories.length > 0 : filters.category && !product.categories.some((category) => category.id === filters.category)) continue;
    if (search && !searchText(`${product.name} ${product.sku} ${product.customSku ?? ""}`).includes(search)) continue;
    const row = rows.get(bucket.sku) ?? { ...product, units: 0, orders: 0, gross: 0 };
    row.units += bucket.units;
    row.orders += bucket.orders;
    row.gross += bucket.gross;
    rows.set(bucket.sku, row);
  }

  const sorted = [...rows.values()].sort((a, b) => {
    if (filters.sort !== "name") {
      const difference = b[filters.sort] - a[filters.sort];
      if (difference) return difference;
    }
    return a.name.localeCompare(b.name, "es") || a.sku.localeCompare(b.sku, "es");
  });
  return {
    rows: sorted,
    products: sorted.length,
    units: sorted.reduce((total, row) => total + row.units, 0),
    gross: sorted.reduce((total, row) => total + row.gross, 0),
  };
}
