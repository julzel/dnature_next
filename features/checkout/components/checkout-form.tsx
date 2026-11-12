"use client";

import { useEffect, useRef, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import type { CartStep } from "@/features/cart/components/cart-progress";
import { ArrowRight, Store, Truck } from "lucide-react";
import type { CartItem } from "@/features/cart/types/cart";
import { getCartItems } from "@/features/cart/lib/cart-store";
import { prepareOrderAction } from "../actions/prepare-order";
import { cartFingerprint, emptyCheckout, GAM_DELIVERY_FEE, orderTotals, validateCheckout } from "../lib/checkout";
import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import type { CheckoutErrors, CheckoutFields, OrderDraft } from "../types/order";
import { CheckoutField } from "./checkout-field";
import { OrderTotals } from "./order-totals";
import { OrderReview } from "./order-review";
import styles from "./checkout.module.css";

export function CheckoutForm({ items, blocked, hidden = false, onStepChange }: { items: CartItem[]; blocked: boolean; hidden?: boolean; onStepChange?: (step: CartStep) => void }) {
  const form = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const [fields, setFields] = useState<CheckoutFields>({ ...emptyCheckout });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [issues, setIssues] = useState<{ sku: string; message: string }[]>([]);
  const [prepared, setPrepared] = useState<{ fingerprint: string; order: OrderDraft } | null>(null);
  const [pending, startTransition] = useTransition();
  const fingerprint = cartFingerprint(items);
  const order = !blocked && prepared?.fingerprint === fingerprint ? prepared.order : null;
  const totals = orderTotals(items, fields.fulfillment, fields.zone);
  useEffect(function syncStep() { if (!hidden) onStepChange?.(order ? "review" : "details"); }, [hidden, order, onStepChange]);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    setFields((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    setError(null); setIssues([]); setPrepared(null);
  }
  function focusField(fieldErrors: CheckoutErrors) {
    const first = Object.keys(fieldErrors)[0];
    const control = form.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    control?.focus();
  }
  function handleEdit() { setPrepared(null); requestAnimationFrame(function focusName() { form.current?.querySelector<HTMLInputElement>('[name="name"]')?.focus(); }); }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || blocked || submitting.current) return;
    const validation = validateCheckout(fields);
    setErrors(validation.errors); setError(null); setIssues([]); setPrepared(null);
    if (Object.keys(validation.errors).length) { setError("Revisá los datos marcados para continuar."); focusField(validation.errors); return; }
    submitting.current = true;
    startTransition(async function generateOrder() {
      try {
        const result = await prepareOrderAction({ customer: fields, items: items.map((item) => ({ parentSku: item.parentSku, sku: item.sku, quantity: item.quantity, expectedPrice: item.price })) });
        if (cartFingerprint(getCartItems()) !== fingerprint) { setError("El carrito cambió mientras verificábamos el pedido. Revisalo y generá el resumen de nuevo."); return; }
        if (!result.ok) { setError(result.message); setErrors(result.fields ?? {}); setIssues(result.issues ?? []); if (result.fields) focusField(result.fields); return; }
        setPrepared({ fingerprint, order: result.order });
      } catch { setError("No pudimos generar el pedido. Conservamos tus datos; revisá tu conexión e intentá de nuevo."); }
      finally { submitting.current = false; }
    });
  }

  return <div className={styles.checkout}>
    {order ? <OrderReview order={order} onEdit={handleEdit} /> : <form ref={form} onSubmit={handleSubmit} noValidate aria-busy={pending}>
      <h2 id="checkout-title" tabIndex={-1}>Completa tu pedido</h2>
      <p>Completá tus datos y elegí cómo recibirlo. Te prepararemos un resumen para enviar por WhatsApp.</p>
      {prepared && <p role="status">El carrito cambió. Generá un nuevo resumen con tu selección actual.</p>}
      <fieldset disabled={pending} className={styles.fields}>
        <legend>Tus datos</legend>
        <CheckoutField name="name" label="Nombre completo" autoComplete="name" value={fields.name} onChange={handleChange} error={errors.name} required />
        <CheckoutField name="phone" label="Teléfono de contacto" type="tel" autoComplete="tel" maxLength={30} value={fields.phone} onChange={handleChange} error={errors.phone} required />
      </fieldset>
      <fieldset disabled={pending} className={styles.choices} aria-describedby={errors.fulfillment ? "fulfillment-error" : undefined}>
        <legend>¿Cómo querés recibirlo?</legend>
        <label><input type="radio" name="fulfillment" value="pickup" checked={fields.fulfillment === "pickup"} onChange={handleChange} /><Store size={20} aria-hidden="true" /><span>Retiro<small>Sin costo de envío</small></span></label>
        <label><input type="radio" name="fulfillment" value="delivery" checked={fields.fulfillment === "delivery"} onChange={handleChange} /><Truck size={20} aria-hidden="true" /><span>Entrega a domicilio<small>GAM: {formatCatalogPrice(GAM_DELIVERY_FEE)}</small></span></label>
        {errors.fulfillment && <p id="fulfillment-error" className={styles.error}>{errors.fulfillment}</p>}
      </fieldset>
      {fields.fulfillment === "pickup" && <p className={styles.note}>Coordinaremos el lugar y el horario de retiro por WhatsApp.</p>}
      {fields.fulfillment === "delivery" && <>
        <fieldset disabled={pending} className={styles.choices} aria-describedby={errors.zone ? "zone-error" : "zone-help"}>
          <legend>Zona de entrega</legend>
          <label><input type="radio" name="zone" value="gam" checked={fields.zone === "gam"} onChange={handleChange} /><span>Dentro de la GAM<small>{formatCatalogPrice(GAM_DELIVERY_FEE)} de envío</small></span></label>
          <label><input type="radio" name="zone" value="outside" checked={fields.zone === "outside"} onChange={handleChange} /><span>Fuera de la GAM<small>Envío por cotizar</small></span></label>
          <p id="zone-help" className={styles.note}>GAM: Gran Área Metropolitana. Confirmaremos la cobertura de tu dirección en el chat.</p>
          {errors.zone && <p id="zone-error" className={styles.error}>{errors.zone}</p>}
        </fieldset>
        <fieldset disabled={pending} className={styles.fields}>
          <legend>Dirección de entrega</legend>
          <CheckoutField name="province" label="Provincia" autoComplete="address-level1" value={fields.province} onChange={handleChange} error={errors.province} required />
          <CheckoutField name="canton" label="Cantón" autoComplete="address-level2" value={fields.canton} onChange={handleChange} error={errors.canton} required />
          <CheckoutField name="district" label="Distrito" autoComplete="address-level3" value={fields.district} onChange={handleChange} error={errors.district} required />
          <CheckoutField name="address" label="Dirección exacta y referencias" autoComplete="street-address" value={fields.address} onChange={handleChange} error={errors.address} maxLength={500} multiline required />
        </fieldset>
      </>}
      <fieldset disabled={pending} className={styles.fields}>
        <legend className="sr-only">Información adicional</legend>
        <CheckoutField name="notes" label="Notas del pedido" value={fields.notes} onChange={handleChange} error={errors.notes} maxLength={500} multiline />
      </fieldset>
      <OrderTotals totals={totals} deliveryLabel={fields.zone === "outside" ? "Por cotizar" : "Elegí cómo recibirlo"} />
      <p className={styles.note}>El IVA del 13% se suma al subtotal de productos. {fields.fulfillment === "delivery" && fields.zone === "outside" ? "El total no incluye el envío fuera de la GAM; lo cotizaremos por WhatsApp." : "El envío se muestra por separado."} El pago se coordina por WhatsApp.</p>
      {blocked && <p role="status">Actualizá las cantidades pendientes o resolvé el error del carrito para continuar.</p>}
      {error && <div className={styles.error} role="alert"><p>{error}</p>{issues.length > 0 && <ul>{issues.map((issue) => <li key={issue.sku}><strong>{items.find((item) => item.sku === issue.sku)?.name ?? issue.sku} ({issue.sku})</strong>: {issue.message}</li>)}</ul>}</div>}
      <button className={styles.primaryAction} type="submit" disabled={pending || blocked}><span>{pending ? "Verificando pedido…" : "Generar pedido"}</span><ArrowRight size={20} aria-hidden="true" /></button>
      <p className={styles.note} role="status">{pending ? "Estamos verificando los precios y la disponibilidad de tu selección." : "No se realiza ningún cobro. Podrás revisar el pedido antes de enviarlo."}</p>
    </form>}
  </div>;
}
