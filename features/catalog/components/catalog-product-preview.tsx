import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { categoryStyle, type CatalogCategory, type CatalogListing } from "../lib/browse-catalog";
import { formatCatalogPrice } from "../lib/catalog-money";
import styles from "./catalog-page.module.css";

export function CatalogProductPreview({ product, categories = [], headingLevel = 3 }: { product: CatalogListing; categories?: CatalogCategory[]; headingLevel?: 3 | 4 }) {
  const Heading = `h${headingLevel}` as const;
  const category = categories.find(({ id }) => product.categoryIds.includes(id));
  return (
    <li className={styles.preview} style={category ? categoryStyle(category) : undefined} data-availability={product.offer.inStock ? "available" : "sold-out"}>
      <article>
        <div className={styles.previewImage}>
          {product.imageUrl
            ? <Image src={product.imageUrl} alt={product.imageAlt} fill sizes="(max-width: 639px) 32vw, (max-width: 899px) 46vw, (max-width: 1279px) 33vw, 304px" />
            : <span className={styles.imageFallback} aria-hidden="true">DN</span>}
        </div>
        <div className={styles.previewDetails}>
          {category && <p className={styles.productCategory}>{category.label}</p>}
          <Heading>{product.name}</Heading>
          <p className={styles.price}>{product.offer.price !== null ? <>{product.offer.fromPrice && <span>Desde </span>}{formatCatalogPrice(product.offer.price)}</> : "Precio a consultar"}</p>
          <p className={styles.availability}>{product.offer.inStock ? "Disponible" : "Agotado"}{product.variants.length > 1 ? ` · ${product.variants.length} presentaciones` : ""}</p>
        </div>
        {(product.ingredients || product.variants.length > 0) && <details className={styles.productFacts}>
          <summary>Ver detalles<ChevronDown size={16} aria-hidden="true" /></summary>
          {product.ingredients && <div><h4>Ingredientes</h4><p>{product.ingredients}</p></div>}
          {product.variants.length > 0 && <div><h4>Presentaciones</h4><ul>{product.variants.map((variant, index) => <li key={`${variant.name}-${index}`}><span>{variant.name}{!variant.inStock && <small> · Agotado</small>}</span><span>{variant.price === null ? "Consultar" : formatCatalogPrice(variant.price)}</span></li>)}</ul></div>}
        </details>}
      </article>
    </li>
  );
}
