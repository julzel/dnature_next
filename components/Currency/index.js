import React from 'react';

const CurrencyText = ({ value, curr }) => {
  const currency = curr || 'CRC';

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
