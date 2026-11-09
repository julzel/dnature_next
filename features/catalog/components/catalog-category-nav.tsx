import Link from "next/link";
import type { CSSProperties } from "react";
import { categoryStyle, type CatalogCategory } from "../lib/browse-catalog";
import styles from "./catalog-page.module.css";

function href(query: string, categoryId: string): string {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (categoryId) params.set("categoria", categoryId);
  return params.size ? `/productos?${params}` : "/productos";
}

export function CatalogCategoryNav({ categories, activeId, query }: { categories: CatalogCategory[]; activeId: string; query: string }) {
  return (
    <nav className={styles.categories} aria-label="Categorías de productos">
      <ul>
        <li>
          <Link href={href(query, "")} aria-current={!activeId ? "page" : undefined} style={{ "--category-color": "var(--dn-surface-dark)" } as CSSProperties}>
            <span className={styles.categoryDot} aria-hidden="true" /> Todas
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={href(query, category.id)} aria-current={activeId === category.id ? "page" : undefined} style={categoryStyle(category)}>
              <span className={styles.categoryDot} aria-hidden="true" /> {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
