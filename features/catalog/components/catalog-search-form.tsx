import type { ChangeEventHandler, FocusEventHandler, FormEventHandler, RefObject } from "react";
import { Search, X } from "lucide-react";
import type { CatalogCategory, CatalogFilters } from "../lib/browse-catalog";
import { catalogFilterUrl } from "../lib/catalog-filter-url";
import styles from "./catalog-page.module.css";

export function CatalogSearchForm({ filters, categories, inputRef, onChange, onBlur, onSubmit, onClear }: {
  filters: CatalogFilters;
  categories: CatalogCategory[];
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onClear: () => void;
}) {
  const params = new URL(catalogFilterUrl(filters, categories), "https://dnature.invalid").searchParams;
  return (
    <form className={styles.searchForm} action="/productos" method="get" role="search" onSubmit={onSubmit}>
      <div className={styles.searchControls}>
        <Search className={styles.searchIcon} size={22} aria-hidden="true" />
        <input ref={inputRef} id="catalog-search" name="q" type="search" value={filters.query} onChange={onChange} onBlur={onBlur} placeholder="Producto, ingrediente o SKU" maxLength={100} autoComplete="off" />
        {[...params].filter(([key]) => key !== "q").map(([key, value]) => <input key={`${key}-${value}`} type="hidden" name={key} value={value} />)}
        {filters.query && <button className={styles.clearSearch} type="button" onClick={onClear} aria-label="Limpiar búsqueda"><X size={20} aria-hidden="true" /><span>Limpiar</span></button>}
        <button className={styles.submitSearch} type="submit" aria-label="Buscar productos"><Search size={20} aria-hidden="true" /><span>Buscar</span></button>
      </div>
    </form>
  );
}
