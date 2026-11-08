"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "./catalog-page.module.css";

export function CatalogRetry() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleRetry() {
    startTransition(() => router.refresh());
  }

  return <button className={styles.retry} type="button" onClick={handleRetry} disabled={pending}>{pending ? "Reintentando…" : "Reintentar"}</button>;
}
