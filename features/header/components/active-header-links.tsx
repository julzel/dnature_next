"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { headerLinks } from "../data/navigation";
import { HeaderLinks } from "./header-links";

export function ActiveHeaderLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(function trackContactSection() {
    if (pathname !== "/") return;
    const contact = document.getElementById("contacto");
    if (!contact) return;

    const observer = new IntersectionObserver(function updateContactVisibility([entry]) {
      setContactVisible(entry.isIntersecting);
    });
    observer.observe(contact);
    return function cleanupContactObserver() {
      observer.disconnect();
    };
  }, [pathname]);

  const activeHref = pathname === "/"
    ? (contactVisible ? "/#contacto" : undefined)
    : headerLinks.find(({ href }) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`)))?.href;

  return <HeaderLinks activeHref={activeHref} onNavigate={onNavigate} />;
}
