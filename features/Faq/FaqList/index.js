'use client';

import { useId, useMemo, useState } from 'react';
import {
  Beef,
  Cat,
  ChevronDown,
  CircleDollarSign,
  Leaf,
  MessageCircleMore,
  Search,
  Snowflake,
  Stethoscope,
  Truck,
  X,
} from 'lucide-react';

import { WHATSAPP_URL } from '../../../constants/contact';
import { faqCategories } from './data';
import styles from './FaqList.module.scss';

const categoryIcons = {
  leaf: Leaf,
  bone: Beef,
  stethoscope: Stethoscope,
  snowflake: Snowflake,
  truck: Truck,
  wallet: CircleDollarSign,
  cat: Cat,
};

const normalizeText = (value = '') =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-CR');

const blockToText = (block) => {
  if (block.items) return block.items.join(' ');
  if (block.content) {
    return block.content
      .map((part) => (typeof part === 'string' ? part : part.text))
      .join(' ');
  }
  return block.text || '';
};

const questionMatches = (item, normalizedQuery) =>
  normalizeText(
    `${item.question} ${item.blocks.map(blockToText).join(' ')}`,
  ).includes(normalizedQuery);

const AnswerBlock = ({ block }) => {
  if (block.type === 'ordered-list' || block.type === 'unordered-list') {
    const List = block.type === 'ordered-list' ? 'ol' : 'ul';
    return (
      <List>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    );
  }

  const content = block.content?.map((part, index) => {
    if (typeof part === 'string') return part;
    const external = part.href.startsWith('http');
    return (
      <a
        key={`${part.href}-${index}`}
        href={part.href}
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {part.text}
      </a>
    );
  });

  return (
    <p className={block.type === 'note' ? styles.note : undefined}>
      {content || block.text}
    </p>
  );
};

const FaqList = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const idPrefix = useId().replace(/:/g, '');
  const normalizedQuery = normalizeText(query.trim());

  const filteredCategories = useMemo(
    () =>
      faqCategories
        .filter(
          (category) =>
            activeCategory === 'all' || category.id === activeCategory,
        )
        .map((category) => ({
          ...category,
          items: normalizedQuery
            ? category.items.filter((item) =>
                questionMatches(item, normalizedQuery),
              )
            : category.items,
        }))
        .filter((category) => category.items.length > 0),
    [activeCategory, normalizedQuery],
  );

  const resultCount = filteredCategories.reduce(
    (total, category) => total + category.items.length,
    0,
  );

  const selectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setSelectedQuestion(null);
  };

  return (
    <section className={styles.faq} id="preguntas" aria-labelledby="faq-library-title">
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Información práctica</p>
        <h2 id="faq-library-title">¿Qué necesitás saber?</h2>
        <p>
          Buscá una palabra o explorá por tema. Podés abrir solamente las
          respuestas que te interesan.
        </p>
      </div>

      <div className={styles.searchWrap} role="search">
        <Search className={styles.searchIcon} aria-hidden="true" size={20} />
        <label className="visually-hidden" htmlFor={`${idPrefix}-faq-search`}>
          Buscar en preguntas frecuentes
        </label>
        <input
          id={`${idPrefix}-faq-search`}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedQuestion(null);
          }}
          placeholder="Ej. transición, gatos, entregas…"
          autoComplete="off"
        />
        {query ? (
          <button
            className={styles.clearSearch}
            type="button"
            onClick={() => setQuery('')}
            aria-label="Limpiar búsqueda"
          >
            <X aria-hidden="true" size={18} />
          </button>
        ) : null}
      </div>

      <div className={styles.mobileFilters} aria-label="Filtrar por tema">
        <button
          type="button"
          aria-pressed={activeCategory === 'all'}
          onClick={() => selectCategory('all')}
        >
          Todas
          <span>{faqCategories.reduce((total, category) => total + category.items.length, 0)}</span>
        </button>
        {faqCategories.map((category) => (
          <button
            type="button"
            key={category.id}
            aria-pressed={activeCategory === category.id}
            onClick={() => selectCategory(category.id)}
          >
            {category.shortLabel}
            <span>{category.items.length}</span>
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Temas de preguntas frecuentes">
          <p>Explorar por tema</p>
          <nav>
            <button
              type="button"
              aria-current={activeCategory === 'all' ? 'true' : undefined}
              onClick={() => selectCategory('all')}
            >
              <span className={styles.navIcon}><Search aria-hidden="true" size={18} /></span>
              <span>Todos los temas</span>
              <small>{faqCategories.reduce((total, category) => total + category.items.length, 0)}</small>
            </button>
            {faqCategories.map((category) => {
              const Icon = categoryIcons[category.icon];
              return (
                <button
                  type="button"
                  key={category.id}
                  aria-current={activeCategory === category.id ? 'true' : undefined}
                  onClick={() => selectCategory(category.id)}
                >
                  <span className={styles.navIcon}><Icon aria-hidden="true" size={18} /></span>
                  <span>{category.label}</span>
                  <small>{category.items.length}</small>
                </button>
              );
            })}
          </nav>

          <div className={styles.helpCard}>
            <MessageCircleMore aria-hidden="true" size={22} />
            <strong>¿Necesitás ayuda personal?</strong>
            <p>Lun–Vie 8:00 a. m.–5:00 p. m.<br />Sáb 8:00 a. m.–4:30 p. m.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Escribir por WhatsApp
            </a>
          </div>
        </aside>

        <div className={styles.results}>
          <p className={styles.resultCount} aria-live="polite">
            {resultCount === 1
              ? '1 respuesta encontrada'
              : `${resultCount} respuestas encontradas`}
          </p>

          {resultCount ? (
            filteredCategories.map((category) => {
              const Icon = categoryIcons[category.icon];
              return (
                <section
                  className={styles.category}
                  key={category.id}
                  aria-labelledby={`${idPrefix}-${category.id}-title`}
                >
                  <div className={styles.categoryHeading}>
                    <span><Icon aria-hidden="true" size={22} /></span>
                    <div>
                      <h3 id={`${idPrefix}-${category.id}-title`}>{category.label}</h3>
                      <p>{category.description}</p>
                    </div>
                  </div>

                  <div className={styles.questionList}>
                    {category.items.map((item) => {
                      const isOpen = selectedQuestion === item.id;
                      const triggerId = `${idPrefix}-${item.id}-trigger`;
                      const answerId = `${idPrefix}-${item.id}-answer`;
                      return (
                        <article className={styles.question} key={item.id}>
                          <h4>
                            <button
                              id={triggerId}
                              type="button"
                              onClick={() => setSelectedQuestion(isOpen ? null : item.id)}
                              aria-expanded={isOpen}
                              aria-controls={answerId}
                            >
                              <span>{item.question}</span>
                              <ChevronDown
                                className={isOpen ? styles.chevronOpen : undefined}
                                aria-hidden="true"
                                size={20}
                              />
                            </button>
                          </h4>
                          <div
                            id={answerId}
                            className={styles.answer}
                            role="region"
                            aria-labelledby={triggerId}
                            hidden={!isOpen}
                          >
                            {item.blocks.map((block, index) => (
                              <AnswerBlock block={block} key={`${item.id}-${index}`} />
                            ))}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <Search aria-hidden="true" size={28} />
              <h3>No encontramos esa respuesta</h3>
              <p>Probá con otra palabra o consultanos directamente.</p>
              <button type="button" onClick={() => { setQuery(''); setActiveCategory('all'); }}>
                Ver todas las preguntas
              </button>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                Preguntar por WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqList;
