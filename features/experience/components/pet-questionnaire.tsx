"use client";

import { useEffect, useRef, useState, useTransition, type AnimationEvent, type ChangeEvent, type FormEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LoaderCircle, PawPrint, Pencil, Plus } from "lucide-react";
import { PetSpeciesImage } from "@/components/pet-species-image";
import type { PetSpecies } from "../data/pet-breeds";
import { MAX_PETS, upsertPet, type PetProfile } from "../data/pet-profiles";
import { savePetProfiles } from "../data/pet-storage";
import { BreedCombobox } from "./breed-combobox";
import { PetProfileCard } from "./pet-profile-card";
import { SavedPetProfile } from "./saved-pet-profile";
import styles from "./pet-questionnaire.module.css";

export function PetQuestionnaire({ initialPets = [] }: { initialPets?: PetProfile[] }) {
  const lastPet = initialPets.at(-1);
  const router = useRouter();
  const [navigating, startNavigation] = useTransition();
  const [saveError, setSaveError] = useState("");
  const [step, setStep] = useState(initialPets.length > 1 ? 4 : lastPet ? 3 : 0);
  const [name, setName] = useState(lastPet?.name ?? "");
  const [species, setSpecies] = useState<PetSpecies | null>(lastPet?.species ?? null);
  const [breed, setBreed] = useState(lastPet?.breed ?? "");
  const [error, setError] = useState("");
  const [pets, setPets] = useState<PetProfile[]>(initialPets);
  const [editingPetId, setEditingPetId] = useState<string | null>(lastPet?.id ?? null);
  const [reviewedPet, setReviewedPet] = useState<PetProfile | null>(lastPet ?? null);
  const nextPetId = useRef(0);
  const collectionReturnStep = useRef(3);
  const [direction, setDirection] = useState<"forward" | "backward" | "none">("none");
  const [phase, setPhase] = useState<"idle" | "exiting" | "entering">("idle");
  const pendingStep = useRef<number | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const hasNavigated = useRef(false);
  const transitioning = phase !== "idle";
  const complete = step === 3;
  const viewingPets = step === 4;
  const question = ["¿Gato o perro?", "¿Cómo se llama tu mascota?", `¿De qué raza es ${name}?`, `¡Un gusto, ${reviewedPet?.name ?? name}!`, "Tus mascotas"][step];
  const limitReached = pets.length >= MAX_PETS;

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

  function handleBack() {
    goToStep(viewingPets ? collectionReturnStep.current : Math.max(0, step - 1));
    if (viewingPets) form.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }
  function handleEdit() { goToStep(0); }

  function handleContinue() {
    if (pendingStep.current !== null || navigating || pets.length === 0) return;
    setSaveError("");
    try {
      savePetProfiles(pets);
      startNavigation(function openMyPets() { router.push("/mis-mascotas"); });
    } catch {
      setSaveError("No pudimos guardar tus mascotas en este navegador. Tus respuestas siguen aquí. Revisá el almacenamiento e intentá de nuevo.");
    }
  }

  function handleViewPets() {
    if (pendingStep.current !== null || pets.length < 2) return;
    collectionReturnStep.current = step;
    goToStep(4);
    form.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }

  function handleAddPet() {
    if (pendingStep.current !== null || limitReached) return;
    setName("");
    setSpecies(null);
    setBreed("");
    setEditingPetId(null);
    goToStep(0);
    if (viewingPets) form.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }

  function handleEditPet(pet: PetProfile) {
    if (pendingStep.current !== null) return;
    setName(pet.name);
    setSpecies(pet.species);
    setBreed(pet.breed);
    setEditingPetId(pet.id);
    setError("");
    goToStep(0);
    form.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pendingStep.current !== null) return;
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
      if (!species) return;
      if (editingPetId === null && limitReached) {
        setError("No se pueden agregar más mascotas.");
        return;
      }
      let id = editingPetId;
      if (id === null) {
        do { id = `pet-${++nextPetId.current}`; } while (pets.some((pet) => pet.id === id));
      }
      const pet: PetProfile = { id, name: name.trim(), species, breed };
      setPets((profiles) => upsertPet(profiles, pet));
      setEditingPetId(pet.id);
      setReviewedPet(pet);
      goToStep(3);
    }
  }

  return (
    <div className={styles.questionnaire}>
      <form ref={form} className={styles.form} onSubmit={handleSubmit} noValidate aria-labelledby="pet-question" aria-busy={transitioning}>
        <div className={styles.stageViewport}>
        <div className={styles.stage} key={step} data-direction={direction} data-phase={phase} onAnimationEnd={handleSlideEnd} inert={transitioning}>
          <p className={styles.stepCount} aria-live="polite">{viewingPets ? "Tus perfiles" : complete ? "Todo listo" : `Pregunta ${step + 1} de 3`}</p>
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
              <div className={styles.speciesChoices}>
                <button type="button" value="cat" onClick={handleSpeciesChoice} aria-pressed={species === "cat"}>
                  <PetSpeciesImage species="cat" alt="" /><span>Gato</span>
                  <ArrowRight className={styles.choiceArrow} size={24} aria-hidden="true" />
                </button>
                <button type="button" value="dog" onClick={handleSpeciesChoice} aria-pressed={species === "dog"}>
                  <PetSpeciesImage species="dog" alt="" /><span>Perro</span>
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

          {complete && reviewedPet && (
            <div className={styles.answer}>
              <p className={styles.hint}>Así se ve su perfil. Podés revisar tus respuestas antes de seguir.</p>
              <PetProfileCard name={reviewedPet.name} species={reviewedPet.species} breed={reviewedPet.breed} revealed={phase !== "entering"} />
            </div>
          )}
          {viewingPets && (
            <div className={styles.petCollection}>
              {pets.map((pet) => <SavedPetProfile pet={pet} onEdit={handleEditPet} key={pet.id} />)}
            </div>
          )}
        </div>
        </div>

        <div className={styles.controls} inert={transitioning || navigating}>
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
          {(complete || viewingPets) && !limitReached && (
            <button type="button" className={`${styles.back} ${styles.addPet}`} onClick={handleAddPet}
              aria-label="Agregar otra mascota">
              <Plus size={20} aria-hidden="true" /><span>Agregar otra mascota</span>
            </button>
          )}
          {!viewingPets && pets.length >= 2 && (
            <button type="button" className={styles.back} onClick={handleViewPets} aria-label="Ver mis mascotas">
              <PawPrint size={20} aria-hidden="true" /><span>Ver mis mascotas</span>
            </button>
          )}
          {(viewingPets || (complete && pets.length === 1)) && (
            <button type="button" className={styles.next} onClick={handleContinue} disabled={navigating}
              aria-label={navigating ? "Abriendo mis mascotas" : "Continuar"}>
              <span>{navigating ? "Abriendo…" : "Continuar"}</span>
              {navigating ? <LoaderCircle className={styles.spinner} size={24} aria-hidden="true" /> : <ArrowRight size={24} aria-hidden="true" />}
            </button>
          )}
        </div>
        <p className="sr-only" role="status">{navigating ? "Abriendo mis mascotas…" : ""}</p>
        {saveError && <p className={styles.error} role="alert">{saveError}</p>}
      </form>
    </div>
  );
}
