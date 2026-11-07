"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "./best-selling-snacks.module.css";

export function FeaturedSnacksRetry() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleRetry() {
    startTransition(() => router.refresh());
  }

  return <button type="button" className={styles.retry} onClick={handleRetry} disabled={pending}>
    {pending ? "Reintentando…" : "Reintentar"}
  </button>;
}
