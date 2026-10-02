'use client';

import { createPortal } from 'react-dom';

import Modal from './Modal';

const ModalContainer = ({
  ariaDescribedBy,
  ariaLabel,
  ariaLabelledBy,
  children,
  className,
  closeLabel,
  closeOnBackdrop,
  closeModal,
  returnFocusRef,
}) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <Modal
      className={className}
      ariaDescribedBy={ariaDescribedBy}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      closeLabel={closeLabel}
      closeOnBackdrop={closeOnBackdrop}
      closeModal={closeModal}
      returnFocusRef={returnFocusRef}
    >
      {children}
    </Modal>,
    document.body
  );
};

export default ModalContainer;
