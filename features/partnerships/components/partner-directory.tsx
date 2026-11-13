"use client";

import { Children, useRef, useState, useSyncExternalStore, type ChangeEvent, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Select } from "@/components/select";
import { SectionEyebrow } from "@/components/section-eyebrow";
import searchField from "@/components/search-field.module.css";
import { consultationModes } from "../data/page-content";
import { matchesPartner } from "../lib/directory";
import type { ConsultationMode, DirectoryEntry } from "../types/partner";
import styles from "./partnerships.module.css";

function subscribeToHydration() { return () => {}; }
function clientSnapshot() { return true; }
function serverSnapshot() { return false; }

export function PartnerDirectory({ entries, children }: { entries: DirectoryEntry[]; children: ReactNode }) {
  const ready = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<ConsultationMode | "all">("all");
  const search = useRef<HTMLInputElement>(null);
  const rows = Children.toArray(children);
  const matches = entries.map((entry) => matchesPartner(entry, query, mode));
  const count = matches.filter(Boolean).length;
  function handleSearch(event: ChangeEvent<HTMLInputElement>) { setQuery(event.currentTarget.value); }
  function handleMode(value: ConsultationMode | "all") { setMode(value); }
  function handleClear() { setQuery(""); search.current?.focus(); }
  function handleReset() { setQuery(""); setMode("all"); search.current?.focus(); }

  return <section id="directorio" className={styles.directory} aria-labelledby="directory-title">
    <div className={styles.container}>
      <div className={styles.directoryHeading}>
        <div><SectionEyebrow label="Encontrá acompañamiento" /><h2 id="directory-title">Distintas miradas.<br /><span>Un mismo cuidado.</span></h2></div>
        <p>Buscá por nombre, servicio o ubicación. Elegí la modalidad que te resulte más cómoda y coordiná directamente tu cita.</p>
      </div>
      <div className={styles.tools}>
        <div className={styles.search} role="search" aria-label="Buscar profesionales">
          <label htmlFor="partner-search">Nombre, servicio o ubicación</label>
          <div className={searchField.field}>
            <Search className={searchField.icon} size={21} aria-hidden="true" />
            <input suppressHydrationWarning ref={search} id="partner-search" className={searchField.input} type="search" placeholder="Por ejemplo, nutrición o Cartago" value={query} onChange={handleSearch} disabled={!ready} autoComplete="off" maxLength={100} />
            {query && <button className={searchField.action} type="button" onClick={handleClear} aria-label="Limpiar búsqueda de profesionales"><X size={19} aria-hidden="true" /><span>Limpiar</span></button>}
          </div>
        </div>
        <Select label="Modalidad de atención" value={mode} options={consultationModes} onValueChange={handleMode} disabled={!ready} />
      </div>
      <div className={styles.listHeading}><p role="status" aria-live="polite" aria-atomic="true"><strong>{count}</strong> {count === 1 ? "profesional" : "profesionales"}{query || mode !== "all" ? " en tu búsqueda" : " para conocer"}</p><span>Salud animal · Bienestar</span></div>
      <ul className={styles.list}>{entries.map((entry, index) => <li key={entry.id} id={entry.id} hidden={!matches[index]}>{rows[index]}</li>)}</ul>
      {count === 0 && <div className={styles.empty}>
        <h3>Probemos otra búsqueda.</h3><p>No encontramos profesionales con esos criterios. Cambiá el servicio o la modalidad de atención.</p>
        <button type="button" onClick={handleReset}>Ver todos los profesionales</button>
      </div>}
      <noscript><p>Podés consultar todos los perfiles y sus contactos en este listado. Para filtrar, activá JavaScript.</p></noscript>
    </div>
  </section>;
}
