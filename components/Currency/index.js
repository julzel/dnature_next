import React, { useState } from 'react';

const CurrencyText = ({ value, curr }) => {
  const [currency, setCurrency] = useState(curr || 'CRC');

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <>
      <span>{currency === 'CRC' ? '₡' : '$'}</span>
      <span>{formatNumber(value)}</span>
    </>
  );
};

export default CurrencyText;
