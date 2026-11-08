import Image from "next/image";
import type { CatalogListing } from "../lib/browse-catalog";
import styles from "./catalog-page.module.css";

const money = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });

export function CatalogProductPreview({ product, headingLevel = 4 }: { product: CatalogListing; headingLevel?: 3 | 4 }) {
  const Heading = `h${headingLevel}` as const;
  return (
    <li className={styles.preview}>
      <article>
        <div className={styles.previewImage}>
          {product.imageUrl
            ? <Image src={product.imageUrl} alt={product.imageAlt} fill sizes="(max-width: 640px) 70vw, (max-width: 1024px) 36vw, 300px" />
            : <span className={styles.imageFallback} aria-hidden="true">DN</span>}
        </div>
        <div className={styles.previewDetails}>
          <Heading>{product.name}</Heading>
          <p>{product.offer.price !== null
            ? <>{product.offer.fromPrice && <span>Desde </span>}{money.format(product.offer.price)}</>
            : "Precio a consultar"}</p>
          {!product.offer.inStock && <p className={styles.unavailable}>Agotado</p>}
        </div>
      </article>
    </li>
  );
}
