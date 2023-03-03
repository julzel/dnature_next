import React, { useState } from 'react';

const CurrencyText = ({ value, defaultCurrency }) => {
  const [currency, setCurrency] = useState(defaultCurrency || 'CRC');

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <span>
      <span>{currency === 'USD' ? '$' : '₡'}</span>
      <span>{formatNumber(value)}</span>
    </span>
  );
};

export default CurrencyText;
