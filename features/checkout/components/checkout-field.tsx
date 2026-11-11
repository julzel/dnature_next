import type { ChangeEventHandler, HTMLInputAutoCompleteAttribute } from "react";
import type { CheckoutFields } from "../types/order";
import styles from "./checkout.module.css";

type Props = {
  name: keyof CheckoutFields;
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  maxLength?: number;
  type?: "text" | "tel";
};

export function CheckoutField({ name, label, value, onChange, error, required, multiline, autoComplete, maxLength = 100, type = "text" }: Props) {
  const id = `checkout-${name}`;
  const props = { id, name, value, onChange, required, autoComplete, maxLength, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined };
  return <div className={styles.field}>
    <label htmlFor={id}>{label}{!required && <span> (opcional)</span>}</label>
    {multiline ? <textarea {...props} rows={3} /> : <input {...props} type={type} />}
    {error && <p id={`${id}-error`} className={styles.error}>{error}</p>}
  </div>;
}
