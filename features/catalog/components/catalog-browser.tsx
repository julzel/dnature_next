"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLayoutEffect, useRef, type FormEvent, type MouseEvent } from "react";
import { browseCatalog, type CatalogCategory, type CatalogListing } from "../lib/browse-catalog";
import { catalogFilterUrl } from "../lib/catalog-filter-url";
import { CatalogCategoryNav } from "./catalog-category-nav";
import { CatalogCategoryShelf } from "./catalog-category-shelf";
import { CatalogSearchForm } from "./catalog-search-form";
import styles from "./catalog-page.module.css";

export function CatalogBrowser({ categories, listings }: { categories: CatalogCategory[]; listings: CatalogListing[] }) {
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const scrollTargetRef = useRef<number | null>(null);
  const queries = searchParams.getAll("q");
  const requestedCategories = searchParams.getAll("categoria");
  const query = queries.length === 1 ? queries[0].slice(0, 100) : "";
  const selectedCategory = requestedCategories.length === 1 ? categories.find(({ id }) => id === requestedCategories[0]) : undefined;
  const categoryId = selectedCategory?.id ?? "";
  const view = browseCatalog(listings, categories, { query, categoryId });

  useLayoutEffect(function preserveCatalogPosition() {
    if (scrollTargetRef.current === null) return;
    window.scrollTo({ top: scrollTargetRef.current, behavior: "instant" });
    scrollTargetRef.current = null;
  }, [searchParams]);

  function updateFilters(url: string) {
    if (url === window.location.pathname + window.location.search + window.location.hash) return;
    const results = resultsRef.current;
    const tools = toolsRef.current;
    if (results && tools) {
      const stickyTop = parseFloat(getComputedStyle(tools).insetBlockStart);
      const catalogTop = results.getBoundingClientRect().top + window.scrollY + parseFloat(getComputedStyle(results).paddingBlockStart);
      // Keep the controls pinned and reveal the first result when filtering deep in the catalog.
      scrollTargetRef.current = tools.getBoundingClientRect().top <= stickyTop + 1 ? catalogTop - stickyTop : window.scrollY;
    }
    window.history.pushState(null, "", url);
  }

  function handleLinkNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(event.currentTarget.href);
    if (url.origin !== window.location.origin || url.pathname !== "/productos") return;
    event.preventDefault();
    updateFilters(url.pathname + url.search + url.hash);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextQuery = data.get("q");
    updateFilters(catalogFilterUrl(typeof nextQuery === "string" ? nextQuery : "", categoryId));
  }

  return (
    <section ref={resultsRef} className={styles.results} aria-label="Catálogo de productos">
      <div className={styles.resultsInner}>
        <div ref={toolsRef} className={styles.tools}>
          <CatalogSearchForm query={view.query} categoryId={categoryId} onSubmit={handleSearch} onNavigate={handleLinkNavigation} />
          <CatalogCategoryNav categories={categories} activeId={categoryId} query={view.query} onNavigate={handleLinkNavigation} />
          <p className="sr-only" role="status" aria-atomic="true">
            {view.query ? `Resultados para “${view.query}”. ` : ""}{selectedCategory?.label ?? "Todas las categorías"}: {view.total} productos mostrados.
          </p>
        </div>
        {view.shelves.length ? (
          <div className={styles.shelves}>
            {view.shelves.map((shelf) => <CatalogCategoryShelf key={shelf.category.id} shelf={shelf} />)}
          </div>
        ) : (
          <div className={styles.emptyState} role="status">
            <p>No encontramos productos con esos filtros.</p>
            <Link href="/productos" scroll={false} prefetch={false} onClick={handleLinkNavigation}>Ver todos los productos</Link>
          </div>
        )}
      </div>
    </section>
  );
}
