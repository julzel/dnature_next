import "server-only";
import { getCatalogProducts } from "@/features/catalog/server/catalog";
import { productPath } from "@/features/catalog/lib/product-path";
import { orderTotals } from "@/features/checkout/lib/checkout";
import type { CatalogProduct } from "@/features/catalog/types/catalog";
import { buildQuote } from "@dnature/feeding-engine";
import { quoteRequestSchema, reviewReason, type QuoteRequest } from "../lib/intake";
import type { QuoteResponse, FeedingResult } from "../lib/result";
import { quotationCatalog } from "./catalog-adapter";

export function calculateQuote(input: QuoteRequest, catalog: CatalogProduct[], calculatedAt = new Date().toISOString()): QuoteResponse {
  const request = quoteRequestSchema.parse(input);
  const items = quotationCatalog(catalog);
  const publicProducts = new Map(catalog.map((product) => [product.sku, product]));
  const pets = request.pets.map((pet): FeedingResult => {
    const base = { id: pet.id, name: pet.name, meals: pet.species === "dog" ? pet.meals : 0, rawDailyGrams: null, dailyGrams: null, packages: [] };
    const review = reviewReason(pet);
    if (review || pet.species !== "dog") return { ...base, review };
    const result = buildQuote({
      pets: [{ id: pet.id, name: pet.name, profile: { ...pet, health: "healthy", allergyStatus: "no", allergies: [], allergyNotes: "", neutered: pet.neutered === "yes" },
        selected: {}, extras: [], varietyLevel: "medium", complementVarietyLevel: "medium" }],
      options: { days: request.days, complementPercent: 20, firstPurchase: false, supplementMode: "period" },
      catalog: { items, loadedAt: calculatedAt }, catalogState: "ready",
    }).pets[0].result;
    if (!result || result.referral) return { ...base, review: result?.referral ?? "Necesitamos revisar estos datos antes de estimar la porción." };
    return { ...base, review: null, rawDailyGrams: result.rawDailyGrams, dailyGrams: result.dailyGrams,
      packages: result.packages.map((pack) => {
        const lines = pack.lines.map((line) => {
          const product = publicProducts.get(line.item.avify.sku!)!;
          return { sku: line.variant.sku!, name: product.editorial.fields.productName || line.item.catalog.name,
            presentation: line.variant.name || line.item.catalog.presentation, href: productPath({ sku: product.sku, slug: product.editorial.fields.urlSlug }),
            quantity: line.quantity, price: line.unitPrice, role: line.role,
            note: line.dose?.message ?? line.snackDecision?.reason ?? line.reason };
        });
        const totals = orderTotals(lines, "", "");
        return { id: pack.id, name: pack.name, ready: pack.ready, mixDailyGrams: pack.mixDailyGrams, complementDailyGrams: pack.complementDailyGrams,
          lines, subtotal: totals.subtotal, iva: totals.iva, total: totals.total,
          issues: [...new Set(pack.issues.filter((issue) => issue.severity === "blocking").map((issue) => issue.message))],
          notes: [...new Set([pack.formulaNote, pack.varietyWarning, pack.complementVarietyWarning, ...pack.warnings.filter((warning) => !warning.startsWith("Estimación del piloto:"))].filter((note): note is string => Boolean(note)))] };
      }) };
  });
  return { version: "guided-feeding-v1", days: request.days, calculatedAt, pets };
}

export async function createFeedingQuote(input: unknown): Promise<QuoteResponse> {
  const request = quoteRequestSchema.parse(input);
  // Referrals still work when the catalog is unavailable and do not request prices.
  const catalog = request.pets.some((pet) => !reviewReason(pet)) ? await getCatalogProducts() : [];
  return calculateQuote(request, catalog);
}
