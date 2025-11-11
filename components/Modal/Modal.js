import React from 'react';
import { X } from 'lucide-react';

// local imports
// styles
import styles from './Modal.module.scss';

const Modal = ({ children, closeModal, padding, fullScreen }) => {
  return (
    <div className={styles.modalContainer}>
      <div
        className={`${styles.modal} ${padding ? styles.padding : ''} ${
          fullScreen ? styles.fullScreen : ''
        }`}
      >
        {closeModal && (
          <button className={styles.close} onClick={closeModal}>
            <X size={24} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
