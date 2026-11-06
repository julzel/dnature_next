"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./animated-illustration.module.css";

export function AnimatedIllustration({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(function observeVisibility() {
    const element = container.current;
    if (!element) return;

    const observer = new IntersectionObserver(function handleVisibility(entries) {
      for (const entry of entries) {
        element.toggleAttribute("data-in-view", entry.isIntersecting);
      }
    }, { threshold: 0.5 });

    observer.observe(element);
    return function cleanupObserver() { observer.disconnect(); };
  }, []);

  return <div ref={container} className={styles.illustration}>{children}</div>;
}
