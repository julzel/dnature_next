'use client';

import { createPortal } from 'react-dom';

import Modal from './Modal';

const ModalContainer = ({
  ariaDescribedBy,
  ariaLabel,
  ariaLabelledBy,
  children,
  closeLabel,
  closeOnBackdrop,
  closeModal,
  returnFocusRef,
}) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <Modal
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
