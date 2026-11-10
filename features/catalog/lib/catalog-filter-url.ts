export function catalogFilterUrl(query: string, categoryId: string): string {
  const params = new URLSearchParams();
  const search = query.trim().slice(0, 100);
  if (search) params.set("q", search);
  if (categoryId) params.set("categoria", categoryId);
  return params.size ? `/productos?${params}` : "/productos";
}
