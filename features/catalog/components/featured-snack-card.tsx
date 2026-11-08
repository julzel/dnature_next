import Image from "next/image";
import type { FeaturedSnack } from "../lib/featured-snacks";
import styles from "./best-selling-snacks.module.css";

const money = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });

export function FeaturedSnackCard({ snack }: { snack: FeaturedSnack }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={snack.imageUrl}
          alt={snack.imageAlt}
          fill
          sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 45vw, 22vw"
          className={styles.image}
        />
      </div>
      <div className={styles.details}>
        <p className={styles.family}>Snack deshidratado</p>
        <h3>{snack.name}</h3>
        <p className={styles.price}>{snack.fromPrice && <span>Desde </span>}{money.format(snack.price)}</p>
      </div>
    </article>
  );
}
