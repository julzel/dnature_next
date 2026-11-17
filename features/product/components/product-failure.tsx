"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "./product-detail.module.css";

export function ProductFailure({ reset }: { reset?: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleRetry() {
    startTransition(function refreshProduct() {
      if (reset) reset();
      else router.refresh();
    });
  }

  return <div className={styles.page}>
    <div className={styles.container}>
      <div className={styles.failure} role="alert">
        <h1>No pudimos cargar este producto</h1>
        <p>Intentá de nuevo en un momento o volvé al catálogo.</p>
        <button type="button" className={styles.primaryAction} onClick={handleRetry} disabled={pending}>{pending ? "Reintentando…" : "Reintentar"}</button>
        <Link href="/productos">Volver al catálogo</Link>
      </div>
    </div>
  </div>;
}
