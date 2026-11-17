"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { Icon } from "@/components/icon";
import searchField from "@/components/search-field.module.css";
import { publicPages } from "@/lib/seo/pages";
import styles from "./search-dialog.module.css";

function subscribeToHydration() { return () => {}; }
function clientSnapshot() { return true; }
function serverSnapshot() { return false; }

function normalizeQuery(value: string) {
  return value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

export function SearchDialog({ open, onClose }: {
  open: boolean;
  onClose: () => void;
}) {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const dialog = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<number | null>(null);
  const backdropPointerDown = useRef(false);
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeQuery(query);
  const results = !normalizedQuery ? [] : publicPages.filter((page) =>
    normalizeQuery(page.title).includes(normalizedQuery),
  );

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleClearQuery() {
    setQuery("");
    inputRef.current?.focus({ preventScroll: true });
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const links = dialog.current?.querySelectorAll<HTMLAnchorElement>("a[href]");
    if (!links?.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      links[event.key === "ArrowDown" ? 0 : links.length - 1].focus();
    } else if (event.key === "Enter") {
      event.preventDefault();
      links[0].click();
    }
  }

  function handleResultKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>("a[href]"));
    const index = links.findIndex((link) => link === event.target);
    if (index < 0) return;
    event.preventDefault();
    const next = index + (event.key === "ArrowDown" ? 1 : -1);
    if (next < 0 || next >= links.length) inputRef.current?.focus({ preventScroll: true });
    else links[next].focus();
  }

  const handleClose = useCallback(function closeSearch() {
    const element = dialog.current;
    if (!element?.open || closeTimer.current !== null) return;
    const cssDuration = getComputedStyle(element).getPropertyValue("--search-fade-duration").trim();
    const duration = (Number.parseFloat(cssDuration) || 0) * (cssDuration.endsWith("ms") ? 1 : 1000);
    if (duration <= 0) {
      element.close();
      return;
    }
    element.setAttribute("data-closing", "");
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      element.close();
      element.removeAttribute("data-closing");
    }, duration);
  }, []);

  useEffect(function syncDialog() {
    const element = dialog.current;
    if (!element) return;
    if (open) {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
        element.removeAttribute("data-closing");
      }
      if (!element.open) {
        element.showModal();
        inputRef.current?.focus({ preventScroll: true });
      }
    } else if (!open && element.open) {
      handleClose();
    }
  }, [open, handleClose, hydrated]);

  useEffect(function clearPendingCloseOnUnmount() {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  function outsideDialog(event: MouseEvent<HTMLDialogElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
  }

  function handlePointerDown(event: PointerEvent<HTMLDialogElement>) {
    backdropPointerDown.current = outsideDialog(event);
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (backdropPointerDown.current && outsideDialog(event)) handleClose();
    backdropPointerDown.current = false;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      handleClose();
      return;
    }
    if (event.key !== "Tab" || event.ctrlKey || event.metaKey || event.altKey) return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), a[href]"));
    if (!controls.length) return;
    const index = controls.indexOf(document.activeElement as HTMLElement);
    const next = index < 0 ? (event.shiftKey ? controls.length - 1 : 0) : (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
    event.preventDefault();
    controls[next].focus();
  }

  // Hidden search UI has no server content to expose. Mount it after hydration so
  // browser autofill attributes cannot change its input before React attaches.
  if (!hydrated) return null;

  return (
    <dialog ref={dialog} id="site-search" className={styles.dialog} aria-labelledby="site-search-title"
      onClose={onClose} onClick={handleBackdropClick} onPointerDown={handlePointerDown} onKeyDown={handleKeyDown}>
      <h2 id="site-search-title" className="sr-only">Buscar en DNAture</h2>
      <search aria-label="Buscar en DNAture">
        <div className={`${styles.searchField} ${searchField.field}`}>
          <Search className={searchField.icon} size={22} aria-hidden="true" />
          <label className="sr-only" htmlFor="header-search-query">Buscar en el sitio</label>
          <input
            ref={inputRef}
            id="header-search-query"
            className={searchField.input}
            type="search"
            name="q"
            placeholder="Buscar en DNAture"
            autoComplete="off"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleInputKeyDown}
            aria-controls={normalizedQuery ? "header-search-results" : undefined}
            aria-describedby={normalizedQuery ? "header-search-status" : undefined}
          />
          <button className={`${styles.close} ${searchField.action}`} type="button"
            aria-label={query.length > 0 ? "Borrar búsqueda" : "Cerrar búsqueda"}
            onClick={query.length > 0 ? handleClearQuery : handleClose}>
            {query.length === 0 && <kbd aria-hidden="true">esc</kbd>}<X size={20} aria-hidden="true" />{query.length > 0 && <span>Limpiar</span>}
          </button>
        </div>
        {normalizedQuery && <div className={styles.results} id="header-search-results">
          <p className={styles.resultStatus} id="header-search-status" role="status">
            {results.length === 0 ? `No encontramos páginas para “${query.trim()}”. Probá con otra palabra.` : `${results.length} ${results.length === 1 ? "página encontrada" : "páginas encontradas"}.`}
          </p>
          {results.length > 0 && <ul onKeyDown={handleResultKeyDown}>
            {results.map((page) => <li key={page.path}><Link href={page.path} onClick={handleClose}>{page.title} <Icon name="arrow" /></Link></li>)}
          </ul>}
        </div>}
      </search>
    </dialog>
  );
}
