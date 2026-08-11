'use client';

import { useState } from 'react';
import ProductInfo from './ProductInfo';
import {
  ShoppingCartItem,
  useCartContext,
} from '../../../Cart/state';
import { getDefaultPresentation } from '../../PresentationSelector';
import {
  getAvailabilityUi,
  getPresentationCommerce,
} from '../../lib/avify-commerce';

const ProductInfoContainer = ({ productDetail }) => {
  const { cart, addOneItem, removeOneItem, getItemsInCart } = useCartContext();
  const hasPriceByUnit = !!productDetail.preciosPorUnidad;
  const [selectedPresentation, setSelectedPresentation] = useState(() =>
    getDefaultPresentation(
      productDetail.preciosPorUnidad,
      productDetail.productName,
      productDetail.commerce?.presentations
    )
  );
  const selectedCommerce = selectedPresentation
    ? getPresentationCommerce(productDetail, selectedPresentation.size)
    : null;
  const availability = hasPriceByUnit
    ? selectedCommerce?.availability || 'unknown'
    : productDetail.commerce?.availability || 'unknown';
  const availableQuantity = hasPriceByUnit
    ? selectedCommerce?.availableQuantity
    : productDetail.commerce?.availableQuantity;
  const onDemand = hasPriceByUnit
    ? selectedCommerce?.onDemand
    : productDetail.commerce?.onDemand;
  const availabilityUi = getAvailabilityUi({
    availability,
    availableQuantity,
    onDemand,
  });
  const isAvailableToAdd =
    !productDetail.commerce || availabilityUi.canPurchase;
  const itemsInCart =
    hasPriceByUnit && selectedPresentation
      ? getItemsInCart(`${productDetail.sys.id}-${selectedPresentation.size}`)
      : getItemsInCart(productDetail.sys.id);
  const canAddToCart =
    isAvailableToAdd &&
    (!Number.isFinite(availableQuantity) || itemsInCart < availableQuantity);

  const handlePresentationSelect = (selected) => {
    setSelectedPresentation(selected);
  };

  const handleAddToCart = () => {
    if (!isAvailableToAdd) return;

    const effectiveSku =
      selectedCommerce?.variantSku || productDetail.avifySku;
    const newItem = new ShoppingCartItem(
      productDetail.sys.id,
      1,
      productDetail.precio,
      productDetail.productName,
      productDetail.images?.[0]?.url,
      productDetail.medida,
      effectiveSku,
      productDetail.sys.id
    );
    if (hasPriceByUnit && selectedPresentation) {
      newItem.price = parseFloat(selectedPresentation.price);
      newItem.id = `${productDetail.sys.id}-${selectedPresentation.size}`;
      newItem.productName = `${productDetail.productName} ${selectedPresentation.size}`;
      newItem.presentation = selectedPresentation.size;
    }

    if (productDetail.commerce?.mapped) {
      newItem.parentSku = productDetail.commerce.parentSku;
      newItem.avifyProductId = productDetail.commerce.productId;
      if (selectedCommerce?.variantId) {
        newItem.avifyVariantId = selectedCommerce.variantId;
      }
      if (selectedCommerce?.attributes?.length) {
        newItem.avifyAttributes = selectedCommerce.attributes;
      }
    }
    addOneItem(newItem);
  };

  const handleRemoveOneItem = () => {
    if (hasPriceByUnit && selectedPresentation) {
      removeOneItem(`${productDetail.sys.id}-${selectedPresentation.size}`);
    } else {
      removeOneItem(productDetail.sys.id);
    }
  };

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
      availabilityUi={availabilityUi}
      canAddToCart={canAddToCart}
    />
  );
};

export default ProductInfoContainer;
