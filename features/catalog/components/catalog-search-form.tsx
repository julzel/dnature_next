import Link from "next/link";
import { Search, X } from "lucide-react";
import styles from "./catalog-page.module.css";

export function CatalogSearchForm({ query, categoryId }: { query: string; categoryId: string }) {
  const clearHref = categoryId ? `/productos?categoria=${encodeURIComponent(categoryId)}` : "/productos";
  return (
    <form className={styles.searchForm} action="/productos" method="get" role="search">
      <label htmlFor="catalog-search">Buscar productos</label>
      <div className={styles.searchControls}>
        <input id="catalog-search" name="q" type="search" defaultValue={query} placeholder="Nombre o SKU" maxLength={100} />
        {categoryId && <input type="hidden" name="categoria" value={categoryId} />}
        {query && <Link className={styles.clearSearch} href={clearHref} aria-label="Limpiar búsqueda"><X size={20} aria-hidden="true" /><span>Limpiar</span></Link>}
        <button type="submit" aria-label="Buscar productos"><Search size={20} aria-hidden="true" /><span>Buscar</span></button>
      </div>
    </form>
  );
}
