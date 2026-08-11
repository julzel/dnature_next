import { useId } from 'react';

import styles from './PresentationSelector.module.scss';

export function convertObjectToArray(obj) {
  return Object.keys(obj || {}).map(key => ({
    size: key,
    price: obj[key]
  }));
}

export function getDefaultPresentation(
  presentations,
  productName = '',
  presentationCommerce = {}
) {
  const presentationArray = convertObjectToArray(presentations);

  if (!presentationArray.length) {
    return null;
  }

  const preferred =
    productName.toLowerCase() === 'dnature para gato'
      ? presentationArray[1] || presentationArray[0]
      : presentationArray.find(({ size }) => size === '1kg') ||
        presentationArray[0];

  if (!Object.keys(presentationCommerce || {}).length) {
    return preferred;
  }

  if (presentationCommerce?.[preferred.size]?.availability === 'available') {
    return preferred;
  }

  const available = presentationArray.find(
    ({ size }) => presentationCommerce?.[size]?.availability === 'available'
  );

  if (available) return available;

  if (presentationCommerce?.[preferred.size]?.availability !== 'unavailable') {
    return preferred;
  }

  return (
    presentationArray.find(
      ({ size }) => presentationCommerce?.[size]?.availability === 'unknown'
    ) || preferred
  );
}

const PresentationSelector = ({
  presentations,
  selectedPresentation,
  onPresentationSelect,
  presentationCommerce = {},
}) => {
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
            {presentationCommerce?.[size]?.availability === 'unknown'
                ? ' — disponibilidad por confirmar'
                : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PresentationSelector;
