'use client';

import { useState } from 'react';
import ProductInfo from './ProductInfo';
import {
  ShoppingCartItem,
  useCartContext,
} from '../../../Cart/state';
import { getDefaultPresentation } from '../../PresentationSelector';

const ProductInfoContainer = ({ productDetail }) => {
  const { cart, addOneItem, removeOneItem, getItemsInCart } = useCartContext();
  const hasPriceByUnit = !!productDetail.preciosPorUnidad;
  const [selectedPresentation, setSelectedPresentation] = useState(() =>
    getDefaultPresentation(productDetail.preciosPorUnidad, productDetail.productName)
  );

  const handlePresentationSelect = (selected) => {
    setSelectedPresentation(selected); // Now expects the whole selected object
  };

  const handleAddToCart = () => {
    const newItem = new ShoppingCartItem(
      productDetail.sys.id,
      1,
      productDetail.precio,
      productDetail.productName,
      productDetail.images?.[0]?.url,
      productDetail.medida,
      productDetail.avifySku,
      productDetail.sys.id
    );
    if (hasPriceByUnit && selectedPresentation) {
      newItem.price = parseFloat(selectedPresentation.price);
      newItem.id = `${productDetail.sys.id}-${selectedPresentation.size}`;
      newItem.productName = `${productDetail.productName} ${selectedPresentation.size}`;
      newItem.presentation = selectedPresentation.size;
    }
    addOneItem(newItem);
  };

  const handleRemoveOneItem = () => {
    if (hasPriceByUnit && selectedPresentation) {
      removeOneItem(`${productDetail.sys.id}-${selectedPresentation.size}`);
    } else {
      removeOneItem(productDetail.sys.id);
    }
  }

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
      onRemoveOneItem={handleRemoveOneItem}
      cartTotalItems={cart.totalItems}
      itemsInCart={itemsInCart}
    />
  );
};

export default ProductInfoContainer;
