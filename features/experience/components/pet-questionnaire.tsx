"use client";

import { useEffect, useRef, useState, type AnimationEvent, type ChangeEvent, type FormEvent, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, Cat, Dog, Pencil } from "lucide-react";
import type { PetSpecies } from "../data/pet-breeds";
import { BreedCombobox } from "./breed-combobox";
import styles from "./pet-questionnaire.module.css";

export function PetQuestionnaire() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState<PetSpecies | null>(null);
  const [breed, setBreed] = useState("");
  const [error, setError] = useState("");
  const [direction, setDirection] = useState<"forward" | "backward" | "none">("none");
  const [phase, setPhase] = useState<"idle" | "exiting" | "entering">("idle");
  const pendingStep = useRef<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const hasNavigated = useRef(false);
  const transitioning = phase !== "idle";
  const complete = step === 3;
  const question = ["¿Gato o perro?", "¿Cómo se llama tu mascota?", `¿De qué raza es ${name}?`, `¡Un gusto, ${name}!`][step];

  useEffect(function focusQuestion() {
    if (hasNavigated.current && phase === "idle") heading.current?.focus({ preventScroll: true });
  }, [step, phase]);

  useEffect(function syncReducedMotion() {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    function handlePreferenceChange() {
      if (preference.matches && pendingStep.current !== null) {
        setStep(pendingStep.current);
        pendingStep.current = null;
        setError("");
        setPhase("idle");
      }
    }
    preference.addEventListener("change", handlePreferenceChange);
    return function cleanupPreference() { preference.removeEventListener("change", handlePreferenceChange); };
  }, []);

  function goToStep(next: number) {
    if (pendingStep.current !== null || next === step) return;
    hasNavigated.current = true;
    setDirection(next > step ? "forward" : "backward");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setError("");
      setStep(next);
      return;
    }
    pendingStep.current = next;
    setPhase("exiting");
  }

  function handleSlideEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || pendingStep.current === null) return;
    if (phase === "exiting") {
      setStep(pendingStep.current);
      setError("");
      setPhase("entering");
    } else if (phase === "entering") {
      pendingStep.current = null;
      setPhase("idle");
    }
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
    setError("");
  }

  function handleSpeciesChoice(event: MouseEvent<HTMLButtonElement>) {
    const next = event.currentTarget.value;
    if (next !== "cat" && next !== "dog") return;
    if (next !== species) setBreed("");
    setSpecies(next);
    goToStep(1);
  }

  function handleBreedChange(value: string) {
    setBreed(value);
    setError("");
  }

  function handleBack() { goToStep(Math.max(0, step - 1)); }
  function handleEdit() { goToStep(0); }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) {
      if (!name.trim()) {
        setError("Escribí el nombre de tu mascota para continuar.");
        form.current?.querySelector<HTMLInputElement>("[name=petName]")?.focus();
        return;
      }
      setName(name.trim());
      goToStep(2);
    } else if (step === 2) {
      if (!breed) {
        setError("Elegí una sugerencia, agregá tu raza o seleccioná «No lo sé».");
        form.current?.querySelector<HTMLInputElement>("[name=breed]")?.focus();
        return;
      }
      goToStep(3);
    }
  }

  return (
    <div className={styles.questionnaire}>
      <form ref={form} className={styles.form} onSubmit={handleSubmit} noValidate aria-labelledby="pet-question" aria-busy={transitioning}>
        <div className={styles.stageViewport}>
        <div className={styles.stage} key={step} data-direction={direction} data-phase={phase} onAnimationEnd={handleSlideEnd} inert={transitioning}>
          <p className={styles.stepCount} aria-live="polite">{complete ? "Todo listo" : `Pregunta ${step + 1} de 3`}</p>
          <h2 id="pet-question" ref={heading} className={styles.question} tabIndex={-1}>{question}</h2>

          {step === 1 && (
            <div className={styles.answer}>
              <label className="sr-only" htmlFor="pet-name">Nombre de tu mascota</label>
              <div className={styles.nameField}>
                <input id="pet-name" className={styles.nameInput} name="petName" value={name} onChange={handleNameChange}
                  placeholder="Su nombre va aquí" autoComplete="off" maxLength={60} required
                  aria-invalid={Boolean(error)} aria-describedby={error ? "pet-name-error" : undefined} />
              </div>
              {error && <p id="pet-name-error" className={styles.error} role="alert">{error}</p>}
            </div>
          )}

          {step === 0 && (
            <div className={styles.answer}>
              <p className={styles.hint}>Elegí una opción para continuar.</p>
              <div className={styles.speciesChoices}>
                <button type="button" value="cat" onClick={handleSpeciesChoice} aria-pressed={species === "cat"}>
                  <Cat size={64} strokeWidth={1.25} aria-hidden="true" /><span>Gato</span>
                  <ArrowRight className={styles.choiceArrow} size={24} aria-hidden="true" />
                </button>
                <button type="button" value="dog" onClick={handleSpeciesChoice} aria-pressed={species === "dog"}>
                  <Dog size={64} strokeWidth={1.25} aria-hidden="true" /><span>Perro</span>
                  <ArrowRight className={styles.choiceArrow} size={24} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && species && (
            <div className={styles.answer}>
              <BreedCombobox key={species} species={species} value={breed} onChange={handleBreedChange} error={error} revealed={phase !== "entering"} />
            </div>
          )}

          {complete && (
            <div className={styles.answer}>
              <p className={styles.hint}>Así se ve su perfil. Podés revisar tus respuestas antes de seguir.</p>
              <dl className={styles.summary}>
                <div><dt>Nombre</dt><dd>{name}</dd></div>
                <div><dt>Especie</dt><dd>{species === "cat" ? "Gato" : "Perro"}</dd></div>
                <div><dt>Raza</dt><dd>{breed}</dd></div>
              </dl>
            </div>
          )}
        </div>
        </div>

        <div className={styles.controls} inert={transitioning}>
          {step > 0 && !complete ? (
            <button type="button" className={styles.back} onClick={handleBack} aria-label="Volver a la pregunta anterior">
              <ArrowLeft size={20} aria-hidden="true" /><span>Anterior</span>
            </button>
          ) : complete ? (
            <button type="button" className={styles.back} onClick={handleEdit} aria-label="Editar respuestas">
              <Pencil size={20} aria-hidden="true" /><span>Editar respuestas</span>
            </button>
          ) : <a className={styles.skip} href="#explorar">Prefiero explorar</a>}
          {(step === 1 || step === 2) && (
            <button type="submit" className={styles.next} aria-label={step === 2 ? "Ver perfil" : "Continuar"}>
              <span>{step === 2 ? "Ver perfil" : "Continuar"}</span><ArrowRight size={24} aria-hidden="true" />
            </button>
          )}
          {complete && <a className={styles.next} href="#explorar" aria-label="Continuar explorando"><span>Continuar explorando</span><ArrowRight size={24} aria-hidden="true" /></a>}
        </div>
      </form>
    </div>
  );
}
