import Link from "next/link";
import contact from "@/features/contact/data/contact.json";
import type { FeedingResult } from "../lib/result";
import { FeedingPackage } from "./feeding-package";
import styles from "./feeding.module.css";

export function PetFeedingResult({ result, days }: { result: FeedingResult; days: number }) {
  return <section className={styles.result} aria-label={`Plan de ${result.name}`}>
    <h2>{result.name}</h2>
    {result.review ? <div className={styles.notice}><p>{result.review}</p><p><a href={contact.whatsapp.url} target="_blank" rel="noopener noreferrer">Consultar con DNAture</a> · <Link href="/alianzas">Conocer profesionales aliados</Link></p></div> : <>
      <div className={styles.portion}><p><strong>{result.dailyGrams} g</strong> al día</p><p>Aproximadamente {Math.round(result.dailyGrams! / result.meals * 10) / 10} g por comida, repartidos en {result.meals} {result.meals === 1 ? "comida" : "comidas"}.</p>
        {result.rawDailyGrams !== result.dailyGrams && <p>Estimación inicial: {Math.round(result.rawDailyGrams! * 10) / 10} g. Porción práctica: {result.dailyGrams} g.</p>}
      </div>
      <p>Estimación orientativa del calculador DNAture. Revisá su evolución y la porción con un profesional. Los sobrantes de los envases no aumentan la ración; huevos, snacks y suplementos tienen pautas propias.</p>
      <div className={styles.packages}>{result.packages.map((pack) => <FeedingPackage pack={pack} days={days} key={pack.id} />)}</div>
    </>}
  </section>;
}
