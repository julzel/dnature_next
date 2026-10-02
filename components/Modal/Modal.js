import { useEffect, useRef } from 'react';

const Modal = ({
  ariaDescribedBy,
  ariaLabel = 'Diálogo',
  ariaLabelledBy,
  children,
  closeLabel = 'Cerrar diálogo',
  closeOnBackdrop = true,
  closeModal,
  returnFocusRef,
}) => {
  const dialogRef = useRef(null);
  const closeModalRef = useRef(closeModal);

  useEffect(() => {
    closeModalRef.current = closeModal;
  }, [closeModal]);

  useEffect(() => {
    const previousActiveElement = document.activeElement;
    const explicitReturnTarget = returnFocusRef?.current;
    const dialog = dialogRef.current;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = () => [...dialog.querySelectorAll(focusableSelector)];

    // Native dialogs supply the backdrop and make the rest of the page inert.
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.open = true;
    }
    (focusableElements()[0] || dialog).focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && closeModalRef.current) {
        event.preventDefault();
        closeModalRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const elements = focusableElements();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (!first) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && document.activeElement === first) {
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
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.open = false;
      const returnTarget = explicitReturnTarget || previousActiveElement;
      if (returnTarget?.isConnected) returnTarget.focus();
    };
  }, [returnFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      data-dnature-modal-root
      aria-modal='true'
      aria-label={ariaLabelledBy ? undefined : ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      tabIndex={-1}
      onCancel={(event) => {
        event.preventDefault();
        closeModal?.();
      }}
      onClick={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) {
          closeModal?.();
        }
      }}
    >
      {closeModal && (
        <button onClick={closeModal} type='button' aria-label={closeLabel}>
          {closeLabel}
        </button>
      )}
      <div>{children}</div>
    </dialog>
  );
};

export default Modal;
