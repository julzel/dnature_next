"use client";

import type { FormEvent } from "react";
import { ArrowUpRight, ChevronDown, ListFilter, Search, SearchX, X } from "lucide-react";
import searchField from "@/components/search-field.module.css";
import { SectionEyebrow } from "@/components/section-eyebrow";
import contact from "@/features/contact/data/contact.json";
import faq from "../data/faq.json";
import { useFaqNavigation } from "../hooks/use-faq-navigation";
import { searchFaq } from "../lib/search";
import { FaqQuestion } from "./faq-question";
import { FaqShortcuts } from "./faq-shortcuts";
import { FaqTopicIcon } from "./faq-topic-icon";
import { FaqTopicNav } from "./faq-topic-nav";
import styles from "./faq.module.css";

export function FaqExplorer() {
  const { query, activeTopic, ready, input, handleSearchChange, handleClear, handleReset, handleNavigate } = useFaqNavigation();
  const groups = searchFaq(query);
  const visibleGroups = groups.filter((group) => group.questions.length > 0 && (activeTopic === "all" || activeTopic === group.id));
  const total = visibleGroups.reduce((sum, group) => sum + group.questions.length, 0);
  const selectedLabel = faq.topics.find((topic) => topic.id === activeTopic)?.label;
  const filtered = Boolean(query.trim() || selectedLabel);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    document.getElementById("faq-results")?.scrollIntoView({ block: "start" });
  }

  return (
    <section id="respuestas" tabIndex={-1} className={styles.explore} data-searching={Boolean(query.trim())} aria-labelledby="faq-explore-title">
      <div className={styles.container}>
        <div className={styles.exploreHeading}>
          <div>
            <SectionEyebrow label="Estamos para orientarte" />
            <h2 id="faq-explore-title">Menos dudas.<br /><span>Más tranquilidad.</span></h2>
          </div>
          <form id="faq-search" className={styles.search} role="search" aria-label="Buscar preguntas frecuentes" onSubmit={handleSubmit}>
            <label htmlFor="faq-query">¿Qué necesitás saber?</label>
            <div className={`${searchField.field} ${styles.searchField}`}>
              <Search className={searchField.icon} size={24} strokeWidth={1.5} aria-hidden="true" />
              <input ref={input} className={searchField.input} id="faq-query" type="search" value={query} onChange={handleSearchChange} disabled={!ready} aria-label="Buscar en las preguntas" aria-describedby="faq-search-help" aria-controls="faq-results" placeholder="Porciones, envíos, ingredientes…" autoComplete="off" />
              {query && <button className={searchField.action} type="button" onClick={handleClear} aria-label="Borrar búsqueda"><X size={20} aria-hidden="true" /><span>Limpiar</span></button>}
            </div>
            <p id="faq-search-help">{ready ? `Buscá en las ${faq.questions.length} respuestas. Los resultados aparecen al escribir.` : "Preparando la búsqueda… Podés explorar los temas mientras tanto."}</p>
          </form>
          <noscript><style>{"#faq-search, [data-faq-client-only] { display: none; } details[data-faq-topics] { position: static; }"}</style></noscript>
        </div>
        {!query.trim() && <FaqShortcuts onNavigate={handleNavigate} />}
        <div className={styles.resultsLayout}>
          <details className={styles.mobileTopics} data-faq-topics>
            <summary><ListFilter size={22} aria-hidden="true" /><span>{selectedLabel ?? "Explorar todos los temas"}</span><ChevronDown size={20} aria-hidden="true" /></summary>
            <FaqTopicNav groups={groups} activeTopic={activeTopic} onNavigate={handleNavigate} />
          </details>
          <div className={styles.desktopTopics}><FaqTopicNav groups={groups} activeTopic={activeTopic} onNavigate={handleNavigate} /></div>
          <div id="faq-results" tabIndex={-1} className={styles.results}>
            <div className={styles.resultsHeader}>
              <p id="faq-result-status" className={styles.status} role="status" aria-live="polite" aria-atomic="true">
                {query.trim() ? `${total} ${total === 1 ? "resultado" : "resultados"} para “${query.trim()}”${selectedLabel ? ` · ${selectedLabel}` : ""}` : selectedLabel ? `${total} ${total === 1 ? "pregunta" : "preguntas"} · ${selectedLabel}` : `${total} preguntas en ${visibleGroups.length} temas`}
              </p>
              {filtered && <button type="button" className={styles.reset} onClick={handleReset} aria-label="Restablecer búsqueda y temas"><span>Restablecer</span><X size={18} aria-hidden="true" /></button>}
            </div>
            {visibleGroups.length ? visibleGroups.map((group) => (
              <section id={`tema-${group.id}`} key={group.id} className={styles.topic} aria-labelledby={`titulo-${group.id}`}>
                <div className={styles.topicHeading}>
                  <FaqTopicIcon topic={group.id} size={40} />
                  <div><h3 id={`titulo-${group.id}`} tabIndex={-1}>{group.label}</h3><p>{group.description}</p></div>
                </div>
                <div>{group.questions.map((question) => <FaqQuestion key={question.id} question={question} ready={ready} />)}</div>
              </section>
            )) : (
              <div className={styles.empty}>
                <SearchX size={48} strokeWidth={1.25} aria-hidden="true" />
                <h3>No encontramos coincidencias.</h3>
                <p>Probá una palabra más corta, como “porción” o “envío”. También podés volver a explorar los temas.</p>
                <button type="button" onClick={handleReset}>Ver todas las preguntas <ArrowUpRight size={22} aria-hidden="true" /></button>
                <a href={contact.whatsapp.url} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp<span className="sr-only"> (abre en otra pestaña)</span></a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
