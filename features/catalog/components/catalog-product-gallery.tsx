"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import styles from "./catalog-page.module.css";

/** Keep one ordered list for search, sorting, keyboard navigation, and every viewport. */
export function CatalogProductGallery({ children }: { children: ReactNode }) {
  const galleryRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(function arrangeGallery() {
    const gallery = galleryRef.current;
    if (!gallery || typeof ResizeObserver === "undefined") return;
    const items = Array.from(gallery.children) as HTMLLIElement[];
    const articles = items.map((item) => item.querySelector("article"));
    let frame = 0;

    function measure() {
      if (!gallery) return;
      const style = getComputedStyle(gallery);
      const columns = Number(style.getPropertyValue("--gallery-columns"));
      if (columns === 1) {
        delete gallery.dataset.masonry;
        for (const item of items) item.style.removeProperty("grid-row-end");
        return;
      }
      const unit = parseFloat(style.getPropertyValue("--gallery-row-unit"));
      const gap = parseFloat(style.getPropertyValue("--gallery-gap"));
      // Read all content heights before writing placement. Images reserve their
      // source aspect ratios; disclosures and font/viewport changes are observed.
      const spans = articles.map((article) => Math.ceil(((article?.getBoundingClientRect().height ?? 0) + gap) / unit));
      items.forEach((item, index) => { item.style.gridRowEnd = `span ${spans[index]}`; });
      gallery.dataset.masonry = "true";
    }

    function scheduleMeasurement() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }

    measure();
    const observer = new ResizeObserver(scheduleMeasurement);
    for (const article of articles) if (article) observer.observe(article);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [children]);

  return <ul ref={galleryRef} className={styles.productGrid} aria-label="Productos encontrados" role="list">{children}</ul>;
}
