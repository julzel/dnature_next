import React, { useState } from "react";
import ProductInfo from "./ProductInfo";
import { useCartContext } from "../../../contexts/shopping-cart-context";
import { ShoppingCartItem } from "../../../models/shopping-cart";
import { PRESENTATION_OPTIONS } from "../consts";

const ProductInfoContainer = ({ productDetail }) => {
  // const { cart, addItems } = useCartContext();
  const { cart, addOneItem, removeOneItem, getItemsInCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [presentation, setPresentation] = useState(
    PRESENTATION_OPTIONS[2]
  );

  const handleQuantityChange = (newQuantity) => setQuantity(+newQuantity);

  const handleSelectPresentation = (option) =>
    setPresentation(option);

  const handleAddToCart = () => {
    const newItem = new ShoppingCartItem(
      productDetail.sys.id,
      1,
      productDetail.precio,
      productDetail.productName,
      presentation
        ? [{
            description: presentation.label,
            quantity: (quantity * 1000) / presentation.value,
          }]
        : null,
    );
    addOneItem(newItem);
  };

  const handleRemoveOneItem = (itemId) => removeOneItem(itemId);

  const itemsInCart = getItemsInCart(productDetail.sys.id);

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
      onRemoveOneItem={handleRemoveOneItem}
      itemsInCart={itemsInCart}
    />
  );
};

export default ProductInfoContainer;