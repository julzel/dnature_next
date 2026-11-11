import Link from "next/link";
import { connection } from "next/server";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedSnacks } from "../server/featured-snacks";
import { FeaturedSnackCard } from "./featured-snack-card";
import { FeaturedSnacksRetry } from "./featured-snacks-retry";
import styles from "./best-selling-snacks.module.css";

export async function BestSellingSnacks() {
  await connection();
  let snacks;
  try {
    snacks = await getFeaturedSnacks();
  } catch {
    return (
      <div className={styles.message} role="alert">
        <h2>Variedad de deshidratados</h2>
        <p>No pudimos cargar los productos en este momento.</p>
        <FeaturedSnacksRetry />
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <div className={styles.intro}>
        <h2>Variedad de deshidratados</h2>
      </div>
      {snacks.length ? (
        <ul className={styles.grid}>
          {snacks.map((snack) => <FeaturedSnackCard key={snack.sku} snack={snack} />)}
        </ul>
      ) : <p className={styles.message} role="status">No hay deshidratados disponibles para mostrar ahora.</p>}
      <Link className={styles.catalogLink} href="/productos?categoria=deshidratados" prefetch={false}>Explorar deshidratados <ArrowUpRight size={22} aria-hidden="true" /></Link>
    </div>
  );
}
