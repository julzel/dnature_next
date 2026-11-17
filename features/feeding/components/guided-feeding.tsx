"use client";

import Link from "next/link";
import { useStoredPets } from "@/features/experience/hooks/use-stored-pets";
import { FeedingWorkflow } from "./feeding-workflow";
import styles from "./feeding.module.css";

export function GuidedFeeding() {
  const stored = useStoredPets();
  return <div className={styles.page}>
    {stored.status === "loading" && <p role="status">Cargando tus mascotas…</p>}
    {stored.status === "error" && <p role="alert">{stored.error}</p>}
    {stored.status !== "loading" && !stored.pets.length && <><h1>Comencemos con tus mascotas</h1><p>Agregá sus perfiles para preparar una estimación personalizada.</p><Link href="/#experiencia-personalizada">Iniciar visita guiada</Link></>}
    {stored.status === "ready" && stored.pets.length > 0 && <FeedingWorkflow key={JSON.stringify(stored.pets)} pets={stored.pets} />}
    <noscript>Activá JavaScript para completar esta visita personalizada. También podés <Link href="/alianzas">consultar profesionales aliados</Link>.</noscript>
  </div>;
}
