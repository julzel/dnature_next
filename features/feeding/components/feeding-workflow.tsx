"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { DRAFT_KEY, quoteRequestSchema } from "../lib/intake";
import type { QuoteResponse } from "../lib/result";
import { PetFeedingFields } from "./pet-feeding-fields";
import { PetFeedingResult } from "./pet-feeding-result";
import styles from "./feeding.module.css";

function readDraft(): { values: Record<string, string>; error: string } {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return { values: {}, error: "" };
    if (raw.length > 32_000) throw new Error("Invalid draft");
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value) || !Object.values(value).every((item) => typeof item === "string" && item.length <= 500)) throw new Error("Invalid draft");
    return { values: value as Record<string, string>, error: "" };
  } catch { return { values: {}, error: "No pudimos recuperar las respuestas de esta pestaña. Podés completar el formulario para continuar." }; }
}

export function FeedingWorkflow({ pets }: { pets: PetProfile[] }) {
  const [saved] = useState(readDraft);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState(saved.error);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<QuoteResponse | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(function cancelOnLeave() { return () => controller.current?.abort(); }, []);
  useEffect(function focusStep() { if (result) heading.current?.focus(); }, [result]);

  function handleDraft() {
    if (!form.current) return;
    const values = Object.fromEntries(new FormData(form.current));
    // Bind answers to the initial pet identity so editing/replacing a profile cannot reuse another pet's answers.
    for (const pet of pets) values[`${pet.id}._identity`] = JSON.stringify(pet);
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values)); setStorageError(""); }
    catch { setStorageError("Podés continuar, pero este navegador no permite guardar las respuestas al recargar."); }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    handleDraft();
    const data = new FormData(event.currentTarget);
    const payload = { days: Number(data.get("days")), pets: pets.map((pet) => {
      if (pet.species === "cat") return pet;
      const answers = Object.fromEntries(["age", "weight", "lifeStage", "neutered", "body", "activity", "health", "allergyStatus", "goal", "behavior", "brachycephaly", "meals"].map((key) => [key, data.get(`${pet.id}.${key}`)]));
      return { ...pet, ...answers, age: Number(answers.age), weight: Number(answers.weight), meals: Number(answers.meals) };
    }) };
    if (!quoteRequestSchema.safeParse(payload).success) { setError("Completá todas las respuestas. Usá una edad de 0 a 30 años y un peso de 0,1 a 100 kg."); return; }
    setPending(true); setError("");
    controller.current?.abort();
    const current = new AbortController(); controller.current = current;
    try {
      const response = await fetch("/api/feeding/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: current.signal });
      const value = await response.json();
      if (!response.ok) throw new Error(value.message || "No pudimos calcular los paquetes. Intentá de nuevo.");
      if (current.signal.aborted) return;
      setResult(value);
    } catch (failure) {
      if (!current.signal.aborted) setError(failure instanceof Error ? failure.message : "No pudimos calcular los paquetes. Intentá de nuevo.");
    } finally { if (!current.signal.aborted) setPending(false); }
  }
  function handleBack() { setResult(null); setError(""); requestAnimationFrame(() => heading.current?.focus()); }

  return <>
    <ol className={styles.steps} aria-label="Pasos de tu plan"><li aria-current={!result ? "step" : undefined}>1. Datos para su porción</li><li aria-current={result ? "step" : undefined}>2. Porción y paquetes</li></ol>
    <h1 tabIndex={-1} ref={heading}>{result ? "Su porción y sus paquetes" : "Un plan para tus compañeros"}</h1>
    <div hidden={Boolean(result)}>
      <p>Ya conocemos sus nombres y razas. Contanos sobre su rutina para estimar cuánto servir y qué paquetes pueden acompañarla.</p>
      <p><Link href="/#experiencia-personalizada">Editar o agregar mascotas</Link></p>
      <form ref={form} onSubmit={handleSubmit} onChange={handleDraft} aria-label="Datos para estimar la porción" aria-busy={pending}>
        <fieldset disabled={pending} className={styles.formFields}>
          <legend className="sr-only">Datos de alimentación</legend>
          {pets.map((pet) => pet.species === "dog" ? <PetFeedingFields pet={pet} key={pet.id} defaults={saved.values[`${pet.id}._identity`] === JSON.stringify(pet) ? saved.values : {}} /> : <div className={styles.notice} key={pet.id}><h2>{pet.name}</h2><p>Para tu gato, el equipo te ayudará a definir su alimentación. Esta calculadora estima porciones para perros.</p></div>)}
          <label className={styles.period}>Duración del paquete<select name="days" defaultValue={saved.values.days === "14" ? "14" : "28"}><option value="14">14 días</option><option value="28">28 días</option></select></label>
          <p>Las porciones son estimaciones. Si hay crecimiento, una condición de salud o alergias, te orientaremos hacia una revisión individual.</p>
          <button type="submit" className={styles.primary}>{pending ? "Calculando porciones y consultando el catálogo…" : "Estimar porción y ver paquetes"}</button>
        </fieldset>
      </form>
      <p role="status" aria-live="polite">{pending ? "Estamos calculando con los precios y las existencias actuales." : storageError}</p>
      {error && <p role="alert" className={styles.notice}>{error}</p>}
    </div>
    {result && <>
      <button className={styles.secondary} onClick={handleBack} type="button">Editar respuestas y recalcular</button>
      <p>Paquetes para {result.days} días. Cada mascota se cotiza por separado; precios y disponibilidad se confirman al comprar.</p>
      {result.pets.map((pet) => <PetFeedingResult key={pet.id} result={pet} days={result.days} />)}
    </>}
  </>;
}
