import React, { useState, useEffect } from 'react';

import styles from './PresentationSelector.module.scss';

export function convertObjectToArray(obj) {
  return Object.keys(obj).map(key => ({
    size: key,
    price: obj[key]
  }));
}

const PresentationSelector = ({ presentations, selectedPresentation, onPresentationSelect }) => {
  const presentationArray = convertObjectToArray(presentations);
  const [selectedValue, setSelectedValue] = useState(presentationArray[0]);

  const handleChange = (event) => {
    const selectedSize = event.target.value;
    const selected = presentationArray.find(p => p.size === selectedSize);
    setSelectedValue(selected);
    onPresentationSelect(selected); // Adjusted for clearer naming
  };


  useEffect(() => {
    if (selectedPresentation) {
      setSelectedValue(selectedPresentation);
    }
  }, [selectedPresentation]);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="presentation-select">
        Presentación
      </label>
      <select
        className={styles.select}
        id="presentation-select"
        value={selectedValue ? selectedValue.size : ''}
        onChange={handleChange}
      >
        {presentationArray.map(({ size }) => (
          <option value={size} key={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PresentationSelector;
