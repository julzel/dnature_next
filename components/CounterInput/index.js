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
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (event) => {
    const newValue = event.target.value.replace(/\D/g, "");
    setInputValue(newValue);
    onChange(newValue);
  };

  const decreaseValue = () => {
    const newValue = Math.max(parseInt(inputValue, 10) - 1, 0);
    setInputValue(newValue);
    onChange(newValue);
  };

  const increaseValue = () => {
    const newValue = Math.min(parseInt(inputValue, 10) + 1, maxValue);
    setInputValue(newValue);
    onChange(newValue);
  };

  const isMaxValueExceeded = parseInt(inputValue, 10) >= maxValue;

  return (
    <div className={classes ? classes.counter : ""}>
      <div>
        {controls && (
          <button onClick={decreaseValue} disabled={inputValue === "0"}>
            -
          </button>
        )}
        <input
          id={id}
          name={name}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
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
