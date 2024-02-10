import React, { useState } from "react";
import ProductInfo from "./ProductInfo";
import { useCartContext } from "../../../contexts/shopping-cart-context";
import { ShoppingCartItem } from "../../../models/shopping-cart";
import { PRESENTATION_OPTIONS } from "../consts";

const ProductInfoContainer = ({ productDetail }) => {
  const { cart, addOneItem, removeOneItem, getItemsInCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [presentation, setPresentation] = useState(
    PRESENTATION_OPTIONS[2]
  );

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

  console.log(productDetail);

  return (
    <ProductInfo
      productDetail={productDetail}
      presentation={presentation}
      onPresentationChange={handleSelectPresentation}
      presentationOptions={PRESENTATION_OPTIONS}
      onAddToCart={handleAddToCart}
      onRemoveOneItem={handleRemoveOneItem}
      cartTotalItems={cart.totalItems}
      itemsInCart={itemsInCart}
    />
  );
};

export default ProductInfoContainer;