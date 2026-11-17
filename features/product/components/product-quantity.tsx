"use client";

import { Minus, Plus } from "lucide-react";
import type { ChangeEvent } from "react";
import { quantityError } from "../lib/product-quantity";
import styles from "./product-detail.module.css";

export function ProductQuantity({ value, maximum, disabled, onChange }: { value: string; maximum?: number; disabled: boolean; onChange: (value: string) => void }) {
  const error = disabled ? null : quantityError(value, maximum);
  const quantity = Number(value);
  function handleDecrease() { onChange(String(Math.max(1, Number.isSafeInteger(quantity) ? quantity - 1 : 1))); }
  function handleIncrease() { onChange(String(Math.min(maximum ?? Number.MAX_SAFE_INTEGER, Number.isSafeInteger(quantity) && quantity >= 1 ? quantity + 1 : 1))); }
  function handleChange(event: ChangeEvent<HTMLInputElement>) { onChange(event.currentTarget.value); }

  return <div className={styles.quantityField}>
    <label htmlFor="product-quantity">Cantidad</label>
    <div className={styles.quantityStepper}>
      <button type="button" onClick={handleDecrease} disabled={disabled || quantity <= 1} aria-label="Disminuir cantidad"><Minus size={18} aria-hidden="true" /></button>
      <input id="product-quantity" type="number" inputMode="numeric" min="1" max={maximum} step="1" value={value} onChange={handleChange} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? "product-quantity-error" : undefined} />
      <button type="button" onClick={handleIncrease} disabled={disabled || (maximum !== undefined && quantity >= maximum)} aria-label="Aumentar cantidad"><Plus size={18} aria-hidden="true" /></button>
    </div>
    {error && <p id="product-quantity-error" className={styles.fieldError} role="alert">{error}</p>}
  </div>;
}
