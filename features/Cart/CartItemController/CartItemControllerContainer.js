import React from "react";
import CartItemController from "./CartItemController";

const CartItemControllerContainer = ({
  item,
  addOneItem,
  removeOneItem,
  removeAllItemsOfAKind,
}) => {
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
