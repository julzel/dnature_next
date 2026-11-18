"use client";

import { Select } from "@/components/select";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { feedingGroups, type FeedingAnswers } from "../data/questions";
import { feedingPayload, missingGroup, readFeedingDraft } from "../lib/feeding-draft";
import { DRAFT_KEY, feedingPetSchema, quoteRequestSchema } from "../lib/intake";
import { answersFromPlans, plansFromQuote, reusablePlan, type SavedFeedingPlan } from "../lib/saved-feeding-plans";
import { PetFeedingFields } from "./pet-feeding-fields";
import { FeedingResults } from "./feeding-results";
import { FeedingWelcome } from "./feeding-welcome";
import { FeedingPetSidebar } from "./feeding-pet-sidebar";
import { FeedingStepNav } from "./feeding-step-nav";
import { FeedingPetReview } from "./feeding-pet-review";
import styles from "./feeding.module.css";

type Props = {
  pets: PetProfile[];
  savedPlans: SavedFeedingPlan[];
  onSave: (plans: SavedFeedingPlan[]) => void;
  onShowPets: () => void;
  fromDashboard: boolean;
};

export function FeedingWorkflow({ pets, savedPlans, onSave, onShowPets, fromDashboard }: Props) {
  const Heading = fromDashboard ? "h3" : "h1";
  const flow = pets.flatMap((pet, petIndex) => (pet.species === "dog" ? feedingGroups : [feedingGroups[0]]).map((_, group) => ({ petIndex, group })));
  const draftKey = fromDashboard ? `${DRAFT_KEY}.${pets[0].id}` : DRAFT_KEY;
  const [initialPlan] = useState(() => fromDashboard ? savedPlans.find((plan) => plan.pet.id === pets[0].id) : undefined);
  const [saved] = useState(() => {
    const scoped = readFeedingDraft(pets, draftKey);
    if (!fromDashboard || initialPlan || scoped.step >= 0 || scoped.error) return scoped;
    // A pet added to an existing group can still have answers in the original group draft.
    return { ...readFeedingDraft(pets), step: 0 };
  });
  const [answers, setAnswers] = useState(() => ({
    days: String(initialPlan?.days ?? 28),
    ...answersFromPlans(initialPlan ? [initialPlan] : []),
    ...saved.values,
  }));
  const [step, setStep] = useState(() => saved.step >= 0 ? Math.min(saved.step, flow.length) : initialPlan ? flow.length : fromDashboard ? 0 : -1);
  const [editingReview, setEditingReview] = useState(false);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState(saved.error);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ plans: SavedFeedingPlan[]; freshIds: string[] } | null>(null);
  const [editedPetId, setEditedPetId] = useState<string>();
  const heading = useRef<HTMLHeadingElement>(null);
  const controller = useRef<AbortController | null>(null);
  const focusRequested = useRef(false);
  const current = flow[step];
  const pet = current ? pets[current.petIndex] : undefined;
  const reviewing = step === flow.length;
  const needsQuote = reviewing && pets.some((pet) => {
    const parsed = feedingPetSchema.safeParse(feedingPayload(pet, answers));
    return !parsed.success || !reusablePlan(parsed.data, savedPlans);
  });

  useEffect(function cancelOnLeave() { return () => controller.current?.abort(); }, []);
  useEffect(function focusStep() {
    if (focusRequested.current) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
      focusRequested.current = false;
    }
  }, [step, result]);

  function persist(values: FeedingAnswers, nextStep: number) {
    const draft: FeedingAnswers = { ...values, _step: String(nextStep) };
    for (const profile of pets) draft[`${profile.id}._identity`] = JSON.stringify(profile);
    try { sessionStorage.setItem(draftKey, JSON.stringify(draft)); setStorageError(""); }
    catch { setStorageError("Podés continuar, pero este navegador no permite guardar las respuestas al recargar."); }
  }
  function goTo(next: number) {
    setError(""); focusRequested.current = true;
    setStep(next); persist(answers, next);
  }
  function handleAnswers(event: FormEvent<HTMLFormElement>) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement) || !target.name) return;
    handleAnswerChange(target.name, target.value);
  }
  function handleAnswerChange(name: string, value: string) { const updated = { ...answers, [name]: value }; setAnswers(updated); persist(updated, step); }
  function handleDays(value: string) { handleAnswerChange("days", value); }
  function handleStart() { goTo(0); }
  function handlePrevious() {
    if (fromDashboard && editingReview) { setEditingReview(false); goTo(flow.length); return; }
    if (fromDashboard && step === 0) { onShowPets(); return; }
    goTo(Math.max(-1, step - 1));
  }
  function handleNext(event: FormEvent<HTMLFormElement>) { event.preventDefault(); goTo(editingReview ? flow.length : step + 1); setEditingReview(false); }
  function handleEdit(petIndex: number, group: number) { if (reviewing) setEditingReview(true); goTo(flow.findIndex((item) => item.petIndex === petIndex && item.group === group)); }
  function handlePetSelect(petIndex: number) { handleEdit(petIndex, Math.max(0, missingGroup(pets[petIndex], answers) ?? 0)); }
  function handleGroupSelect(group: number) { if (current) handleEdit(current.petIndex, group); }
  function handleReturnToReview() { setResult(null); goTo(flow.length); }
  function handleEditAllergies(petId: string) {
    const allergyGroup = feedingGroups.findIndex(({ keys }) => keys.some((key) => key === "allergyStatus"));
    setEditedPetId(petId);
    setResult(null);
    handleEdit(pets.findIndex(({ id }) => id === petId), allergyGroup);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    for (let index = 0; index < pets.length; index++) {
      const group = missingGroup(pets[index], answers);
      if (group !== null) { handleEdit(index, Math.max(0, group)); setError(`Completá los datos de ${pets[index].name} para continuar.`); return; }
    }
    const parsed = quoteRequestSchema.safeParse({ days: Number(answers.days ?? "28"), pets: pets.map((item) => feedingPayload(item, answers)) });
    if (!parsed.success) { setError("Revisá las respuestas y la duración de los paquetes para continuar."); return; }
    const plans = new Map<string, SavedFeedingPlan>();
    const unquoted = parsed.data.pets.filter((pet) => {
      const saved = reusablePlan(pet, savedPlans);
      if (!saved) return true;
      plans.set(pet.id, saved);
      return false;
    });

    function finishQuote(freshPlans: SavedFeedingPlan[]) {
      for (const plan of freshPlans) plans.set(plan.pet.id, plan);
      const ordered = pets.map((pet) => plans.get(pet.id)!);
      onSave(ordered);
      if (fromDashboard) return;
      focusRequested.current = true;
      setResult({ plans: ordered, freshIds: freshPlans.map((plan) => plan.pet.id) });
    }

    persist(answers, step);
    setError("");
    if (!unquoted.length) { finishQuote([]); return; }
    setPending(true);
    controller.current?.abort();
    const request = new AbortController(); controller.current = request;
    try {
      const response = await fetch("/api/feeding/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ days: parsed.data.days, pets: unquoted }), signal: request.signal });
      const value = await response.json();
      if (!response.ok) throw new Error(value.message || "No pudimos calcular los paquetes. Intentá de nuevo.");
      if (request.signal.aborted) return;
      finishQuote(plansFromQuote(value, unquoted));
    } catch (failure) {
      if (!request.signal.aborted) setError(failure instanceof Error ? failure.message : "No pudimos calcular los paquetes. Intentá de nuevo.");
    } finally { if (!request.signal.aborted) setPending(false); }
  }

  return <div className={fromDashboard ? styles.drawerFlow : undefined}>
    {step === -1 && !result ? <FeedingWelcome headingRef={heading} pets={pets} onStart={handleStart} /> : result ? <FeedingResults plans={result.plans} freshIds={result.freshIds} pets={pets} answers={answers} headingRef={heading} onEdit={handleReturnToReview} onEditAllergies={handleEditAllergies} initialPetId={editedPetId} onShowPets={onShowPets} /> : reviewing ? <>
      {!fromDashboard && <p className={styles.kicker}>Cada detalle cuenta</p>}
      <Heading tabIndex={-1} ref={heading}>{fromDashboard ? "Revisá sus datos" : "Así es tu manada."}</Heading>
      {!fromDashboard && <p>Revisá sus datos. Estamos a un paso de conocer su porción y sus paquetes.</p>}
      <form onSubmit={handleSubmit} onChange={handleAnswers} aria-label="Revisar datos y preparar paquetes" aria-busy={pending}>
        <fieldset disabled={pending} className={styles.formFields}><legend className="sr-only">Revisión de tus mascotas</legend>
          {pets.map((item, index) => <FeedingPetReview key={item.id} pet={item} index={index} answers={answers} onEdit={handleEdit} />)}
          <div className={styles.reviewFinish}>
            {needsQuote && <Select className={styles.period} label="Duración del paquete" name="days" value={answers.days ?? "28"} onValueChange={handleDays} options={[{ value: "14", label: "14 días" }, { value: "28", label: "28 días" }]} />}
            <p>{needsQuote ? "Las porciones son estimaciones. Si hay crecimiento, una condición de salud o alergias, te orientaremos hacia una revisión individual." : "Tu propuesta guardada se conserva si los datos que influyen en su alimentación siguen iguales."}</p>
            <button type="submit" className={styles.primary}>{pending ? "Preparando sus paquetes…" : fromDashboard ? (needsQuote ? "Guardar y estimar porción" : "Guardar datos de alimentación") : needsQuote ? "Estimar porción y ver paquetes" : "Guardar y ver propuesta"}<ArrowRight size={20} aria-hidden="true" /></button>
          </div>
        </fieldset>
      </form>
    </> : pet && current ? <div className={styles.journey}>
      {!fromDashboard && <FeedingPetSidebar pets={pets} petIndex={current.petIndex} answers={answers} onSelect={handlePetSelect} />}
      <div className={styles.questionPane}>
        {pet.species === "dog" && <FeedingStepNav group={current.group} onSelect={handleGroupSelect} />}
        <div className={styles.stepContent} key={`${pet.id}-${current.group}`}>
          {!fromDashboard && <p className={styles.kicker}>{pet.name} · {pet.species === "dog" ? `Paso ${current.group + 1} de 3` : "Atención personalizada"}</p>}
          <Heading tabIndex={-1} ref={heading}>{pet.species === "dog" ? feedingGroups[current.group].title : `Un camino para ${pet.name}`}</Heading>
          <p className={styles.stepIntro}>{pet.species === "dog" ? feedingGroups[current.group].description : "Cada especie tiene necesidades distintas. Nuestro equipo te acompañará para definir la alimentación de tu gato; la estimación automática de esta visita es para perros."}</p>
          <form onSubmit={handleNext} onChange={handleAnswers} aria-label={`Datos de ${pet.name}`}>
            {pet.species === "dog" && <PetFeedingFields onAnswerChange={handleAnswerChange} pet={pet} group={current.group} answers={answers} />}
            <div className={styles.actions}>
              <button className={styles.backButton} type="button" onClick={handlePrevious} aria-label="Volver al paso anterior"><ArrowLeft size={20} aria-hidden="true" /><span>Volver</span></button>
              <button type="submit" className={styles.primary}>{editingReview ? "Guardar y revisar" : step + 1 === flow.length ? "Revisar sus datos" : flow[step + 1].petIndex !== current.petIndex ? `Continuar con ${pets[flow[step + 1].petIndex].name}` : "Continuar"}<ArrowRight size={20} aria-hidden="true" /></button>
            </div>
          </form>
        </div>
        {!fromDashboard && <Link href="/#experiencia-personalizada" className={styles.quietLink}>Editar o agregar mascotas</Link>}
      </div>
    </div> : null}
    <p role="status" aria-live="polite" className={styles.status}>{pending ? "Estamos calculando con los precios y las existencias actuales." : storageError}</p>
    {error && <p role="alert" className={styles.notice}>{error}</p>}
  </div>;
}
