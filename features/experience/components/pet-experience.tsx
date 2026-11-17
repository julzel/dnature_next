"use client";

import { useEffect, useRef, useState } from "react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { useStoredPets } from "../hooks/use-stored-pets";
import { PetQuestionnaire } from "./pet-questionnaire";
import { ReturningPets } from "./returning-pets";
import styles from "./returning-pets.module.css";

export function PetExperience() {
  const stored = useStoredPets();
  const [managing, setManaging] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const requestedFocus = useRef(false);
  useEffect(function focusContent() {
    if (!requestedFocus.current) return;
    const heading = content.current?.querySelector<HTMLElement>("h2, h3");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
    document.getElementById("experiencia-personalizada")?.scrollIntoView({ block: "start" });
    requestedFocus.current = false;
  }, [managing]);
  function handleManage() { requestedFocus.current = true; setManaging(true); }
  function handleWelcome() { requestedFocus.current = true; setManaging(false); }
  if (stored.status === "loading") return <p role="status">Cargando tus mascotas…</p>;

  return (
    <div ref={content}>
      <SectionEyebrow label={stored.pets.length > 0 && !managing ? "Tu manada DNAture" : "Cuéntanos sobre tu mascota"} />
      {stored.error && <p role="alert">{stored.error}</p>}
      {stored.pets.length > 0 && !managing ? <ReturningPets pets={stored.pets} onManage={handleManage} /> : <div className={managing ? styles.management : undefined}>
        {managing && <button type="button" className={styles.manage} onClick={handleWelcome}>Volver a la bienvenida</button>}
        <PetQuestionnaire initialPets={stored.pets} />
      </div>}
    </div>
  );
}
