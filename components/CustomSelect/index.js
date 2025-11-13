import React, { useState, useRef, useEffect, use, useCallback } from 'react';

function CustomSelect({ options, onSelect, selectedOption, classes }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const handleSelect = useCallback((option) => () => {
    onSelect(option);
    setIsOpen(false);
  }, [onSelect]);

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div ref={ref} className={classes ? classes.select : ''}>
      <button onClick={toggleOpen}>{selectedOption.label}</button>
      {isOpen && (
        <ul>
          {options.map((option) => (
            <li key={option.value} onClick={handleSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
