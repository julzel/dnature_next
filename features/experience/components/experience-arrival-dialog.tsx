"use client";

import Link from "next/link";
import { useEffect, useRef, type MouseEvent } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { useVisitPreference } from "../hooks/use-visit-preference";
import { AnimatedIllustration } from "./animated-illustration";
import { ExperienceChoiceImage } from "./experience-choice-image";
import styles from "./experience-arrival-dialog.module.css";

export function ExperienceArrivalDialog() {
  const visit = useVisitPreference();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!visit.ready || visit.preference || window.location.hash) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => { if (dialog?.open) dialog.close(); };
  }, [visit.ready, visit.preference]);

  function handleClose() {
    dialogRef.current?.close();
  }

  function handleGuided() { visit.choose("guided"); handleClose(); }
  function handleExplore() { visit.choose("explore"); handleClose(); }

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) handleClose();
  }

  return (
    <>
    {visit.error && <p role="status" className={styles.storageNotice}>{visit.error}</p>}
    <dialog ref={dialogRef} className={styles.dialog} aria-label="Elegí cómo explorar DNAture" onClick={handleDialogClick}>
      <div className={styles.content}>
        <button type="button" className={styles.close} onClick={handleClose} aria-label="Cerrar opciones"><X size={24} aria-hidden="true" /></button>
        <div className={styles.choices}>
          <Link href="#experiencia-personalizada" className={styles.choice} onClick={handleGuided} autoFocus>
            <AnimatedIllustration><ExperienceChoiceImage experience="guided" /></AnimatedIllustration>
            <span className={styles.choiceLabel}><span>Visita guiada</span><ArrowUpRight className={styles.choiceArrow} size={32} strokeWidth={1.5} aria-hidden="true" /></span>
          </Link>
          <button type="button" className={styles.choice} onClick={handleExplore}>
            <AnimatedIllustration><ExperienceChoiceImage experience="explore" /></AnimatedIllustration>
            <span className={styles.choiceLabel}><span>Explorar por mi cuenta</span><ArrowUpRight className={styles.choiceArrow} size={32} strokeWidth={1.5} aria-hidden="true" /></span>
          </button>
        </div>
      </div>
    </dialog>
    </>
  );
}
