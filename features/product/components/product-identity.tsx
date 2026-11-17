import Link from "next/link";
import { categoryPath, type CatalogCategory } from "@/features/catalog/lib/browse-catalog";
import styles from "./product-detail.module.css";

export function ProductIdentity({ name, category, introduction }: { name: string; category?: CatalogCategory; introduction: string | null }) {
  return <div className={styles.identity}>
    {category && <Link className={styles.category} href={categoryPath(category)} prefetch={false}>{category.label}</Link>}
    <h1>{name}</h1>
    {introduction && <p className={styles.introduction}>{introduction}</p>}
  </div>;
}
