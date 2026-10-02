// MessageBox.js
import React from "react";
import Button from "../Button";

// local imports

const MessageBox = ({ children, type, onClose, onCancel }) => {
  return (
    <div>
      {children}
      <div>
        {onCancel && (
          <Button
            variant="secondary"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
        {onClose && (
          <Button
            variant={type === 'warning' || type === 'error' ? 'danger' : 'primary'}
            onClick={onClose}
          >
            Ok
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
