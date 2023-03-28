// MessageBox.js
import React from "react";
import MessageBox from "./MessageBox";

const MessageBoxContainer = ({ type, children, onClose, onCancel }) => {
  return (
    <MessageBox type={type} onClose={onClose} onCancel={onCancel}>
      {children}
    </MessageBox>
  );
};

export default MessageBoxContainer;
