import React, { useState } from "react";
import ProductInfo from "./ProductInfo";
import { useCartContext } from "../../../contexts/shopping-cart-context";
import { PRESENTATION_OPTIONS } from "../consts";

const ProductInfoContainer = ({ productDetail, addToCart }) => {
  const { cart } = useCartContext();
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
      addToCart={addToCart}
      cartTotalItems={cart.totalItems}
      presentationOptions={PRESENTATION_OPTIONS}
    />
  );
};

export default ProductInfoContainer;