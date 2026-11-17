import Image from "next/image";
import Link from "next/link";
import { ArrowCta } from "@/components/arrow-cta";
import { categoryStyle, type CatalogCategory, type CatalogListing } from "../lib/browse-catalog";
import { formatCatalogPrice } from "../lib/catalog-money";
import styles from "./catalog-page.module.css";
import { CatalogCartControl } from "./catalog-cart-control";

export function CatalogProductPreview({ product, categories = [], headingLevel = 3 }: { product: CatalogListing; categories?: CatalogCategory[]; headingLevel?: 3 | 4 }) {
  const Heading = `h${headingLevel}` as const;
  const category = categories.find(({ id }) => product.categoryIds.includes(id));
  return (
    <li className={styles.preview} style={category ? categoryStyle(category) : undefined} data-availability={product.offer.inStock ? "available" : "sold-out"}>
      <article className={styles.catalogArticle}>
        <Link href={product.path} prefetch={false} className={styles.previewImage} aria-label={`Ver ${product.name}`}>
          {product.imageUrl
            ? <Image src={product.imageUrl} alt={product.imageAlt} fill sizes="(max-width: 639px) 32vw, (max-width: 899px) 46vw, (max-width: 1279px) 33vw, 304px" />
            : <span className={styles.imageFallback} aria-hidden="true">DN</span>}
          {category && <span className={`${styles.productCategory} ${styles.categoryOverlay}`}>{category.label}</span>}
        </Link>
        <div className={`${styles.previewDetails} ${styles.catalogDetails}`}>
          <Heading><Link href={product.path} prefetch={false} title={product.name}>{product.name}</Link></Heading>
          <p className={styles.price}>{product.offer.price !== null ? <>{product.offer.fromPrice && <span>Desde </span>}{formatCatalogPrice(product.offer.price)}</> : "Precio a consultar"}</p>
          {product.offer.inStock && <CatalogCartControl parentSku={product.sku} name={product.name} options={product.options} />}
          {!product.offer.inStock && <p className={styles.availability}>Agotado</p>}
        </div>
        <ArrowCta className={styles.productCta} href={product.path} prefetch={false} label="Ver más" aria-label={`Ver más sobre ${product.name}`} />
      </article>
    </li>
  );
}
