"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type MouseEvent } from "react";
import { Search, X } from "lucide-react";
import navEffect from "@/components/center-out-nav-link.module.css";
import { SectionEyebrow } from "@/components/section-eyebrow";
import faq from "../data/faq.json";
import { FaqQuestion } from "./faq-question";
import styles from "./faq.module.css";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
}

export function FaqExplorer() {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("all");
  const input = useRef<HTMLInputElement>(null);
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const groups = faq.topics.map((topic) => ({
    ...topic,
    questions: faq.questions.filter((question) => {
      const content = question.answer_blocks.flatMap((block) => [block.text, ...block.items]);
      const searchable = normalize([question.question, ...content, ...question.search_terms, topic.label, topic.description].join(" "));
      return question.topic_id === topic.id && terms.every((term) => searchable.includes(term));
    }),
  }));
  const visibleGroups = groups.filter((group) => group.questions.length > 0 && (activeTopic === "all" || activeTopic === group.id));
  const total = visibleGroups.reduce((sum, group) => sum + group.questions.length, 0);
  const allTotal = groups.reduce((sum, group) => sum + group.questions.length, 0);
  const selectedLabel = faq.topics.find((topic) => topic.id === activeTopic)?.label;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.currentTarget.value);
  }

  function handleClear() {
    setQuery("");
    input.current?.focus();
  }

  function handleReset() {
    setActiveTopic("all");
    setQuery("");
    window.history.replaceState(null, "", "#respuestas");
    input.current?.focus();
  }

  function handleTopicClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const topic = event.currentTarget.dataset.topic;
    if (!topic) return;
    event.preventDefault();
    setActiveTopic(topic);
    const anchor = topic === "all" ? "#respuestas" : `#tema-${topic}`;
    window.history.replaceState(null, "", anchor);
    document.getElementById("respuestas")?.scrollIntoView({ block: "start" });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section id="respuestas" className={styles.explore} aria-labelledby="faq-explore-title">
      <div className={styles.container}>
        <SectionEyebrow label="Encontrá tu respuesta" />
        <div className={styles.exploreHeading}>
          <div>
            <h2 id="faq-explore-title">¿En qué podemos ayudarte?</h2>
            <p>Buscá una palabra o elegí el tema que te interesa.</p>
          </div>
          <form id="faq-search" className={styles.search} role="search" aria-label="Buscar preguntas frecuentes" onSubmit={handleSubmit}>
            <label htmlFor="faq-query">Buscar en las preguntas</label>
            <div className={styles.searchField}>
              <Search size={22} aria-hidden="true" />
              <input ref={input} id="faq-query" type="search" value={query} onChange={handleChange} placeholder="Por ejemplo: porciones" autoComplete="off" />
              {query && <button type="button" onClick={handleClear} aria-label="Borrar búsqueda"><X size={20} aria-hidden="true" /><span>Limpiar</span></button>}
            </div>
          </form>
          <noscript><style>{"#faq-search { display: none; }"}</style></noscript>
        </div>
        <div className={styles.resultsLayout}>
          <nav className={styles.topicNav} aria-label="Temas de preguntas frecuentes">
            <p>Explorá por tema</p>
            <ul>
              <li><a className={navEffect.link} href="#respuestas" data-topic="all" aria-current={activeTopic === "all" ? "true" : undefined} onClick={handleTopicClick}><span>Todos los temas</span><span aria-label={`${allTotal} preguntas`}>{allTotal}</span></a></li>
              {groups.map((group) => (
                <li key={group.id}><a className={navEffect.link} href={`#tema-${group.id}`} data-topic={group.id} aria-current={activeTopic === group.id ? "true" : undefined} onClick={handleTopicClick}><span>{group.label}</span><span aria-label={`${group.questions.length} preguntas`}>{group.questions.length}</span></a></li>
              ))}
            </ul>
          </nav>
          <div className={styles.results}>
            <p className={styles.status} role="status" aria-live="polite">
              {query.trim() ? `${total} ${total === 1 ? "resultado" : "resultados"} para “${query.trim()}”${selectedLabel ? ` · ${selectedLabel}` : ""}` : selectedLabel ? `${total} ${total === 1 ? "pregunta" : "preguntas"} · ${selectedLabel}` : `${total} preguntas en ${visibleGroups.length} temas`}
            </p>
            {visibleGroups.length ? visibleGroups.map((group) => (
              <section id={`tema-${group.id}`} key={group.id} className={styles.topic} aria-labelledby={`titulo-${group.id}`}>
                <div className={styles.topicHeading}>
                  <div><h3 id={`titulo-${group.id}`}>{group.label}</h3><p>{group.description}</p></div>
                  <span>{group.questions.length.toString().padStart(2, "0")}</span>
                </div>
                <div>{group.questions.map((question) => <FaqQuestion key={question.id} question={question} />)}</div>
              </section>
            )) : (
              <div className={styles.empty}>
                <h3>No encontramos coincidencias.</h3>
                <p>Probá con otra palabra o explorá todos los temas.</p>
                <button type="button" onClick={handleReset}>Ver todas las preguntas</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
