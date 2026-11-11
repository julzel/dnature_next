/** Render whole-colón prices consistently across server and browser ICU versions. */
export function formatCatalogPrice(price: number): string {
  return `₡${String(Math.round(price)).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`;
}
