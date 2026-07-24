'use client';

import { useState } from 'react';
import ProductInfo from './ProductInfo';
import {
  ShoppingCartItem,
  useCartContext,
} from '../../../Cart/state';
import { getDefaultPresentation } from '../../PresentationSelector';

const ProductInfoContainer = ({ productDetail }) => {
  const { cart, addItems, getItemsInCart } = useCartContext();
  const hasPriceByUnit = !!productDetail.preciosPorUnidad;
  const [selectedPresentation, setSelectedPresentation] = useState(() =>
    getDefaultPresentation(productDetail.preciosPorUnidad, productDetail.productName)
  );

  const handlePresentationSelect = (selected) => {
    setSelectedPresentation(selected); // Now expects the whole selected object
  };

  const handleAddToCart = (quantity) => {
    const newItem = new ShoppingCartItem(
      productDetail.sys.id,
      quantity,
      productDetail.precio,
      productDetail.productName,
      null
    );
    if (hasPriceByUnit && selectedPresentation) {
      newItem.price = parseFloat(selectedPresentation.price);
      newItem.id = `${productDetail.sys.id}-${selectedPresentation.size}`;
      newItem.productName = `${productDetail.productName} ${selectedPresentation.size}`;
    }
    addItems(newItem);
  };

  const itemsInCart =
    hasPriceByUnit && selectedPresentation
      ? getItemsInCart(`${productDetail.sys.id}-${selectedPresentation.size}`)
      : getItemsInCart(productDetail.sys.id);

  return (
    <ProductInfo
      productDetail={productDetail}
      hasPriceByUnit={hasPriceByUnit}
      selectedPresentation={selectedPresentation}
      handlePresentationSelect={handlePresentationSelect}
      onAddToCart={handleAddToCart}
      cartTotalItems={cart.totalItems}
      itemsInCart={itemsInCart}
    />
  );
};

export default ProductInfoContainer;
