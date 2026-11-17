import type { ChangeEventHandler, FocusEventHandler, FormEventHandler, RefObject } from "react";
import { Search, X } from "lucide-react";
import searchField from "@/components/search-field.module.css";
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
  // Browser autofill can add __gCrUniqueid before hydration. Keep the native GET
  // form server-rendered and tolerate browser-managed attributes on these nodes.
  return (
    <form suppressHydrationWarning className={styles.searchForm} action="/productos" method="get" role="search" onSubmit={onSubmit}>
      <div className={searchField.field}>
        <Search className={`${styles.searchIcon} ${searchField.icon}`} size={22} aria-hidden="true" />
        <input suppressHydrationWarning ref={inputRef} id="catalog-search" name="q" type="search" className={searchField.input} value={filters.query} onChange={onChange} onBlur={onBlur} aria-label="Buscar productos" placeholder="Producto, ingrediente o SKU" maxLength={100} autoComplete="off" />
        {[...params].filter(([key]) => key !== "q").map(([key, value]) => <input suppressHydrationWarning key={`${key}-${value}`} type="hidden" name={key} value={value} />)}
        {filters.query && <button className={`${styles.clearSearch} ${searchField.action}`} type="button" onClick={onClear} aria-label="Limpiar búsqueda"><X size={20} aria-hidden="true" /><span>Limpiar</span></button>}
      </div>
    </form>
  );
}
