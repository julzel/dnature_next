export function maximumQuantity(quantityAvailable: number | null): number | undefined {
  return quantityAvailable !== null && Number.isFinite(quantityAvailable) ? Math.max(0, Math.floor(quantityAvailable)) : undefined;
}

export function quantityError(value: string, maximum: number | undefined): string | null {
  const quantity = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(quantity) || quantity < 1) return "Ingresá una cantidad entera de al menos 1.";
  if (maximum !== undefined && quantity > maximum) return `La cantidad disponible para esta presentación es ${maximum}.`;
  return null;
}
