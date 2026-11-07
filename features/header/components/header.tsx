"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { SearchDialog } from "./search-dialog";
import { MobileMenu } from "./mobile-menu";
import { headerLinks } from "../data/navigation";
import styles from "./header.module.css";

export function Header({ solid = false }: { solid?: boolean }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);

  useEffect(function syncScrollBackground() {
    let frame: number | null = null;
    const desktop = window.matchMedia("(min-width: 1024px)");

    function updateBackground() {
      frame = null;
      // Follow scroll position directly, using a shorter fade on mobile.
      const fadeDistance = desktop.matches ? 60 : 45;
      const opacity = header.current?.dataset.solid === "true" ? 1 : Math.min(1, Math.max(0, window.scrollY / fadeDistance));
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

  function handleOpenSearch() {
    searchButton.current?.focus({ preventScroll: true });
    setSearchOpen(true);
  }

  function handleCloseSearch() {
    setSearchOpen(false);
    searchButton.current?.focus({ preventScroll: true });
  }

  function handleOpenMenu() {
    setSearchOpen(false);
  }

  return (
    <>
      <header ref={header} className={styles.header} data-solid={solid}
        data-light-background={solid || undefined} style={solid ? { "--header-scroll-opacity": 1 } as CSSProperties : undefined}>
        <div className={styles.bottom} data-header-section="bottom">
          <div className={styles.container}>
            <Link className={styles.logo} href="/" aria-label="DNAture, inicio">
              <Logo shape="full" size={114} loading="eager" alt="" />
            </Link>
            <nav className={styles.navigation} aria-label="Navegación principal">
              {headerLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
            </nav>
            <div className={styles.actions}>
              <button
                ref={searchButton}
                className={styles.searchToggle}
                type="button"
                aria-label="Abrir búsqueda"
                aria-haspopup="dialog"
                aria-expanded={searchOpen}
                aria-controls="site-search"
                onClick={handleOpenSearch}
              >
                <Icon name="search" />
              </button>
              <MobileMenu buttonClassName={styles.searchToggle} onOpen={handleOpenMenu} />
            </div>
          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onClose={handleCloseSearch} />
    </>
  );
}
