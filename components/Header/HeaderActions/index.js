'use client';

import { Search as SearchIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import SiteSearch from '../../../features/Search';
import SubHeader from '../SubHeader';
import styles from './HeaderActions.module.scss';

const SEARCH_PANEL_ID = 'header-search-panel';

const HeaderActions = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchControlRef = useRef(null);
  const searchTriggerRef = useRef(null);

  const closeSearch = ({ restoreFocus = false } = {}) => {
    setIsSearchOpen(false);

    if (restoreFocus) {
      requestAnimationFrame(() => searchTriggerRef.current?.focus());
    }
  };

  useEffect(() => {
    if (!isSearchOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!searchControlRef.current?.contains(event.target)) {
        closeSearch();
        requestAnimationFrame(() => {
          const activeElement = document.activeElement;
          if (
            activeElement === document.body ||
            searchControlRef.current?.contains(activeElement)
          ) {
            searchTriggerRef.current?.focus();
          }
        });
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch({ restoreFocus: true });
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]);

  return (
    <div className={styles.actions}>
      <div ref={searchControlRef} className={styles.searchControl}>
        <button
          ref={searchTriggerRef}
          type='button'
          className={styles.iconButton}
          aria-expanded={isSearchOpen}
          aria-controls={SEARCH_PANEL_ID}
          aria-label={isSearchOpen ? 'Cerrar búsqueda' : 'Abrir búsqueda'}
          onClick={() => setIsSearchOpen((currentValue) => !currentValue)}
        >
          {isSearchOpen ? (
            <X aria-hidden='true' size={27} strokeWidth={1.8} />
          ) : (
            <SearchIcon aria-hidden='true' size={27} strokeWidth={1.8} />
          )}
        </button>

        <section
          id={SEARCH_PANEL_ID}
          className={`${styles.searchPanel} ${
            isSearchOpen ? styles.searchPanelOpen : ''
          }`}
          aria-label='Búsqueda de productos'
          aria-hidden={!isSearchOpen}
          inert={!isSearchOpen}
        >
          <div className={styles.searchPanelInner}>
            <SiteSearch
              id='header-search'
              focusInput={isSearchOpen}
              onNavigate={closeSearch}
              variant='headerPanel'
            />
          </div>
        </section>
      </div>

      <SubHeader />
    </div>
  );
};

export default HeaderActions;
