import React, { useState, useEffect } from 'react';
import ProductInfo from './ProductInfo';
import { useCartContext } from '../../../contexts/shopping-cart-context';
import { ShoppingCartItem } from '../../../models/shopping-cart';
import { convertObjectToArray } from '../../../components/PresentationSelector'; // Components

const DEFAULT_SIZE = '1kg';

const ProductInfoContainer = ({ productDetail }) => {
  const { cart, addOneItem, removeOneItem, getItemsInCart } = useCartContext();
  const hasPriceByUnit = !!productDetail.preciosPorUnidad;
  const [selectedPresentation, setSelectedPresentation] = useState(null);

  const handlePresentationSelect = (selected) => {
    setSelectedPresentation(selected); // Now expects the whole selected object
  };

  const handleAddToCart = () => {
    const newItem = new ShoppingCartItem(
      productDetail.sys.id,
      1,
      productDetail.precio,
      productDetail.productName,
      null
    );
    if (hasPriceByUnit && selectedPresentation) {
      newItem.price = parseFloat(selectedPresentation.price);
      newItem.id = `${productDetail.sys.id}-${selectedPresentation.size}`;
      newItem.productName = `${productDetail.productName} ${selectedPresentation.size}`;
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

  useEffect(() => {
    if (hasPriceByUnit) {
      const presentationArray = convertObjectToArray(
        productDetail.preciosPorUnidad
      );
      const selectedPresentation = productDetail.productName.toLowerCase() !== 'dnature para gato'
        ? presentationArray.find((p) => p.size === DEFAULT_SIZE)
        : (presentationArray.length > 1 ? presentationArray[1] : presentationArray[0] || null);
      setSelectedPresentation(selectedPresentation);
    }
  }, [hasPriceByUnit, productDetail]);

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
