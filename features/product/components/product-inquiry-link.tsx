"use client";

import { ArrowUpRight } from "lucide-react";
import contact from "@/features/contact/data/contact.json";
import { maximumQuantity, quantityError } from "../lib/product-quantity";
import { useProductSelection } from "./product-selection-provider";

export function ProductInquiryLink({ name, url }: { name: string; url: string }) {
  const { selected, quantity } = useProductSelection();
  const available = selected?.inStock ?? false;
  const invalidQuantity = quantityError(quantity, maximumQuantity(selected?.quantityAvailable ?? null));
  const message = `Hola, me interesa ${name}${selected ? ` (${selected.name}, SKU: ${selected.sku})` : ""}.${!invalidQuantity ? ` Cantidad: ${quantity}.` : ""} ${available ? "Quisiera consultar cómo pedirlo." : "¿Me pueden confirmar su disponibilidad?"}\n${url}`;
  const inquiryUrl = `${contact.whatsapp.url}?text=${encodeURIComponent(message)}`;

  return <a href={inquiryUrl} target="_blank" rel="noopener noreferrer">¿Tenés dudas sobre este producto? Consultanos.<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (abre en otra pestaña)</span></a>;
}
