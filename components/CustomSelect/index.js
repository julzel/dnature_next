import React, { useState, useRef, useEffect } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// local imports
// styles
import styles from "./CustomSelect.module.scss";

function CustomSelect({
  label,
  name,
  options,
  onSelect,
  selectedOption,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const handleSelect = (option) => {
    onSelect({ target: { name, value: option.value } });
    setIsOpen(false);
  };

  const toggleOpen = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      className={`${styles.customSelect} ${className ? className : ""}`}
    >
      {label && <label>{label}:</label>}
      <button onClick={toggleOpen}>
        {selectedOption.label}
        <span>
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </button>
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
