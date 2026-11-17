"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent, type MouseEvent } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Select, type SelectOption } from "@/components/select";
import { categoryPath, filterCatalog, type CatalogCategory, type CatalogFilters, type CatalogListing } from "../lib/browse-catalog";
import { catalogFilterUrl, readCatalogFilters } from "../lib/catalog-filter-url";
import { CatalogFiltersPanel } from "./catalog-filters-panel";
import { CatalogProductPreview } from "./catalog-product-preview";
import { CatalogSearchForm } from "./catalog-search-form";
import styles from "./catalog-page.module.css";

const FILTER_CHANGE_EVENT = "dnature:catalog-filters";

function subscribeToCatalogLocation(onChange: () => void) {
  window.addEventListener(FILTER_CHANGE_EVENT, onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener(FILTER_CHANGE_EVENT, onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function readCatalogLocation() {
  return window.location.search.slice(1);
}

export function CatalogBrowser({ categories, listings }: { categories: CatalogCategory[]; listings: CatalogListing[] }) {
  const serverSearchParams = useSearchParams();
  // Native history integrates with Next, whose transition can lag rapid input. Read our
  // writes synchronously so controlled text and checkboxes never revert between keystrokes.
  const queryString = useSyncExternalStore(subscribeToCatalogLocation, readCatalogLocation, () => serverSearchParams.toString());
  const searchParams = new URLSearchParams(queryString);
  const filters = readCatalogFilters(searchParams, categories);
  const view = filterCatalog(listings, categories, filters);
  const selected = categories.filter(({ id }) => filters.categoryIds.includes(id));
  const filterCount = selected.length + Number(filters.inStockOnly);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const typingRef = useRef(false);
  const scrollTargetRef = useRef<number | null>(null);

  useEffect(function resetTypingOnHistoryNavigation() {
    function handlePopState() { typingRef.current = false; }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useLayoutEffect(function preserveCatalogPosition() {
    if (scrollTargetRef.current === null) return;
    window.scrollTo({ top: scrollTargetRef.current, behavior: "instant" });
    scrollTargetRef.current = null;
  }, [queryString]);

  useEffect(function measureStickyTools() {
    const tools = toolsRef.current;
    if (!tools) return;
    const observer = new ResizeObserver(() => {
      sectionRef.current?.style.setProperty("--catalog-toolbar-height", `${tools.getBoundingClientRect().height}px`);
    });
    observer.observe(tools);
    return () => observer.disconnect();
  }, []);

  function updateFilters(next: CatalogFilters, typing = false) {
    const url = catalogFilterUrl(next, categories);
    if (url === window.location.pathname + window.location.search) return;
    // A typing session is one history entry; filters/sorting are separate, reversible steps.
    const replace = typing && typingRef.current;
    typingRef.current = typing;
    if (sectionRef.current && !filtersOpen) {
      const top = sectionRef.current.getBoundingClientRect().top;
      const headerHeight = parseFloat(getComputedStyle(sectionRef.current).scrollMarginTop);
      if (top < headerHeight) scrollTargetRef.current = window.scrollY + top - headerHeight;
    }
    window.history[replace ? "replaceState" : "pushState"](null, "", url);
    window.dispatchEvent(new Event(FILTER_CHANGE_EVENT));
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    updateFilters({ ...filters, query: event.currentTarget.value }, true);
  }

  function handleSearchBlur() {
    typingRef.current = false;
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    typingRef.current = false;
    updateFilters({ ...filters, query: String(new FormData(event.currentTarget).get("q") ?? "") });
  }

  function handleFilterChange(event: ChangeEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    updateFilters({ ...filters, categoryIds: data.getAll("categoria").map(String), inStockOnly: data.has("disponible") });
  }

  function handleSort(sort: CatalogFilters["sort"]) {
    updateFilters({ ...filters, sort });
  }

  function handleSortSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleNavigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    updateFilters(readCatalogFilters(new URL(event.currentTarget.href).searchParams, categories));
  }

  function handleClearSearch() {
    updateFilters({ ...filters, query: "" });
    searchRef.current?.focus({ preventScroll: true });
  }

  function handleToggleFilters() {
    setFiltersOpen(!filtersOpen);
    if (!filtersOpen) sectionRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  function handleViewResults() {
    setFiltersOpen(false);
    sectionRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    searchRef.current?.focus({ preventScroll: true });
  }

  const withoutFacets = catalogFilterUrl({ ...filters, categoryIds: [], inStockOnly: false }, categories);
  const allProductsUrl = catalogFilterUrl({ query: "", categoryIds: [], inStockOnly: false, sort: "relevance" }, categories);
  const sortOptions: SelectOption<CatalogFilters["sort"]>[] = [
    { value: "relevance", label: filters.query.trim() ? "Más relevantes" : "Disponibles primero" },
    { value: "name", label: "Nombre: A–Z" },
    { value: "price-asc", label: "Menor precio" },
    { value: "price-desc", label: "Mayor precio" },
  ];

  return (
    <section ref={sectionRef} id="catalogo" className={styles.results} aria-label="Catálogo de productos">
      <div className={styles.resultsInner}>
        <div ref={toolsRef} className={styles.tools}>
          <CatalogSearchForm filters={filters} categories={categories} inputRef={searchRef} onChange={handleSearchChange} onBlur={handleSearchBlur} onSubmit={handleSearchSubmit} onClear={handleClearSearch} />
          <button className={styles.mobileFilterToggle} type="button" onClick={handleToggleFilters} aria-expanded={filtersOpen} aria-controls="catalog-filters" aria-label={`Filtros${filterCount ? `: ${filterCount} activos` : ""}`}>
            <SlidersHorizontal size={20} aria-hidden="true" />
            <span>Filtros</span>{filterCount > 0 && <strong>{filterCount}</strong>}
          </button>
        </div>
        <div className={styles.collectionLayout}>
          <aside id="catalog-filters" className={styles.filters} data-open={filtersOpen} aria-label="Filtrar productos">
            <CatalogFiltersPanel categories={categories} filters={filters} counts={view.categoryCounts} availableCount={view.availableCount} onChange={handleFilterChange} />
            <button type="button" className={styles.viewResults} onClick={handleViewResults}>Ver {view.total} productos</button>
          </aside>
          <div className={styles.collection}>
            <div className={styles.resultHeading}>
              <div>
                <h2>{filters.query.trim() ? "Resultados de búsqueda" : selected.length === 1 ? selected[0].label : selected.length > 1 ? "Productos filtrados" : filters.inStockOnly ? "Productos disponibles" : "Todos los productos"}</h2>
                <p className="sr-only" role="status" aria-atomic="true">{view.total} {view.total === 1 ? "producto" : "productos"}{filters.query.trim() ? ` para “${filters.query.trim()}”` : ""}</p>
              </div>
              <form action="/productos" method="get" onSubmit={handleSortSubmit} className={styles.resultActions}>
                <input type="hidden" name="q" value={filters.query} />
                {filters.categoryIds.map((id) => <input key={id} type="hidden" name="categoria" value={id} />)}
                {!filters.categoryIds.length && <input type="hidden" name="categoria" value="todas" />}
                {filters.inStockOnly && <input type="hidden" name="disponible" value="1" />}
                <Select label="Ordenar" name="orden" value={filters.sort} options={sortOptions} onValueChange={handleSort} className={styles.sortSelect} />
                <noscript><button type="submit" className={styles.retry}>Ordenar</button></noscript>
              </form>
            </div>
            {view.products.length ? (
              <ul className={styles.productGrid} aria-label="Productos encontrados">
                {view.products.map((product) => <CatalogProductPreview key={product.sku} product={product} categories={categories} headingLevel={3} />)}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                <h3>No encontramos esa combinación</h3>
                <p>Probá con otro nombre o ingrediente, o quitá un filtro para ampliar la búsqueda.</p>
                {filterCount > 0 && <Link href={withoutFacets} onClick={handleNavigate} scroll={false} prefetch={false}>Buscar en todas las categorías y disponibilidades</Link>}
                {filters.query && <button type="button" onClick={handleClearSearch}>Limpiar la búsqueda</button>}
                <Link href={allProductsUrl} onClick={handleNavigate} scroll={false} prefetch={false}>Ver todo el catálogo</Link>
              </div>
            )}
            <nav className={styles.categoryDirectory} aria-label="Explorar páginas de categorías">
              <p>Explorá por categoría</p>
              {categories.map((category) => <Link key={category.id} href={categoryPath(category)} prefetch={false}>{category.label}</Link>)}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
