import React from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// local imports
// styles
import styles from "./Modal.module.scss";

const Modal = ({ children, closeModal }) => {
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modal}>
        {closeModal && (
          <button className={styles.close} onClick={closeModal}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
