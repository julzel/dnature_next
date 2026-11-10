import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { categoryStyle, type CatalogCategory, type CatalogListing } from "../lib/browse-catalog";
import styles from "./catalog-page.module.css";

const money = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });

export function CatalogProductPreview({ product, categories = [], headingLevel = 3, imageSizes }: { product: CatalogListing; categories?: CatalogCategory[]; headingLevel?: 3 | 4; imageSizes?: string }) {
  const Heading = `h${headingLevel}` as const;
  const category = categories.find(({ id }) => product.categoryIds.includes(id));
  return (
    <li className={styles.preview} style={category ? categoryStyle(category) : undefined}>
      <article>
        <div className={styles.previewImage} style={{ aspectRatio: product.imageAspectRatio }}>
          {product.imageUrl
            ? <Image src={product.imageUrl} alt={product.imageAlt} fill sizes={imageSizes ?? "(max-width: 639px) calc(100vw - 32px), (max-width: 899px) calc((100vw - 72px) / 2), (max-width: 1023px) calc((100vw - 328px) / 2), (max-width: 1279px) calc((100vw - 344px) / 2), (max-width: 1343px) calc((100vw - 384px) / 3), 320px"} />
            : <span className={styles.imageFallback} aria-hidden="true">DN</span>}
        </div>
        <div className={styles.previewDetails}>
          {category && <p className={styles.productCategory}>{category.label}</p>}
          <Heading>{product.name}</Heading>
          <p className={styles.price}>{product.offer.price !== null ? <>{product.offer.fromPrice && <span>Desde </span>}{money.format(product.offer.price)}</> : "Precio a consultar"}</p>
          <p className={styles.availability}>{product.offer.inStock ? "Disponible" : "Agotado"}{product.variants.length > 1 ? ` · ${product.variants.length} presentaciones` : ""}</p>
        </div>
        {(product.ingredients || product.variants.length > 0) && <details className={styles.productFacts}>
          <summary>Ver detalles<span className="sr-only"> de {product.name}</span><ChevronDown size={16} aria-hidden="true" /></summary>
          {product.ingredients && <div><h4>Ingredientes</h4><p>{product.ingredients}</p></div>}
          {product.variants.length > 0 && <div><h4>Presentaciones</h4><ul>{product.variants.map((variant, index) => <li key={`${variant.name}-${index}`}><span>{variant.name}{!variant.inStock && <small> · Agotado</small>}</span><span>{variant.price === null ? "Consultar" : money.format(variant.price)}</span></li>)}</ul></div>}
        </details>}
      </article>
    </li>
  );
}
