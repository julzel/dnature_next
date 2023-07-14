import React from 'react';
import { TextField, InputAdornment } from '@mui/material';

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
    const value = parseFloat(e.target.value);
    if (value < 0.1 || value > 200) {
      setError(true);
      setHelperText(helpText);
    } else {
      setError(false);
      setHelperText('');
      handleChange(e.target.value);
    }
  };

  return (
    <TextField
      error={error}
      helperText={helperText}
      fullWidth
      label={label}
      variant="filled"
      value={weight}
      onChange={handleWeightChange}
      InputProps={{
        startAdornment: <InputAdornment position="start">kg</InputAdornment>,
        inputComponent: NumberFormatCustom,
      }}
    />
  );
};

export default WeightInput;
