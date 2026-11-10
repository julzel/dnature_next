import Link from "next/link";
import type { ChangeEventHandler, MouseEventHandler } from "react";
import { categoryStyle, type CatalogCategory, type CatalogFilters } from "../lib/browse-catalog";
import { catalogFilterUrl } from "../lib/catalog-filter-url";
import styles from "./catalog-page.module.css";
import navEffect from "@/components/center-out-nav-link.module.css";

export function CatalogFiltersPanel({ categories, filters, counts, availableCount, onChange, onNavigate }: {
  categories: CatalogCategory[];
  filters: CatalogFilters;
  counts: Record<string, number>;
  availableCount: number;
  onChange: ChangeEventHandler<HTMLFormElement>;
  onNavigate: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <form action="/productos" method="get" onChange={onChange} className={styles.filterForm}>
      <input type="hidden" name="q" value={filters.query} />
      <input type="hidden" name="orden" value={filters.sort} />
      <fieldset>
        <legend>Categorías</legend>
        <Link href={catalogFilterUrl({ ...filters, categoryIds: [] }, categories)} onClick={onNavigate} prefetch={false} scroll={false} className={styles.allCategories} aria-current={filters.categoryIds.length === 0 ? "true" : undefined}>Todas las categorías</Link>
        {categories.map((category) => <label key={category.id} className={`${styles.categoryFilter} ${navEffect.link}`} style={categoryStyle(category)}>
          <input type="checkbox" name="categoria" value={category.id} checked={filters.categoryIds.includes(category.id)} readOnly />
          <span>{category.label}</span><span className={styles.facetCount}>{counts[category.id] ?? 0}</span>
        </label>)}
      </fieldset>
      <fieldset>
        <legend>Disponibilidad</legend>
        <label className={styles.stockFilter}><input type="checkbox" name="disponible" value="1" checked={filters.inStockOnly} readOnly /><span>Solo disponibles</span><span className={styles.facetCount}>{availableCount}</span></label>
      </fieldset>
      <noscript><button type="submit" className={styles.retry}>Aplicar filtros</button></noscript>
    </form>
  );
}
