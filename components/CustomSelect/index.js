import React, { useState, useRef, useEffect } from 'react';

function CustomSelect({ options, onSelect, selectedOption, classes }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

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
            <li key={option.value} onClick={() => handleSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
