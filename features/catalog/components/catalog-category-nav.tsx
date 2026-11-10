import Link from "next/link";
import type { CSSProperties, MouseEventHandler } from "react";
import { categoryStyle, type CatalogCategory } from "../lib/browse-catalog";
import { catalogFilterUrl } from "../lib/catalog-filter-url";
import styles from "./catalog-page.module.css";
import navEffect from "@/components/center-out-nav-link.module.css";

export function CatalogCategoryNav({ categories, activeId, query, onNavigate }: { categories: CatalogCategory[]; activeId: string; query: string; onNavigate: MouseEventHandler<HTMLAnchorElement> }) {
  return (
    <nav className={styles.categories} aria-label="Categorías de productos">
      <ul>
        <li>
          <Link className={navEffect.link} href={catalogFilterUrl(query, "")} scroll={false} prefetch={false} onClick={onNavigate} aria-current={!activeId ? "page" : undefined} style={{ "--category-color": "var(--dn-surface-dark)" } as CSSProperties}>
            Todas
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link className={navEffect.link} href={catalogFilterUrl(query, category.id)} scroll={false} prefetch={false} onClick={onNavigate} aria-current={activeId === category.id ? "page" : undefined} style={categoryStyle(category)}>
              {category.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
