"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, type MouseEvent, type ReactNode, type SyntheticEvent } from "react";
import { SectionEyebrow } from "./section-eyebrow";
import styles from "./drawer.module.css";

type DrawerProps = {
  open: boolean;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
};

export function Drawer({ open, title, eyebrow, children, footer, onClose }: DrawerProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const pointerOnBackdrop = useRef(false);

  const requestClose = useCallback(function closeDrawer() {
    const dialog = dialogRef.current;
    const frame = frameRef.current;
    if (!dialog?.open || !frame || dialog.hasAttribute("data-closing")) return;
    dialog.setAttribute("data-closing", "");
    // Flush the new style before checking which transitions are running.
    void getComputedStyle(frame).translate;
    const animations = [...frame.getAnimations(), ...dialog.getAnimations()].filter((animation) => animation.playState === "running" || animation.pending);
    function finishClose() {
      if (dialog?.isConnected && dialog.open && dialog.hasAttribute("data-closing")) dialog.close();
    }
    if (animations.length) void Promise.allSettled(animations.map((animation) => animation.finished)).then(finishClose);
    else finishClose();
  }, []);

  useEffect(function syncOpen() {
    const dialog = dialogRef.current;
    if (!open) { requestClose(); return; }
    if (!dialog?.open) {
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog?.showModal();
      bodyRef.current?.scrollTo(0, 0);
      titleRef.current?.focus({ preventScroll: true });
    }
  }, [open, requestClose]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    requestClose();
  }

  function handlePointerDown(event: SyntheticEvent<HTMLDialogElement>) {
    pointerOnBackdrop.current = event.currentTarget === event.target;
  }

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (pointerOnBackdrop.current && event.currentTarget === event.target) requestClose();
  }

  function handleClose(event: SyntheticEvent<HTMLDialogElement>) {
    event.currentTarget.removeAttribute("data-closing");
    pointerOnBackdrop.current = false;
    if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    opener.current = null;
    onClose();
  }

  return <dialog ref={dialogRef} className={styles.drawer} aria-labelledby={titleId} onCancel={handleCancel}
    onClose={handleClose} onPointerDown={handlePointerDown} onClick={handleClick}>
    <div className={styles.frame} ref={frameRef}>
      <header className={styles.header}>
        <div>
          {eyebrow && <SectionEyebrow label={eyebrow} />}
          <h2 id={titleId} ref={titleRef} tabIndex={-1}>{title}</h2>
        </div>
        <button type="button" className={styles.close} aria-label="Cerrar panel" onClick={requestClose}><X size={22} aria-hidden="true" /></button>
      </header>
      <div className={styles.body} ref={bodyRef}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  </dialog>;
}
