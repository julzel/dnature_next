"use client";

import { useEffect, useRef, useState } from "react";
import navEffect from "@/components/center-out-nav-link.module.css";
import styles from "./about.module.css";

const navigationItems = [
  { id: "proposito", label: "Nuestro propósito" },
  { id: "direccion", label: "Misión y visión" },
  { id: "esencia", label: "Nuestra esencia" },
  { id: "acompanamiento", label: "Sigamos cerca" },
];

export function AboutSectionNav() {
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(function syncNavigation() {
    const nav = navRef.current;
    const page = nav?.closest("main");
    if (!nav || !page) return;

    const sections = navigationItems
      .map(({ id }) => document.getElementById(id))
      .filter((section) => section !== null);
    let frame: number | null = null;

    const updateActiveSection = () => {
      frame = null;
      const navBounds = nav.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(nav).insetBlockStart);

      // Keep the opening hero unselected until the menu reaches the header.
      if (navBounds.top > stickyTop + 1) {
        setActiveSection(null);
        return;
      }

      const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const readingLine = navBounds.bottom + scrollPadding + 1;
      const currentSection = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= readingLine && bounds.bottom > readingLine;
      });
      setActiveSection(currentSection?.id ?? null);
    };

    function scheduleUpdate() {
      if (frame === null) frame = window.requestAnimationFrame(updateActiveSection);
    }

    const updateHeight = () => {
      page.style.setProperty("--about-nav-height", `${nav.offsetHeight}px`);
      scheduleUpdate();
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(nav);
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return function cleanupNavigation() {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
      page.style.removeProperty("--about-nav-height");
    };
  }, []);

  return (
    <nav ref={navRef} className={styles.sectionNav} aria-label="En esta página">
      <div className={styles.container}>
        {navigationItems.map(({ id, label }) => (
          <a key={id} className={navEffect.link} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined}>
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
