"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { categoryPath, categoryStyle, type CatalogShelf } from "../lib/browse-catalog";
import { CatalogProductPreview } from "./catalog-product-preview";
import styles from "./catalog-page.module.css";

export function CatalogCategoryShelf({ shelf }: { shelf: CatalogShelf }) {
  const scroller = useRef<HTMLOListElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  const updateControls = useCallback(() => {
    const element = scroller.current;
    if (!element) return;
    setCanScrollBack(element.scrollLeft > 2);
    setCanScrollForward(element.scrollLeft + element.clientWidth < element.scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateControls();
    const observer = new ResizeObserver(updateControls);
    if (scroller.current) observer.observe(scroller.current);
    return () => observer.disconnect();
  }, [updateControls]);

  function moveScroller(direction: -1 | 1) {
    const element = scroller.current;
    if (!element) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    element.scrollBy({ left: direction * element.clientWidth * 0.8, behavior });
  }

  function handleScrollBack() {
    moveScroller(-1);
  }

  function handleScrollForward() {
    moveScroller(1);
  }

  return (
    <section className={styles.shelf} style={categoryStyle(shelf.category)} aria-labelledby={`category-${shelf.category.id}`}>
      <div className={styles.shelfHeading}>
        <div>
          <p>Favoritos de la categoría</p>
          <h3 id={`category-${shelf.category.id}`}>{shelf.category.label}</h3>
        </div>
        <div className={styles.shelfControls}>
          <button type="button" onClick={handleScrollBack} disabled={!canScrollBack} aria-label={`Desplazar ${shelf.category.label} hacia atrás`}><ArrowLeft size={20} aria-hidden="true" /><span>Anterior</span></button>
          <button type="button" onClick={handleScrollForward} disabled={!canScrollForward} aria-label={`Desplazar ${shelf.category.label} hacia adelante`}><span>Siguiente</span><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
      <ol ref={scroller} className={styles.shelfTrack} onScroll={updateControls} aria-label={`Productos de ${shelf.category.label}`}>
        {shelf.products.map((product) => <CatalogProductPreview key={product.sku} product={product} />)}
      </ol>
      <Link className={styles.categoryLink} href={categoryPath(shelf.category)}>
        Ver todos los productos de {shelf.category.label}
        <ArrowUpRight size={20} aria-hidden="true" />
      </Link>
    </section>
  );
}
