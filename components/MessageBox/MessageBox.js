// MessageBox.js
import React from "react";
import Button from "../Button";

// local imports
// styles
import styles from "./MessageBox.module.scss";

const MessageBox = ({ children, type, onClose, onCancel }) => {
  return (
    <div className={`${styles.messageBoxContainer} ${styles[type]}`}>
      {children}
      <div className={styles.actions}>
        {onCancel && (
          <Button
            className={`${styles.button} ${styles.variant}`}
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
        {onClose && (
          <Button className={styles.button} onClick={onClose}>
            Ok
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
