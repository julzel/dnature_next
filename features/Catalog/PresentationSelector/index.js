import { useId } from 'react';

import styles from './PresentationSelector.module.scss';

export function convertObjectToArray(obj) {
  return Object.keys(obj || {}).map(key => ({
    size: key,
    price: obj[key]
  }));
}

export function getDefaultPresentation(presentations, productName = '') {
  const presentationArray = convertObjectToArray(presentations);

  if (!presentationArray.length) {
    return null;
  }

  if (productName.toLowerCase() === 'dnature para gato') {
    return presentationArray[1] || presentationArray[0];
  }

  return presentationArray.find((presentation) => presentation.size === '1kg') || presentationArray[0];
}

const PresentationSelector = ({ presentations, selectedPresentation, onPresentationSelect }) => {
  const presentationArray = convertObjectToArray(presentations);
  const selectId = useId();
  const selectedValue = selectedPresentation || presentationArray[0] || null;

  const handleChange = (event) => {
    const selectedSize = event.target.value;
    const selected = presentationArray.find(p => p.size === selectedSize);
    onPresentationSelect(selected);
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={selectId}>
        Presentación
      </label>
      <select
        className={styles.select}
        id={selectId}
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
