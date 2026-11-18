import Link from "next/link";
import { Check, ChevronDown, CircleHelp, Utensils, Leaf, Bone, Layers } from "lucide-react";
import { ArrowCta } from "@/components/arrow-cta";
import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import { packageContents, packageIntroduction, packageWhatsAppUrl } from "../lib/package-presentation";
import type { FeedingPackage as Package, FeedingResult } from "../lib/result";
import styles from "./feeding-results.module.css";

const icons = { base: Utensils, functional: Leaf, chewing: Bone, premium: Layers };

export function FeedingPackage({ pack, days, pet, active, savedDate }: { pack: Package; days: number; pet: FeedingResult; active: boolean; savedDate?: string }) {
  const introduction = packageIntroduction(pack);
  const PackageIcon = icons[pack.id as keyof typeof icons] ?? Utensils;
  const contents = packageContents(pack);
  const action = savedDate ? "Consultar" : pack.ready ? "Pedir" : "Revisar";

  return <article className={styles.package} aria-label={`Paquete ${pack.name}`} data-ready={pack.ready} data-active={active}>
    <header className={styles.packageHeader}>
      <PackageIcon size={28} strokeWidth={1.25} aria-hidden="true" />
      <p className={styles.overline}>{introduction.label}</p>
      <h3>{pack.name}</h3>
      <p>{introduction.description}</p>
    </header>
    <div className={styles.packagePrice}>
      {pack.ready ? <><p className={styles.price}>{formatCatalogPrice(pack.total)}</p><p>total para {days} días · IVA incluido</p><p className={styles.dailyPrice}>≈ {formatCatalogPrice(pack.total / days)} por día</p></> : <><p className={styles.reviewStatus}><CircleHelp size={20} aria-hidden="true" />Por completar</p><p>Hay productos o pautas por confirmar.</p><p className={styles.partialPrice}>{formatCatalogPrice(pack.total)} cotizados · monto parcial</p></>}
    </div>
    <div className={styles.contents}>
      <p className={styles.overline}>{pack.ready ? "En su paquete" : "Ya cotizado"}</p>
      {contents.length ? <ul>{contents.map((role) => <li key={role}><Check size={16} aria-hidden="true" /><span>{role}</span></li>)}</ul> : <p>Revisaremos los productos y su disponibilidad con vos.</p>}
    </div>
    <ArrowCta className={styles.packageCta} label={savedDate ? "Consultar este paquete" : pack.ready ? "Quiero este paquete" : "Revisar este paquete"} aria-label={`${action} paquete ${pack.name} para ${pet.name} por WhatsApp`} href={packageWhatsAppUrl(pack, pet, days, savedDate)} target="_blank" rel="noopener noreferrer" />
    <div className={styles.packageDetails}>
      {!pack.ready && <details className={styles.pendingDetails}>
        <summary><span>Qué falta confirmar{pack.issues.length > 0 && ` (${pack.issues.length})`}</span><ChevronDown size={18} aria-hidden="true" /></summary>
        {pack.issues.length > 0 ? <ul>{pack.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul> : <p>Consultá la disponibilidad y las pautas de los productos con nuestro equipo.</p>}
      </details>}
      <details>
        <summary><span>Ver productos y cantidades</span><ChevronDown size={18} aria-hidden="true" /></summary>
        <ul className={styles.lines}>{pack.lines.map((line, index) => <li key={`${line.sku}-${index}`}>
          <Link href={line.href}>{line.name}</Link><span>{line.quantity} × {line.presentation}</span><strong>{formatCatalogPrice(line.price * line.quantity)}</strong>
        </li>)}</ul>
        <dl className={styles.totals}><div><dt>{pack.ready ? "Productos" : "Productos (parcial)"}</dt><dd>{formatCatalogPrice(pack.subtotal)}</dd></div><div><dt>IVA (13%)</dt><dd>{formatCatalogPrice(pack.iva)}</dd></div><div><dt>{pack.ready ? "Total sin envío" : "Total parcial sin envío"}</dt><dd>{formatCatalogPrice(pack.total)}</dd></div></dl>
      </details>
      <details>
        <summary><span>Porciones y pautas de uso</span><ChevronDown size={18} aria-hidden="true" /></summary>
        <p>{pack.mixDailyGrams} g de mezcla{pack.complementDailyGrams > 0 && ` + ${pack.complementDailyGrams} g de complemento`} al día.</p>
        <ul>{pack.lines.map((line, index) => <li key={`${line.sku}-${index}`}><strong>{line.name}:</strong> {line.note}</li>)}{pack.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </details>
    </div>
  </article>;
}
