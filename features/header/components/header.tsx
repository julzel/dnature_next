"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import { SearchDialog } from "./search-dialog";
import { MobileMenu } from "./mobile-menu";
import { HeaderLinks } from "./header-links";
import { ActiveHeaderLinks } from "./active-header-links";
import { CartLink } from "@/features/cart/components/cart-link";
import styles from "./header.module.css";

export function Header({ solid = false }: { solid?: boolean }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);

  useEffect(function syncScrollAppearance() {
    let frame: number | null = null;
    let previousY = Math.max(0, window.scrollY);
    let direction = 0;
    let distance = 0;
    const desktop = window.matchMedia("(min-width: 1024px)");

    function updateAppearance() {
      frame = null;
      const element = header.current;
      if (!element) return;
      // Clamp overscroll so rubber-banding cannot reverse the detected direction.
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.min(maxY, Math.max(0, window.scrollY));
      const delta = y - previousY;
      previousY = y;

      // Follow scroll position directly, using a shorter fade on mobile.
      const fadeDistance = desktop.matches ? 60 : 45;
      const opacity = element.dataset.solid === "true" ? 1 : Math.min(1, y / fadeDistance);
      element.style.setProperty("--header-scroll-opacity", String(opacity));
      element.toggleAttribute("data-light-background", opacity >= 0.4);

      if (y <= element.offsetHeight || element.contains(document.activeElement) || element.querySelector('[aria-expanded="true"]')) {
        element.removeAttribute("data-scroll-hidden");
        direction = 0;
        distance = 0;
        return;
      }

      if (delta === 0) return;
      const nextDirection = Math.sign(delta);
      distance = nextDirection === direction ? distance + Math.abs(delta) : Math.abs(delta);
      direction = nextDirection;
      // Require a little deliberate movement in either direction to avoid jitter.
      if (distance >= (direction > 0 ? 8 : 12)) {
        element.toggleAttribute("data-scroll-hidden", direction > 0);
        distance = 0;
      }
    }

    function handleScroll() {
      if (frame === null) frame = window.requestAnimationFrame(updateAppearance);
    }

    updateAppearance();
    window.addEventListener("scroll", handleScroll, { passive: true });
    desktop.addEventListener("change", handleScroll);
    return function cleanupScrollAppearance() {
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
              <Suspense fallback={<HeaderLinks />}>
                <ActiveHeaderLinks />
              </Suspense>
            </nav>
            <div className={styles.actions}>
              <CartLink className={styles.searchToggle} />
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
