'use client';

import { useEffect } from "react";

// local imports
// components
import Modal from "./Modal";

const ModalContainer = ({
  children,
  closeModal,
  padding,
  responsiveFullScreen,
}) => {
  useEffect(() => {
    // Disable scroll when the modal is mounted
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Re-enable scroll when the modal is unmounted
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <Modal
      closeModal={closeModal}
      padding={padding}
      responsiveFullScreen={responsiveFullScreen}
    >
      {children}
    </Modal>
  );
};

export default ModalContainer;
