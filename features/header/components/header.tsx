"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { HeaderSearch } from "./header-search";
import { MobileMenu } from "./mobile-menu";
import { headerLinks } from "../data/navigation";
import styles from "./header.module.css";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(function syncScrollBackground() {
    let frame: number | null = null;
    const desktop = window.matchMedia("(min-width: 1024px)");

    function updateBackground() {
      frame = null;
      // Follow scroll position directly, using a shorter fade on mobile.
      const fadeDistance = desktop.matches ? 60 : 45;
      const opacity = Math.min(1, Math.max(0, window.scrollY / fadeDistance));
      header.current?.style.setProperty("--header-scroll-opacity", String(opacity));
      header.current?.toggleAttribute("data-light-background", opacity >= 0.4);
    }

    function handleScroll() {
      if (frame === null) frame = window.requestAnimationFrame(updateBackground);
    }

    updateBackground();
    window.addEventListener("scroll", handleScroll, { passive: true });
    desktop.addEventListener("change", handleScroll);
    return function cleanupScrollBackground() {
      window.removeEventListener("scroll", handleScroll);
      desktop.removeEventListener("change", handleScroll);
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

  function handleOpenMenu() {
    setSearchOpen(false);
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
            <Logo shape="responsive" size={114} loading="eager" alt="" />
          </Link>
          <nav className={styles.navigation} aria-label="Navegación principal">
            {headerLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>
          <div className={styles.actions}>
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
            <MobileMenu buttonClassName={styles.searchToggle} onOpen={handleOpenMenu} />
          </div>
        </div>
      </div>
      <HeaderSearch open={searchOpen} inputRef={searchInput} />
    </header>
  );
}
