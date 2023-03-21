import React, { useState } from "react";

const CounterInput = ({
  id,
  name,
  value,
  onChange,
  controls = false,
  maxValue,
  classes,
  errorMessageText,
}) => {
  const [inputValue, setInputValue] = useState(parseInt(value, 10));

  const handleInputChange = (event) => {
    const newValue = parseInt(event.target.value.replace(/\D/g, ""), 10) || 1;
    setInputValue(newValue);
    onChange(newValue);
  };

  const decreaseValue = () => {
    const newValue = Math.max(parseInt(inputValue, 10) - 1, 1);
    setInputValue(newValue);
    onChange(newValue);
  };

  const increaseValue = () => {
    const newValue = Math.min(parseInt(inputValue, 10) + 1, maxValue);
    setInputValue(newValue);
    onChange(newValue);
  };

  const isMaxValueExceeded = parseInt(inputValue, 10) > maxValue;

  return (
    <div className={classes ? classes.counter : ""}>
      <div>
        {controls && (
          <button onClick={decreaseValue} disabled={inputValue === "1"}>
            -
          </button>
        )}
        <input
          id={id}
          name={name}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          min="1"
          max={maxValue}
        />
        {controls && (
          <button onClick={increaseValue} disabled={isMaxValueExceeded}>
            +
          </button>
        )}
      </div>
      {errorMessageText && isMaxValueExceeded && <div style={{ padding: '4px 8px 0'}}>{errorMessageText}</div>}
    </div>
  );
};

export default CounterInput;
