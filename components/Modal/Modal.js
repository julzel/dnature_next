import React, { useEffect, useId, useRef } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// local imports
// styles
import styles from "./Modal.module.scss";

const Modal = ({ children, closeModal, padding, responsiveFullScreen }) => {
  const dialogRef = useRef(null);
  const previousActiveElement = useRef(null);
  const titleId = useId();

  useEffect(() => {
    previousActiveElement.current = document.activeElement;
    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = () => [...dialog.querySelectorAll(focusableSelector)];
    const initialFocusTarget = focusableElements()[0] || dialog;
    initialFocusTarget.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && closeModal) {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== 'Tab') return;

      const elements = focusableElements();
      if (!elements.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener('keydown', onKeyDown);
    return () => {
      dialog.removeEventListener('keydown', onKeyDown);
      previousActiveElement.current?.focus?.();
    };
  }, [closeModal]);

  return (
    <div className={styles.modalContainer} onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeModal?.();
    }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`${styles.modal} ${padding ? styles.padding : ""} ${
          responsiveFullScreen ? styles.responsiveFullScreen : ""
        }`}
      >
        {closeModal && (
          <button className={styles.close} onClick={closeModal} type="button" aria-label="Cerrar diálogo">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
        <div id={titleId}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
