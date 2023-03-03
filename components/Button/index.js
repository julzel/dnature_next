import React from 'react';

const Button = ({ text, children, onClick, className, disabled }) => {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {text ? text : children ? children : null}
    </button>
  );
};

export default Button;
