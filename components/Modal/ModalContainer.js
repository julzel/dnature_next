import React, { useEffect } from "react";

// local imports
// components
import Modal from "./Modal";

const ModalContainer = ({ children, closeModal }) => {

  useEffect(() => {
    // Disable scroll when the modal is mounted
    document.body.style.overflow = "hidden";

    // Re-enable scroll when the modal is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return <Modal closeModal={closeModal}>{children}</Modal>;
};

export default ModalContainer;
