"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { headerLinks } from "../data/navigation";
import styles from "./mobile-menu.module.css";

type MobileMenuProps = {
  buttonClassName: string;
  onOpen: () => void;
};

export function MobileMenu({ buttonClassName, onOpen }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  function handleOpen() {
    onOpen();
    button.current?.focus({ preventScroll: true });
    dialog.current?.showModal();
    setOpen(true);
  }

  function handleClose() {
    dialog.current?.close();
  }

  function handleClosed() {
    setOpen(false);
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      handleClose();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]");
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && event.target === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && event.target === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  useEffect(function closeOnDesktop() {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const element = dialog.current;
    function handleBreakpoint() {
      if (desktop.matches) element?.close();
    }
    desktop.addEventListener("change", handleBreakpoint);
    return function cleanup() {
      desktop.removeEventListener("change", handleBreakpoint);
      element?.close();
    };
  }, []);

  return (
    <>
      <button
        ref={button}
        className={`${buttonClassName} ${styles.toggle}`}
        type="button"
        aria-label="Abrir menú"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={handleOpen}
      >
        <Menu size={24} strokeWidth={1.6} aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className={styles.drawer}
        aria-labelledby="mobile-menu-title"
        onClose={handleClosed}
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.heading}>
          <h2 id="mobile-menu-title">Menú</h2>
          <button className={styles.close} type="button" aria-label="Cerrar menú" onClick={handleClose}>
            <X size={24} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
        <nav className={styles.navigation} aria-label="Navegación móvil">
          {headerLinks.map((link) => <Link key={link.href} href={link.href} onClick={handleClose}>{link.label}</Link>)}
        </nav>
      </dialog>
    </>
  );
}
