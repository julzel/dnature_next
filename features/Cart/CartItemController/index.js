import React from "react";

// local imports
// components
import CartItemController from "./CartItemController";

// contexts
import { useCartContext } from "../../../contexts/shopping-cart-context";

const CartItemControllerContainer = ({ item }) => {
  const { addOneItem, removeOneItem, removeAllItemsOfAKind } = useCartContext();
  return (
    <CartItemController
      item={item}
      removeOneItem={removeOneItem}
      removeAllItemsOfAKind={removeAllItemsOfAKind}
      addOneItem={addOneItem}
    />
  );
};

export default CartItemControllerContainer;
