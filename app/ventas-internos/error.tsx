"use client";

import { useTransition } from "react";
import styles from "@/features/sales/components/sales-dashboard.module.css";

export default function InternalSalesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [pending, startTransition] = useTransition();
  function handleRetry() { startTransition(reset); }
  return <main className={styles.page}><div className={styles.container}>
    <p className={styles.eyebrow}>Solo desarrollo</p>
    <h1>Ventas internas</h1>
    <div role="alert" className={styles.error}>
      <p>No pudimos cargar todas las ventas de Avify. Revisá la conexión e intentá de nuevo.</p>
      <button type="button" onClick={handleRetry} disabled={pending}>{pending ? "Reintentando…" : "Reintentar"}</button>
    </div>
  </div></main>;
}
