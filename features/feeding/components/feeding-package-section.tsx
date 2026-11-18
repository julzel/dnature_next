import { CalendarDays, MessageCircle } from "lucide-react";
import type { FeedingResult } from "../lib/result";
import { FeedingPackageComparison } from "./feeding-package-comparison";
import styles from "./feeding-results.module.css";

export function FeedingPackageSection({ result, days, savedDate }: { result: FeedingResult; days: number; savedDate?: string }) {
  return <section className={savedDate ? `${styles.results} ${styles.comparison}` : styles.comparison} aria-label={`Paquetes para ${result.name}`}>
    {savedDate ? <p className={styles.priceNote}>Propuesta del {savedDate} · {days} días. Incluye IVA del 13%. Confirmá precios, existencias y entrega por WhatsApp.</p> : <>
      <header className={styles.comparisonHeader}>
        <div><p className={styles.overline}>Elegí cómo acompañar su rutina</p><h2>Una misma porción.<br /><span>Cuatro posibilidades.</span></h2></div>
        <div className={styles.periodInfo}><p><CalendarDays size={20} aria-hidden="true" /><strong>Para {days} días</strong></p><p>Las cantidades están calculadas para {result.name}. Compará qué suma cada propuesta.</p></div>
      </header>
      <p className={styles.priceNote}>Precios con IVA del 13%. Envío aparte. Los paquetes por completar muestran únicamente el monto parcial cotizado.</p>
    </>}
    <FeedingPackageComparison result={result} days={days} savedDate={savedDate} />
    {!savedDate && <p className={styles.orderNote}><MessageCircle size={20} aria-hidden="true" /><span>Tu elección abre WhatsApp con el resumen del paquete. Confirmamos precios, existencias y entrega antes de comprar. No se realiza ningún cobro aquí.</span></p>}
    <p className={styles.guidance}>La porción es orientativa. El sobrante de los envases no aumenta su ración; huevos, snacks y suplementos tienen pautas propias. Encontralas en los detalles de cada paquete.</p>
  </section>;
}
