'use client';

import Link from 'next/link';
import { Search as SearchIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import ContentfulImage from '../../components/ContentfulImage';
import styles from './Search.module.scss';

const MIN_QUERY_LENGTH = 2;
const SEARCH_DELAY_MS = 220;

const Search = ({
  id,
  focusInput = false,
  onNavigate,
  variant = 'default',
}) => {
  const router = useRouter();
  const resultsId = useId();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const normalizedQuery = query.trim();
  const canSearch = normalizedQuery.length >= MIN_QUERY_LENGTH;
  const showResults = isOpen && canSearch;

  useEffect(() => {
    if (focusInput) {
      inputRef.current?.focus();
    }
  }, [focusInput]);

  useEffect(() => {
    if (!canSearch) {
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus('loading');

      try {
        const response = await fetch(
          `/api/search/?q=${encodeURIComponent(normalizedQuery)}`,
          { signal: controller.signal }
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || 'Search request failed.');
        }

        setResults(Array.isArray(payload.results) ? payload.results : []);
        setStatus('success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setResults([]);
          setStatus('error');
        }
      }
    }, SEARCH_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [canSearch, normalizedQuery]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleChange = (event) => {
    const nextQuery = event.target.value;

    setQuery(nextQuery);
    setResults([]);
    setActiveIndex(-1);
    setStatus(nextQuery.trim().length >= MIN_QUERY_LENGTH ? 'pending' : 'idle');
    setIsOpen(true);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setStatus('idle');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const navigateToResult = (result) => {
    setIsOpen(false);
    setActiveIndex(-1);
    onNavigate?.();
    router.push(result.href);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!results.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % results.length);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        current <= 0 ? results.length - 1 : current - 1
      );
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      navigateToResult(results[activeIndex >= 0 ? activeIndex : 0]);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.searchShell} ${
        variant === 'headerPanel' ? styles.headerPanel : ''
      }`}
      role='search'
    >
      <div className={styles.searchField}>
        <SearchIcon
          className={styles.searchIcon}
          aria-hidden='true'
          size={16}
          strokeWidth={2}
        />
        <label className='visually-hidden' htmlFor={id}>
          Buscar productos
        </label>
        <input
          ref={inputRef}
          id={id}
          type='search'
          placeholder='Buscar productos'
          autoComplete='off'
          autoCorrect='off'
          spellCheck='false'
          value={query}
          role='combobox'
          aria-autocomplete='list'
          aria-controls={showResults ? resultsId : undefined}
          aria-expanded={showResults}
          aria-activedescendant={
            activeIndex >= 0 ? `${resultsId}-option-${activeIndex}` : undefined
          }
          onChange={handleChange}
          onFocus={() => canSearch && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            className={styles.clearButton}
            type='button'
            aria-label='Limpiar búsqueda'
            onClick={handleClear}
          >
            <X aria-hidden='true' size={17} strokeWidth={2} />
          </button>
        )}
      </div>

      {showResults && (
        <div id={resultsId} className={styles.resultsPanel}>
          {(status === 'pending' || status === 'loading') && (
            <p className={styles.status} role='status'>
              <span className={styles.spinner} aria-hidden='true' />
              Buscando productos…
            </p>
          )}

          {status === 'error' && (
            <p className={styles.status} role='status'>
              No pudimos buscar ahora. Intenta de nuevo.
            </p>
          )}

          {status === 'success' && results.length === 0 && (
            <p className={styles.status} role='status'>
              No encontramos productos para “{normalizedQuery}”.
            </p>
          )}

          {status === 'success' && results.length > 0 && (
            <>
              <div className={styles.resultsHeader}>
                <span>Productos</span>
                <span>{results.length} resultados</span>
              </div>
              <ul
                className={styles.resultsList}
                role='listbox'
                aria-label='Resultados de búsqueda'
              >
                {results.map((result, index) => (
                  <li
                    key={`${result.type}:${result.id}`}
                    className={styles.resultItem}
                    role='none'
                  >
                    <Link
                      id={`${resultsId}-option-${index}`}
                      href={result.href}
                      className={styles.resultLink}
                      role='option'
                      aria-selected={activeIndex === index}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        setIsOpen(false);
                        setActiveIndex(-1);
                        onNavigate?.();
                      }}
                    >
                      <span className={styles.thumbnail}>
                        {result.image ? (
                          <ContentfulImage
                            src={result.image.url}
                            alt={result.image.alt}
                            width={48}
                            height={48}
                            sizes='48px'
                          />
                        ) : (
                          <span className={styles.thumbnailFallback}>
                            {result.title.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </span>
                      <span className={styles.resultCopy}>
                        <strong>{result.title}</strong>
                        <small>{result.subtitle}</small>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
