import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import Link from "next/link";
import { CatalogProductSkeleton } from "./catalog-product-skeleton";
import styles from "./catalog-page.module.css";

const skeletonItems = [1, 2, 3, 4, 5, 6];

export function CatalogCategoryLoading() {
  return <>
    <PageHero
      title="Categoría de"
      accent="productos"
      titleId="category-title"
      description="Explorá los productos de cada categoría."
      navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Productos", path: "/productos" }]} />}
    />
    <section className={styles.results} aria-label="Productos de la categoría" aria-busy="true">
      <div className={styles.resultsInner}>
        <p className="sr-only" role="status">Cargando productos de la categoría…</p>
        <div className={styles.skeletonContent} aria-hidden="true">
          <div className={styles.resultHeading}>
            <h2>Todos los productos</h2>
            <span className={styles.skeletonCategoryLink} />
          </div>
          <ul className={styles.productGrid}>
            {skeletonItems.map((item) => <CatalogProductSkeleton key={item} />)}
          </ul>
        </div>
        <noscript><p>Activá JavaScript para explorar esta categoría. También podés <Link href="/#contacto" prefetch={false}>contactarnos para consultar productos</Link>.</p></noscript>
      </div>
    </section>
  </>;
}
