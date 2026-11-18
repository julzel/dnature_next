import contact from "@/features/contact/data/contact.json";
import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import type { FeedingPackage, FeedingResult } from "./result";

const introductions: Record<string, { label: string; description: string }> = {
  base: { label: "La base de su rutina", description: "Una propuesta sencilla para empezar con su alimentación diaria." },
  functional: { label: "Un poco más en su día", description: "Su base de alimentación, con suplementos, probióticos y snacks." },
  chewing: { label: "Variedad en su porción", description: "Combina la mezcla con complementos de fórmula en su ración diaria." },
  premium: { label: "La propuesta más amplia", description: "Reúne complementos, suplementos, probióticos y snacks alrededor de su base." },
};

export function packageIntroduction(pack: FeedingPackage) {
  return introductions[pack.id] ?? { label: "Su propuesta", description: "Productos y cantidades según su perfil." };
}

/** Summarize actual quoted lines, including the engine's different snack roles. */
export function packageContents(pack: FeedingPackage): string[] {
  return [...new Set(pack.lines.map((line) => line.role.startsWith("Snack") ? "Snacks" : line.role))];
}

/** A customer-initiated enquiry, never an order confirmation or an automatic send. */
export function packageWhatsAppUrl(pack: FeedingPackage, pet: FeedingResult, days: number, savedDate?: string): string {
  const message = [
    savedDate ? `Hola, quisiera confirmar el paquete ${pack.name} para ${pet.name}, de la propuesta guardada el ${savedDate}.` : pack.ready ? `Hola, me interesa el paquete ${pack.name} de DNAture para ${pet.name}.` : `Hola, quisiera revisar el paquete ${pack.name} para ${pet.name} antes de elegirlo.`,
    `Período: ${days} días. Porción estimada: ${pet.dailyGrams} g al día.`,
    ...pack.lines.map((line) => `${line.quantity} × ${line.name} · ${line.presentation} (${line.sku}): ${formatCatalogPrice(line.price * line.quantity)}`),
    `Productos${pack.ready ? "" : " cotizados (parcial)"}: ${formatCatalogPrice(pack.subtotal)}`,
    `IVA (13%): ${formatCatalogPrice(pack.iva)}`,
    `${pack.ready ? "Total estimado" : "Total parcial; paquete incompleto"}: ${formatCatalogPrice(pack.total)}. Envío no incluido.`,
    ...(!pack.ready ? ["Pendiente de revisión:", ...pack.issues] : []),
    "Quisiera confirmar los productos, sus pautas de uso, la disponibilidad y el costo de entrega. Esta consulta no confirma una compra.",
  ].join("\n");
  const url = new URL(contact.whatsapp.url);
  url.searchParams.set("text", message);
  return url.toString();
}
