import React, { useState } from 'react';

const InputNumber = ({
  className,
  label,
  id,
  name,
  min,
  max,
  errorMessageText,
  errorClassName,
  value,
  setValue,
}) => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleOnChange = (event) => {
    const value = event.target.value;
    if (value < 1 || value > 200) {
      setErrorMessage(errorMessageText);
    } else {
      setValue(value);
      setErrorMessage('');
    }
  };
  return (
    <div className={`${className} ${errorClassName}`}>
      <label htmlFor={id}>{label}</label>
      <input
        type='number'
        id={id}
        name={name}
        value={value}
        onChange={handleOnChange}
        min={min}
        max={max}
      />
      {errorMessage && <div className={errorClassName}>{errorMessage}</div>}
    </div>
  );
};

export default InputNumber;
