import React from "react";

// local imports
// components
import Modal from "./Modal";

const ModalContainer = ({ children, closeModal }) => {
  return <Modal closeModal={closeModal}>{children}</Modal>;
};

export default ModalContainer;
