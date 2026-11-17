import type { FeedingPackage, QuoteResponse } from "../../lib/result";

const mix = { sku: "complete-1kg", name: "Complete de res", presentation: "1 kg", href: "/producto/complete-de-res", quantity: 17, price: 2500, role: "Mezcla completa", note: "Repartir según su porción diaria. Conservar en refrigeración según las indicaciones del producto." };
const egg = { sku: "huevos-10", name: "Huevos de codorniz", presentation: "10 unidades", href: "/producto/huevos-de-codorniz", quantity: 2, price: 2000, role: "Huevo", note: "Seguir la pauta individual indicada para los huevos." };
const supplement = { sku: "polen-50g", name: "Polen", presentation: "50 g", href: "/producto/polen", quantity: 1, price: 3500, role: "Suplementos", note: "Usar únicamente según la pauta del producto." };
const probiotic = { ...supplement, sku: "kefir-500ml", name: "Kéfir", presentation: "500 ml", role: "Probióticos" };
const snack = { ...supplement, sku: "snack-80g", name: "Pulmón de res deshidratado", presentation: "80 g", role: "Snack · Premio" };
const complement = { ...mix, sku: "complemento-1kg", name: "Complemento de fórmula", quantity: 4, role: "Complementos de fórmula" };

export const previewPackages: FeedingPackage[] = [
  { id: "base", name: "Base", lines: [mix, egg], mixDailyGrams: 600, complementDailyGrams: 0 },
  { id: "functional", name: "Funcional", lines: [mix, egg, supplement, probiotic, snack], mixDailyGrams: 600, complementDailyGrams: 0 },
  { id: "chewing", name: "Masticación", lines: [{ ...mix, quantity: 14 }, complement, egg], mixDailyGrams: 480, complementDailyGrams: 120 },
  { id: "premium", name: "Premium", lines: [{ ...mix, quantity: 14 }, complement, egg, supplement, snack], mixDailyGrams: 480, complementDailyGrams: 120 },
].map((pack) => {
  const subtotal = pack.lines.reduce((sum, line) => sum + line.quantity * line.price, 0);
  const iva = Math.round(subtotal * .13);
  return { ...pack, subtotal, iva, total: subtotal + iva, ready: pack.id !== "premium", issues: pack.id === "premium" ? ["Probiótico: confirmar existencias y la pauta de uso antes de completar este paquete."] : [], notes: ["El excedente de los envases no aumenta la porción diaria."] };
});

export const previewQuote: QuoteResponse = {
  version: "guided-feeding-v1", days: 28, calculatedAt: "2026-11-16T18:00:00.000Z",
  pets: [
    { id: "pet-1", name: "Luna", dailyGrams: 600, rawDailyGrams: 596, meals: 2, review: null, packages: previewPackages },
    { id: "pet-2", name: "Toby", dailyGrams: 150, rawDailyGrams: 150, meals: null, review: null, packages: previewPackages.map((pack) => ({ ...pack, mixDailyGrams: pack.complementDailyGrams ? 120 : 150, complementDailyGrams: pack.complementDailyGrams ? 30 : 0 })) },
    { id: "cat", name: "Milo", dailyGrams: null, rawDailyGrams: null, meals: 0, review: "La estimación automática es para perros. Revisemos la alimentación de tu gato con nuestro equipo.", packages: [] },
  ],
};
