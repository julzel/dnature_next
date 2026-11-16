import Link from "next/link";
import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import type { FeedingPackage as Package } from "../lib/result";
import styles from "./feeding.module.css";

export function FeedingPackage({ pack, days }: { pack: Package; days: number }) {
  return <article className={styles.package} aria-label={`Paquete ${pack.name}`}>
    <h3>{pack.name}</h3>
    <p>{pack.mixDailyGrams} g de mezcla{pack.complementDailyGrams > 0 && ` + ${pack.complementDailyGrams} g de complemento`} al día.</p>
    <p className={styles.price}>{pack.ready ? formatCatalogPrice(pack.total) : "Por completar"}</p>
    <p>{pack.ready ? `Para ${days} días · IVA incluido · envío aparte` : "Necesita revisión de productos o disponibilidad."}</p>
    <ul className={styles.lines}>{pack.lines.map((line, index) => <li key={`${line.sku}-${index}`}>
      <Link href={line.href}>{line.name}</Link><span>{line.quantity} × {line.presentation}</span><span>{formatCatalogPrice(line.price * line.quantity)}</span>
    </li>)}</ul>
    <dl className={styles.totals}><div><dt>{pack.ready ? "Productos" : "Productos cotizados (parcial)"}</dt><dd>{formatCatalogPrice(pack.subtotal)}</dd></div><div><dt>IVA (13%)</dt><dd>{formatCatalogPrice(pack.iva)}</dd></div><div><dt>{pack.ready ? "Total sin envío" : "Total parcial sin envío"}</dt><dd>{formatCatalogPrice(pack.total)}</dd></div></dl>
    {pack.issues.length > 0 && <div className={styles.notice}><p><strong>Para completar este paquete:</strong></p><ul>{pack.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></div>}
    <details><summary>Porciones y detalles del paquete</summary>
      <ul>{pack.lines.map((line, index) => <li key={`${line.sku}-${index}`}><strong>{line.name}:</strong> {line.note}</li>)}{pack.notes.map((note) => <li key={note}>{note}</li>)}</ul>
    </details>
  </article>;
}
