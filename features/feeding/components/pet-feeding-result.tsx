import Link from "next/link";
import { ChevronDown, CalendarDays, MessageCircle, Scale } from "lucide-react";
import { ArrowCta } from "@/components/arrow-cta";
import { PetSpeciesImage } from "@/components/pet-species-image";
import contact from "@/features/contact/data/contact.json";
import { getBreedArtwork } from "@/features/experience/data/pet-breeds";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { answerLabel, type FeedingAnswers } from "../data/questions";
import type { FeedingResult } from "../lib/result";
import { FeedingPackageComparison } from "./feeding-package-comparison";
import styles from "./feeding-results.module.css";

type Props = { result: FeedingResult; days: number; pet: PetProfile; answers: FeedingAnswers };

export function PetFeedingResult({ result, days, pet, answers }: Props) {
  const activity = answerLabel("activity", answers[`${pet.id}.activity`]);
  const gramsPerMeal = result.meals && result.dailyGrams ? Math.round(result.dailyGrams / result.meals * 10) / 10 : null;

  return <section className={styles.petResult} aria-label={`Plan de ${result.name}`}>
    <div className={styles.portionBand}>
      <header className={styles.portionIdentity}>
        <p className={styles.overline}>{result.review ? "Acompañamiento individual" : "Su punto de partida"}</p>
        <h2>{result.review ? `Conozcamos mejor a ${result.name}.` : `La porción de ${result.name}.`}</h2>
        <p className={styles.breed}>{pet.breed}</p>
      </header>
      <div className={styles.portionCopy}>
        {result.review ? <>
          <p>{result.review}</p>
          <p>Conversemos antes de elegir un paquete. Nuestro equipo puede ayudarte con el siguiente paso.</p>
          <ArrowCta label="Consultar con DNAture" href={contact.whatsapp.url} target="_blank" rel="noopener noreferrer" className={styles.consultCta} />
          <Link href="/alianzas" className={styles.allies}>Conocer profesionales aliados</Link>
        </> : <>
          <p className={styles.portionValue}><strong>{result.dailyGrams} g</strong><span>al día<br />porción estimada</span></p>
          {gramsPerMeal !== null && <p className={styles.mealSplit}><strong>{gramsPerMeal} g por comida</strong> · {result.meals} {result.meals === 1 ? "comida al día" : "comidas al día"}</p>}
          <dl className={styles.facts}>
            <div><dt>Peso actual</dt><dd>{answerLabel("weight", answers[`${pet.id}.weight`])}</dd></div>
            <div><dt>Edad</dt><dd>{answerLabel("age", answers[`${pet.id}.age`])}</dd></div>
            <div><dt>Actividad</dt><dd>{activity}</dd></div>
          </dl>
        </>}
      </div>
      <div className={styles.portrait}><PetSpeciesImage species={pet.species} src={getBreedArtwork(pet.species, pet.breed)} alt="" size={320} /><span>Su esencia es única.</span></div>
    </div>
    {!result.review && <>
      <details className={styles.portionDetails}>
        <summary><span><Scale size={18} aria-hidden="true" />Cómo estimamos su porción</span><ChevronDown size={18} aria-hidden="true" /></summary>
        <div>
          <p>Partimos de su peso, condición corporal, actividad y esterilización. Nos contaste: {answerLabel("body", answers[`${pet.id}.body`]).toLowerCase()}, actividad {activity.toLowerCase()} y {answers[`${pet.id}.neutered`] === "yes" ? "con" : "sin"} esterilización.</p>
          {result.rawDailyGrams !== result.dailyGrams && <p>Estimación inicial: {Math.round(result.rawDailyGrams! * 10) / 10} g. Porción práctica: {result.dailyGrams} g.</p>}
          <p>Es una estimación orientativa del calculador DNAture. Revisá su evolución y ajustá la porción con un profesional.</p>
        </div>
      </details>
      <section className={styles.comparison} aria-label={`Paquetes para ${result.name}`}>
        <header className={styles.comparisonHeader}>
          <div><p className={styles.overline}>Elegí cómo acompañar su rutina</p><h2>Una misma porción.<br /><span>Cuatro posibilidades.</span></h2></div>
          <div className={styles.periodInfo}><p><CalendarDays size={20} aria-hidden="true" /><strong>Para {days} días</strong></p><p>Las cantidades están calculadas para {result.name}. Compará qué suma cada propuesta.</p></div>
        </header>
        <p className={styles.priceNote}>Precios con IVA del 13%. Envío aparte. Los paquetes por completar muestran únicamente el monto parcial cotizado.</p>
        <FeedingPackageComparison result={result} days={days} />
        <p className={styles.orderNote}><MessageCircle size={20} aria-hidden="true" /><span>Tu elección abre WhatsApp con el resumen del paquete. Confirmamos precios, existencias y entrega antes de comprar. No se realiza ningún cobro aquí.</span></p>
        <p className={styles.guidance}>La porción es orientativa. El sobrante de los envases no aumenta su ración; huevos, snacks y suplementos tienen pautas propias. Encontralas en los detalles de cada paquete.</p>
      </section>
      <footer className={styles.support}>
        <div><p className={styles.overline}>Lo elegimos juntos</p><h2>¿Cuál va mejor con {result.name}?</h2><p>Si tenés dudas, conversemos sobre las opciones y su rutina.</p></div>
        <ArrowCta label="Ayudame a elegir" href={contact.whatsapp.url} target="_blank" rel="noopener noreferrer" tone="light" />
      </footer>
    </>}
  </section>;
}
