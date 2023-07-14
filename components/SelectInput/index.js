import React from 'react';
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';

const SelectInput = ({ label, id, value, options, onChange }) => {
  const handleChange = (event) => onChange(event.target.value);
  
  return (
    <FormControl fullWidth>
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        labelId={id}
        id={`${id}-required`}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map((option, i) => (
          <MenuItem value={option.value} key={i}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
