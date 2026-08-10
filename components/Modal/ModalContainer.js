'use client';

import { useEffect, useRef } from "react";
import { createPortal } from 'react-dom';

// local imports
// components
import Modal from "./Modal";

const ModalContainer = ({
  ariaDescribedBy,
  ariaLabel,
  ariaLabelledBy,
  children,
  closeOnBackdrop,
  closeModal,
  padding,
  responsiveFullScreen,
  returnFocusRef,
  size,
}) => {
  const modalRootRef = useRef(null);

  useEffect(() => {
    // Disable scroll when the modal is mounted
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = document.documentElement.clientWidth
      ? window.innerWidth - document.documentElement.clientWidth
      : 0;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    const backgroundElements = [...document.body.children].filter(
      (element) => element !== modalRootRef.current
    );
    const previousInertValues = backgroundElements.map((element) => ({
      element,
      inert: element.inert,
    }));
    backgroundElements.forEach((element) => {
      element.inert = true;
    });

    // Re-enable scroll when the modal is unmounted
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      previousInertValues.forEach(({ element, inert }) => {
        element.inert = inert;
      });
    };
  }, []);

  const modal = (
    <Modal
      ariaDescribedBy={ariaDescribedBy}
      ariaLabel={ariaLabel}
      ariaLabelledBy={ariaLabelledBy}
      closeOnBackdrop={closeOnBackdrop}
      closeModal={closeModal}
      padding={padding}
      responsiveFullScreen={responsiveFullScreen}
      returnFocusRef={returnFocusRef}
      rootRef={modalRootRef}
      size={size}
    >
      {children}
    </Modal>
  );

  return typeof document === 'undefined'
    ? null
    : createPortal(modal, document.body);
};

export default ModalContainer;
