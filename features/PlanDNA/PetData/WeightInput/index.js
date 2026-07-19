import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { isValidPetWeight } from '../../../../util/portion-size';

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;
  return (
    <input
      {...other}
      ref={ref}
      onChange={(event) => {
        onChange({
          target: {
            value: event.target.value,
          },
        });
      }}
      pattern="[0-9]*([.][0-9]*)?"
    />
  );
});

const WeightInput = ({ weight, handleChange, label, helpText }) => {
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');

  const handleWeightChange = (e) => {
    const value = e.target.value;
    const hasValue = value.trim() !== '';
    const validWeight = !hasValue || isValidPetWeight(value);

    setError(!validWeight);
    setHelperText(validWeight ? '' : helpText);
    handleChange(value);
  };

  return (
    
    <TextField
      error={error}
      helperText={helperText}
      fullWidth
      label={label}
      variant="outlined"
      value={weight}
      onChange={handleWeightChange}
      InputProps={{
        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
        inputComponent: NumberFormatCustom,
      }}
      inputProps={{ inputMode: 'decimal', min: 0.1, max: 100, step: 0.1 }}
    />
  );
};

export default WeightInput;
