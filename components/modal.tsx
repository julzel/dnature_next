"use client";

import type { ReactNode, RefObject } from "react";
import { Icon } from "./icon";

export function Modal({ dialogRef, titleId, children, onClose, className = "" }: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  titleId: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  return <dialog ref={dialogRef} aria-labelledby={titleId} className={`modal ${className}`} onClose={onClose} onClick={(event) => {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  }}>
    <div className="modal-content">
      <button type="button" className="icon-button modal-close" aria-label="Cerrar ventana" onClick={() => dialogRef.current?.close()}><Icon name="close" /></button>
      {children}
    </div>
  </dialog>;
}
