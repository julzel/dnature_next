"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Download, MessageCircle } from "lucide-react";
import contact from "@/features/contact/data/contact.json";
import type { OrderDraft } from "../types/order";
import { OrderTotals } from "./order-totals";
import styles from "./checkout.module.css";

export function OrderReview({ order, onEdit }: { order: OrderDraft; onEdit: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [copying, setCopying] = useState(false);
  const [feedback, setFeedback] = useState<{ error: boolean; message: string } | null>(null);
  // Very long orders can exceed browser/app URL limits; offer copy + a plain chat link instead.
  const longMessage = order.whatsappUrl.length > 7000;
  useEffect(function focusReview() { heading.current?.focus(); }, []);
  async function handleCopy() {
    if (copying) return;
    setCopying(true); setFeedback(null);
    try { await navigator.clipboard.writeText(order.message); setFeedback({ error: false, message: "Pedido copiado. Pegalo en la conversación de WhatsApp." }); }
    catch { setFeedback({ error: true, message: "No pudimos copiar el pedido. Podés descargarlo o seleccionar el texto del resumen." }); }
    finally { setCopying(false); }
  }
  function handleDownload() {
    const url = URL.createObjectURL(new Blob([order.message], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `${order.reference}.txt`; link.click();
    setTimeout(function releaseDownload() { URL.revokeObjectURL(url); }, 1000);
  }
  return <section className={styles.review} aria-labelledby="order-review-title">
    <p className={styles.reference}>Referencia {order.reference}</p>
    <h2 id="order-review-title" ref={heading} tabIndex={-1}>Tu pedido está listo para enviar</h2>
    <p>Revisá el resumen y envialo por WhatsApp. El pedido todavía no se ha enviado, confirmado ni pagado.</p>
    <OrderTotals totals={order.totals} deliveryLabel="Por cotizar" />
    {order.totals.delivery === null && <p>El envío fuera de la GAM se cotiza por WhatsApp y se suma al total antes de confirmar el pedido.</p>}
    <details className={styles.message} open>
      <summary>Ver el mensaje del pedido</summary>
      <pre>{order.message}</pre>
    </details>
    {longMessage && <p>Este pedido es largo: copialo o descargalo y compartilo en el chat.</p>}
    <a className={styles.primaryAction} href={longMessage ? contact.whatsapp.url : order.whatsappUrl} target="_blank" rel="noopener noreferrer">
      <MessageCircle size={20} aria-hidden="true" /><span>{longMessage ? "Abrir WhatsApp" : "Enviar pedido por WhatsApp"}<span className="sr-only"> (abre en otra pestaña)</span></span>
    </a>
    <div className={styles.secondaryActions}>
      <button type="button" onClick={handleCopy} disabled={copying} aria-label={copying ? "Copiando pedido…" : "Copiar pedido"}><Copy size={20} aria-hidden="true" /><span>{copying ? "Copiando…" : "Copiar"}</span></button>
      <button type="button" onClick={handleDownload} aria-label="Descargar pedido"><Download size={20} aria-hidden="true" /><span>Descargar</span></button>
      <button type="button" className={styles.edit} onClick={onEdit}>Editar datos</button>
    </div>
    {feedback && <p role={feedback.error ? "alert" : "status"}>{feedback.message}</p>}
    <p className={styles.note}>Nuestro equipo confirmará la disponibilidad, la entrega y la forma de pago en el chat. Tu carrito se conserva.</p>
  </section>;
}
