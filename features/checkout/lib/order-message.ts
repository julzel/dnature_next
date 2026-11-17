import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import type { OrderDraft } from "../types/order";

export function orderMessage(order: Omit<OrderDraft, "message" | "whatsappUrl">): string {
  const { customer, totals } = order;
  const fulfillment = customer.fulfillment === "pickup"
    ? "Entrega: retiro. Coordinar lugar y horario por WhatsApp."
    : `Entrega a domicilio: ${customer.zone === "gam" ? "GAM" : "fuera de la GAM"}\nProvincia: ${customer.province}\nCantón: ${customer.canton}\nDistrito: ${customer.district}\nDirección: ${customer.address}`;
  return [
    `Hola, quisiera solicitar este pedido DNAture.`,
    `Referencia: ${order.reference}`,
    `Cliente: ${customer.name}\nTeléfono: ${customer.phone}`,
    order.items.map((item, index) => `${index + 1}. ${item.name} — ${item.presentation}\nSKU: ${item.sku} · ${item.quantity} × ${formatCatalogPrice(item.price)} = ${formatCatalogPrice(item.price * item.quantity)}`).join("\n\n"),
    fulfillment,
    `Subtotal de productos: ${formatCatalogPrice(totals.subtotal)}\nIVA (13% sobre productos): ${formatCatalogPrice(totals.iva)}\nEnvío: ${totals.delivery === null ? "por cotizar; no incluido" : formatCatalogPrice(totals.delivery)}\n${totals.delivery === null ? "Total sin envío" : "Total"}: ${formatCatalogPrice(totals.total)}`,
    ...(customer.notes ? [`Notas: ${customer.notes}`] : []),
    "Pedido pendiente de confirmación y pago. Por favor, confirmen disponibilidad, entrega y forma de pago.",
  ].join("\n\n");
}
