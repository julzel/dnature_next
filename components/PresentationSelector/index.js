import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

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
    <FormControl fullWidth>
      <InputLabel id="presentation-select-label">Presentación</InputLabel>
      <Select
        labelId="presentation-select-label"
        id="presentation-select"
        value={selectedValue ? selectedValue.size : ''}
        label="Presentation"
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
      >
        {presentationArray.map(({ size }) => (
          <MenuItem value={size} key={size}>
            {size}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PresentationSelector;