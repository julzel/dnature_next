import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { FeaturedSnack } from "../lib/featured-snacks";
import { formatCatalogPrice } from "../lib/catalog-money";
import styles from "./best-selling-snacks.module.css";
import catalogStyles from "./catalog-page.module.css";

export function FeaturedSnackCard({ snack }: { snack: FeaturedSnack }) {
  return (
    <li className={catalogStyles.preview}>
      <article>
        <Link href={snack.path} prefetch={false} className={catalogStyles.previewImage} aria-label={`Ver ${snack.name}`}>
          <Image
            src={snack.imageUrl}
            alt={snack.imageAlt}
            fill
            sizes="(max-width: 639px) 32vw, (max-width: 1099px) 46vw, (max-width: 1343px) 23vw, 302px"
          />
        </Link>
        <div className={catalogStyles.previewDetails}>
          <p className={`${catalogStyles.productCategory} ${styles.category}`}>Deshidratados</p>
          <h3><Link href={snack.path} prefetch={false}>{snack.name}</Link></h3>
          <p className={catalogStyles.price}>{snack.fromPrice && <span>Desde </span>}{formatCatalogPrice(snack.price)}</p>
          <p className={catalogStyles.availability}>Disponible</p>
        </div>
        <Link className={styles.productLink} href={snack.path} prefetch={false}>
          <span>Ver producto<span className="sr-only">: {snack.name}</span></span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </article>
    </li>
  );
}
