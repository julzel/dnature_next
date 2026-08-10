'use client';

import { useEffect, useRef } from "react";
import { createPortal } from 'react-dom';

// local imports
// components
import Modal from "./Modal";

const ModalContainer = ({
  ariaLabel,
  children,
  closeModal,
  padding,
  responsiveFullScreen,
  returnFocusRef,
}) => {
  const modalRootRef = useRef(null);

  useEffect(() => {
    // Disable scroll when the modal is mounted
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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
      previousInertValues.forEach(({ element, inert }) => {
        element.inert = inert;
      });
    };
  }, []);

  const modal = (
    <Modal
      ariaLabel={ariaLabel}
      closeModal={closeModal}
      padding={padding}
      responsiveFullScreen={responsiveFullScreen}
      returnFocusRef={returnFocusRef}
      rootRef={modalRootRef}
    >
      {children}
    </Modal>
  );

  return typeof document === 'undefined'
    ? null
    : createPortal(modal, document.body);
};

export default ModalContainer;
