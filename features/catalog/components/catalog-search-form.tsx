"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type FormEventHandler, type MouseEvent, type MouseEventHandler } from "react";
import { Search, X } from "lucide-react";
import { catalogFilterUrl } from "../lib/catalog-filter-url";
import styles from "./catalog-page.module.css";

export function CatalogSearchForm({ query, categoryId, onSubmit, onNavigate }: { query: string; categoryId: string; onSubmit: FormEventHandler<HTMLFormElement>; onNavigate: MouseEventHandler<HTMLAnchorElement> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const clearHref = catalogFilterUrl("", categoryId);

  useLayoutEffect(function syncSearchQuery() {
    if (inputRef.current) inputRef.current.value = query;
  }, [query]);

  function handleClear(event: MouseEvent<HTMLAnchorElement>) {
    onNavigate(event);
    if (event.defaultPrevented) inputRef.current?.focus({ preventScroll: true });
  }

  return (
    <form className={styles.searchForm} action="/productos" method="get" role="search" onSubmit={onSubmit}>
      <label htmlFor="catalog-search">Buscar productos</label>
      <div className={styles.searchControls}>
        <input ref={inputRef} id="catalog-search" name="q" type="search" defaultValue={query} placeholder="Nombre o SKU" maxLength={100} />
        {categoryId && <input type="hidden" name="categoria" value={categoryId} />}
        {query && <Link className={styles.clearSearch} href={clearHref} scroll={false} prefetch={false} onClick={handleClear} aria-label="Limpiar búsqueda"><X size={20} aria-hidden="true" /><span>Limpiar</span></Link>}
        <button type="submit" aria-label="Buscar productos"><Search size={20} aria-hidden="true" /><span>Buscar</span></button>
      </div>
    </form>
  );
}
