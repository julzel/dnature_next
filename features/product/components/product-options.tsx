"use client";

import { useId, useState, type ChangeEvent, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import contact from "@/features/contact/data/contact.json";
import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import type { ProductOption } from "../types/product";
import styles from "./product-detail.module.css";

export function ProductOptions({ name, options, url, profile, precautions }: { name: string; options: ProductOption[]; url: string; profile?: ReactNode; precautions?: ReactNode }) {
  const groupId = useId();
  const initial = [...options].sort((a, b) => Number(b.inStock) - Number(a.inStock) || (a.price ?? Infinity) - (b.price ?? Infinity))[0];
  const [sku, setSku] = useState(initial?.sku ?? "");
  const selected = options.find((option) => option.sku === sku);
  const available = selected?.inStock ?? false;
  const message = `Hola, me interesa ${name}${selected ? ` (${selected.name}, SKU: ${selected.sku})` : ""}. ${available ? "Quisiera consultar cómo pedirlo." : "¿Me pueden confirmar su disponibilidad?"}\n${url}`;
  const inquiryUrl = `${contact.whatsapp.url}?text=${encodeURIComponent(message)}`;

  function handleOptionChange(event: ChangeEvent<HTMLInputElement>) {
    setSku(event.currentTarget.value);
  }

  return (
    <div className={styles.options}>
      <div className={styles.offer} role="status" aria-live="polite" aria-atomic="true">
        <p className={styles.price}>{selected?.price != null ? formatCatalogPrice(selected.price) : "Precio a consultar"}</p>
        <p className={styles.availability} data-available={available}>{available ? "Disponible" : "Agotado"}</p>
      </div>
      {profile}
      {options.length > 1 && <fieldset className={styles.presentations}>
        <legend>Elegí una presentación</legend>
        {options.map((option) => <label key={option.sku} className={styles.presentation}>
          <input type="radio" name={groupId} value={option.sku} checked={sku === option.sku} onChange={handleOptionChange} />
          <span>{option.name}<small>{option.inStock ? "Disponible" : "Agotado"}</small></span>
          <span className={styles.optionPrice}>{option.price === null ? "Consultar" : formatCatalogPrice(option.price)}</span>
        </label>)}
      </fieldset>}
      {options.length === 1 && <p className={styles.singlePresentation}>{selected?.name}</p>}
      {precautions}
      <a className={styles.primaryAction} href={inquiryUrl} target="_blank" rel="noopener noreferrer">
        <span>{available ? "Consultar pedido por WhatsApp" : "Consultar disponibilidad"}</span>
        <ArrowUpRight size={20} aria-hidden="true" />
        <span className="sr-only"> (abre en otra pestaña)</span>
      </a>
      <p className={styles.purchaseNote}>Coordiná tu pedido, entrega y disponibilidad final con nuestro equipo.</p>
      <noscript><p>Si preferís otra presentación, indicala en tu mensaje de WhatsApp.</p></noscript>
    </div>
  );
}
