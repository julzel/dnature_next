import React from 'react';

const Checkbox = ({ label, name, onChange, className, checked }) => (
  <div className={className}>
    <input
      id='checkbox'
      type='checkbox'
      name={name}
      onChange={onChange}
      checked={checked}
    />
    <label htmlFor='checkbox'>{label}</label>
  </div>
);

export default Checkbox;
