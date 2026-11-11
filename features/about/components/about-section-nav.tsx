"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const compactHeightRef = useRef<number | null>(null);
  const transitionFromRef = useRef<{ height: number; paddingStart: string; paddingEnd: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  useLayoutEffect(function animateNavigationHeight() {
    const nav = navRef.current;
    const from = transitionFromRef.current;
    transitionFromRef.current = null;
    const page = nav?.closest("main");
    if (!nav || !page || !from) return;

    const toHeight = nav.getBoundingClientRect().height;
    if (isSticky) compactHeightRef.current = toHeight;
    const toStyle = getComputedStyle(nav);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || Math.abs(from.height - toHeight) < 1) {
      page.style.setProperty("--about-nav-current-height", `${toHeight}px`);
      return;
    }

    page.style.setProperty("--about-nav-current-height", `${from.height}px`);
    nav.dataset.transitioning = "true";
    const animation = nav.animate([
      { height: `${from.height}px`, paddingBlockStart: from.paddingStart, paddingBlockEnd: from.paddingEnd },
      { height: `${toHeight}px`, paddingBlockStart: toStyle.paddingBlockStart, paddingBlockEnd: toStyle.paddingBlockEnd },
    ], { duration: 200, easing: "cubic-bezier(.2, 0, 0, 1)" });
    animationRef.current = animation;

    animation.onfinish = function finishNavigationAnimation() {
      animationRef.current = null;
      delete nav.dataset.transitioning;
      page.style.setProperty("--about-nav-current-height", `${nav.offsetHeight}px`);
      if (nav.dataset.stuck !== "true") page.style.setProperty("--about-nav-expanded-height", `${nav.offsetHeight}px`);
    };

    return function cancelNavigationAnimation() {
      animation.cancel();
      if (animationRef.current === animation) animationRef.current = null;
      delete nav.dataset.transitioning;
    };
  }, [isSticky]);

  useEffect(function syncNavigation() {
    const nav = navRef.current;
    const sentinel = sentinelRef.current;
    const page = nav?.closest("main");
    if (!nav || !sentinel || !page) return;

    const sections = navigationItems
      .map(({ id }) => document.getElementById(id))
      .filter((section) => section !== null);
    let frame: number | null = null;

    const updateActiveSection = () => {
      frame = null;
      const navBounds = nav.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(nav).insetBlockStart);
      const stuck = sentinel.getBoundingClientRect().top <= stickyTop + 0.5;
      if ((nav.dataset.stuck === "true") !== stuck) {
        // A direction change can happen before the previous animation finishes.
        const style = getComputedStyle(nav);
        transitionFromRef.current = { height: navBounds.height, paddingStart: style.paddingBlockStart, paddingEnd: style.paddingBlockEnd };
        animationRef.current?.cancel();
        animationRef.current = null;
        setIsSticky(stuck);
        if (!stuck) setActiveSection(null);
        return;
      }

      // Keep the opening hero unselected until the menu reaches the header.
      if (!stuck) {
        setActiveSection(null);
        return;
      }

      const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      // Selection follows the settled bar, rather than its animated bottom edge.
      const navigationBottom = stickyTop + (compactHeightRef.current ?? navBounds.height);
      const readingLine = navigationBottom + scrollPadding + 1;
      const lastSection = sections.at(-1);
      const lastBounds = lastSection?.getBoundingClientRect();
      const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
      const currentSection = (atPageEnd && lastBounds && lastBounds.top < window.innerHeight && lastBounds.bottom > navigationBottom ? lastSection : undefined) ?? sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= readingLine && bounds.bottom > readingLine;
      });
      setActiveSection(currentSection?.id ?? null);
    };

    function scheduleUpdate() {
      if (frame === null) frame = window.requestAnimationFrame(updateActiveSection);
    }

    function handleHeaderFocus(event: FocusEvent) {
      if (event.target instanceof Element && event.target.closest("header")) scheduleUpdate();
    }

    const updateHeight = () => {
      // The spacer uses the current height to keep the page from shifting.
      page.style.setProperty("--about-nav-current-height", `${nav.offsetHeight}px`);
      if (nav.dataset.stuck === "true") {
        page.style.setProperty("--about-nav-height", `${nav.offsetHeight}px`);
      } else {
        if (!animationRef.current) page.style.setProperty("--about-nav-expanded-height", `${nav.offsetHeight}px`);
        page.style.setProperty("--about-nav-height", "var(--dn-header-height)");
      }
      scheduleUpdate();
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(nav);
    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    nav.addEventListener("transitionend", scheduleUpdate);
    document.addEventListener("focusin", handleHeaderFocus);
    document.addEventListener("focusout", handleHeaderFocus);

    return function cleanupNavigation() {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      nav.removeEventListener("transitionend", scheduleUpdate);
      document.removeEventListener("focusin", handleHeaderFocus);
      document.removeEventListener("focusout", handleHeaderFocus);
      if (frame !== null) window.cancelAnimationFrame(frame);
      page.style.removeProperty("--about-nav-height");
      page.style.removeProperty("--about-nav-current-height");
      page.style.removeProperty("--about-nav-expanded-height");
    };
  }, []);

  return (
    <>
      <span ref={sentinelRef} className={styles.stickySentinel} aria-hidden="true" />
      <nav ref={navRef} className={styles.sectionNav} data-stuck={isSticky || undefined} aria-label="En esta página">
        <div className={styles.container}>
          {navigationItems.map(({ id, label }) => (
            <a key={id} className={navEffect.link} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined}>
              {label}
            </a>
          ))}
        </div>
      </nav>
      <span className={styles.stickySpacer} aria-hidden="true" />
    </>
  );
}
