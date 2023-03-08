import React, { useState } from "react";
import ProductInfo from "./ProductInfo";
import { useShoppingCartContext } from "../../../contexts/shopping-cart-context";
import { PRESENTATION_OPTIONS } from "../consts";

const ProductInfoContainer = ({ productDetail, onBuyItem }) => {
  const { cart } = useShoppingCartContext();
  const [quantity, setQuantity] = useState(1);
  const [presentation, setPresentation] = useState(
    PRESENTATION_OPTIONS[2]
  );

  const handleQuantityChange = (newQuantity) => setQuantity(newQuantity);

  const handleSelectPresentation = (option) =>
    setPresentation(option);

  return (
    <ProductInfo
      quantity={quantity}
      onQuantityChange={handleQuantityChange}
      presentation={presentation}
      onPresentationChange={handleSelectPresentation}
      productDetail={productDetail}
      onBuyItem={onBuyItem}
      cartTotalItems={cart.totalItems}
      presentationOptions={PRESENTATION_OPTIONS}
    />
  );
};

export default ProductInfoContainer;