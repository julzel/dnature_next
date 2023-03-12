import React from "react";

// local imports
// contexts
import { useCartContext } from "../../contexts/shopping-cart-context";

// components
import Cart from "./Cart";

const CartContainer = () => {
  const { cart, addOneItem, addItems, removeOneItem, removeAllItems, removeAllItemsOfAKind } = useCartContext();

  return (
    <Cart
      cart={cart}
      addItems={addItems}
      addOneItem={addOneItem}
      removeOneItem={removeOneItem}
      removeAllItems={removeAllItems}
      removeAllItemsOfAKind={removeAllItemsOfAKind}
    />
  );
};

export default CartContainer;
