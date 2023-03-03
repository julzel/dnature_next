import React, { useState } from 'react';
import ProductInfo from './ProductInfo';

const ProductInfoContainer = ({ productDetail, onBuyItem }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  return (
    <ProductInfo
      quantity={quantity}
      onQuantityChange={handleQuantityChange}
      productDetail={productDetail}
      onBuyItem={onBuyItem}
    />
  );
};

export default ProductInfoContainer;
