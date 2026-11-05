"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent, type RefObject } from "react";
import { Icon } from "@/components/icon";
import { publicPages } from "@/lib/seo/pages";
import styles from "./header.module.css";

function normalizeQuery(value: string) {
  return value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

export function HeaderSearch({ open, inputRef }: {
  open: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const results = submittedQuery === null ? [] : publicPages.filter((page) =>
    normalizeQuery(page.title).includes(normalizeQuery(submittedQuery)),
  );

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setSubmittedQuery(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  }

  return (
    <div id="header-search" className={styles.searchPanel} data-header-section="search" data-open={open} inert={!open} aria-hidden={!open}>
      <div className={styles.searchClip}>
        <search className={styles.searchContent} aria-label="Buscar en DNAture">
          <div className={styles.container}>
            <form className={styles.searchForm} onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="header-search-query">Buscar en el sitio</label>
              <input
                ref={inputRef}
                id="header-search-query"
                className={styles.searchInput}
                type="search"
                name="q"
                placeholder="¿Qué querés encontrar?"
                autoComplete="off"
                value={query}
                onChange={handleQueryChange}
                required
                pattern={".*\\S.*"}
              />
              <button className={styles.submitButton} type="submit" aria-label="Buscar">
                <Search aria-hidden="true" />
                <span className={styles.submitLabel}>Buscar</span>
              </button>
            </form>
            {submittedQuery !== null && <div className={styles.results}>
              <p className={styles.resultStatus} role="status">
                {results.length === 0 ? `No encontramos páginas para “${submittedQuery}”. Probá con otra palabra.` : `${results.length} ${results.length === 1 ? "página encontrada" : "páginas encontradas"}.`}
              </p>
              {results.length > 0 && <ul>
                {results.map((page) => <li key={page.path}><Link href={page.path}>{page.title} <Icon name="arrow" /></Link></li>)}
              </ul>}
            </div>}
          </div>
        </search>
      </div>
    </div>
  );
}
