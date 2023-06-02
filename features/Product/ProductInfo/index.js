import React, { useState } from "react";
import ProductInfo from "./ProductInfo";
import { useCartContext } from "../../../contexts/shopping-cart-context";
import { ShoppingCartItem } from "../../../models/shopping-cart";
import { PRESENTATION_OPTIONS } from "../consts";

const ProductInfoContainer = ({ productDetail }) => {
  const { cart, addItems } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [presentation, setPresentation] = useState(
    PRESENTATION_OPTIONS[2]
  );

  const handleQuantityChange = (newQuantity) => setQuantity(+newQuantity);

  const handleSelectPresentation = (option) =>
    setPresentation(option);

  const handleAddToCart = (item) => {
    const newItem = new ShoppingCartItem(
      item.sys.id,
      quantity,
      item.precio,
      item.productName,
      presentation
        ? [{
            description: presentation.label,
            quantity: (quantity * 1000) / presentation.value,
          }]
        : null,
    );
    addItems(newItem);
  };

  return (
    <ProductInfo
      quantity={quantity}
      onQuantityChange={handleQuantityChange}
      presentation={presentation}
      onPresentationChange={handleSelectPresentation}
      productDetail={productDetail}
      onAddToCart={handleAddToCart}
      cartTotalItems={cart.totalItems}
      presentationOptions={PRESENTATION_OPTIONS}
    />
  );
};

export default ProductInfoContainer;