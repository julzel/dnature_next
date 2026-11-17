"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { families, type Family } from "@/lib/landing-content";
import { Icon } from "./icon";
import { Modal } from "./modal";

const filters = ["Todas", "Complementos", "Deshidratados", "Órganos", "Recetas completas", "Suplementos"] as const;

export function FamilyBrowser() {
  const [filter, setFilter] = useState<string>("Todas");
  const [selected, setSelected] = useState<Family>(families[0]);
  const dialog = useRef<HTMLDialogElement>(null);
  const visible = filter === "Todas" ? families : families.filter((family) => family.group === filter);
  return <section id="productos" className="families-section section-space" aria-labelledby="families-title">
    <div className="shell">
      <div className="section-heading"><div><p className="eyebrow">El portafolio DNAture</p><h2 id="families-title">Distintas funciones.<br />Una elección informada.</h2></div><p>Conocé las familias y qué información revisar antes de elegir. Porque nutrir también es entender.</p></div>
      <div className="family-toolbar"><div className="filter-list" role="group" aria-label="Filtrar familias">{filters.map((item) => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><span className="small muted" role="status">{visible.length} {visible.length === 1 ? "familia" : "familias"}</span></div>
      <div className="family-grid">{visible.map((family) => <article key={family.id} className="family-card" style={{ "--family-color": family.color } as CSSProperties}>
        <div className="family-image"><Image src={family.image} alt={family.imageAlt} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" /><span className="family-index" aria-hidden="true">{String(families.indexOf(family) + 1).padStart(2, "0")}</span></div>
        <div className="family-content"><p className="family-group"><span className="family-dot" />{family.group}</p><h3>{family.name}</h3><p>{family.description}</p><button type="button" className="family-action" aria-label={`Conocer ${family.name}`} onClick={(event) => { event.currentTarget.focus(); setSelected(family); dialog.current?.showModal(); }}>Conocer la familia <Icon name="arrow" /></button></div>
      </article>)}</div>
      <p className="portfolio-note"><Icon name="science" />Las familias cumplen funciones distintas. La clasificación, la especie y el uso se verifican en cada fórmula.</p>
    </div>
    <Modal dialogRef={dialog} titleId="family-dialog-title">
      <p className="eyebrow">{selected.group}</p><h2 id="family-dialog-title">{selected.name}</h2><p>{selected.description}</p><div className="family-checklist"><h3>Antes de elegir, revisá</h3><ul><li>La función nutricional y la especie indicada.</li><li>Los ingredientes y la composición de la fórmula.</li><li>Las indicaciones de uso, conservación y supervisión.</li></ul></div><p className="small muted">Las fotografías ilustran el portafolio. Las presentaciones y la disponibilidad comercial están por confirmar.</p><Link href="/ciencia/nuestros-criterios" className="button button-primary" onClick={() => dialog.current?.close()}>Conocer nuestros criterios <Icon name="arrow" /></Link>
    </Modal>
  </section>;
}
