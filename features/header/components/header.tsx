"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/icon";
import { HeaderSearch } from "./header-search";
import styles from "./header.module.css";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(function syncScrollBackground() {
    let frame: number | null = null;

    function updateBackground() {
      frame = null;
      const opacity = Math.min(1, Math.max(0, window.scrollY / 120));
      header.current?.style.setProperty("--header-scroll-opacity", String(opacity));
      header.current?.toggleAttribute("data-light-background", opacity >= 0.4);
    }

    function handleScroll() {
      if (frame === null) frame = window.requestAnimationFrame(updateBackground);
    }

    updateBackground();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return function cleanupScrollBackground() {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  function focusSearch() {
    if (searchOpen) searchInput.current?.focus({ preventScroll: true });
  }

  useEffect(focusSearch, [searchOpen]);

  function handleToggleSearch() {
    searchButton.current?.focus({ preventScroll: true });
    setSearchOpen(!searchOpen);
  }

  function handleCloseSearch() {
    setSearchOpen(false);
    searchButton.current?.focus({ preventScroll: true });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && searchOpen) {
      event.preventDefault();
      handleCloseSearch();
    }
  }

  return (
    <header ref={header} className={styles.header} onKeyDown={handleKeyDown}>
      <div className={styles.top} data-header-section="top">
        <div className={styles.container}>
          <p>Nutrición con esencia en el ADN.</p>
        </div>
      </div>
      <div className={styles.bottom} data-header-section="bottom">
        <div className={styles.container}>
          <Link className={styles.logo} href="/" aria-label="DNAture, inicio">
            <picture>
              <source media="(min-width: 640px)" srcSet="/brand/logo.svg" />
              <Image src="/icon.svg" width={170} height={44} alt="DNAture" unoptimized />
            </picture>
          </Link>
          <nav className={styles.navigation} aria-label="Navegación principal">
            <Link href="/ciencia">Ciencia</Link>
            <Link href="/nosotros">Nosotros</Link>
          </nav>
          <button
            ref={searchButton}
            className={styles.searchToggle}
            type="button"
            aria-label={searchOpen ? "Cerrar búsqueda" : "Abrir búsqueda"}
            aria-expanded={searchOpen}
            aria-controls="header-search"
            onClick={handleToggleSearch}
          >
            <Icon name={searchOpen ? "close" : "search"} />
          </button>
        </div>
      </div>
      <HeaderSearch open={searchOpen} inputRef={searchInput} />
    </header>
  );
}
