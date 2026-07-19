import React, { useEffect, useRef } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// local imports
// styles
import styles from "./Modal.module.scss";

const Modal = ({
  ariaLabel = 'Diálogo',
  children,
  closeModal,
  padding,
  responsiveFullScreen,
  rootRef,
}) => {
  const dialogRef = useRef(null);
  const previousActiveElement = useRef(null);
  const closeModalRef = useRef(closeModal);

  useEffect(() => {
    closeModalRef.current = closeModal;
  }, [closeModal]);

  useEffect(() => {
    previousActiveElement.current = document.activeElement;
    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = () => [...dialog.querySelectorAll(focusableSelector)];
    const initialFocusTarget = focusableElements()[0] || dialog;
    initialFocusTarget.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && closeModalRef.current) {
        event.preventDefault();
        closeModalRef.current();
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
      if (previousActiveElement.current?.isConnected) {
        previousActiveElement.current.focus();
      }
    };
  }, []);

  return (
    <div ref={rootRef} data-dnature-modal-root className={styles.modalContainer} onMouseDown={(event) => {
      if (event.target === event.currentTarget) closeModal?.();
    }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
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
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
