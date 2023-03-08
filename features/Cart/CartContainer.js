import React from "react";

// local imports
// contexts
import { useShoppingCartContext } from "../../contexts/shopping-cart-context";

// components
import Cart from "./Cart";

const CartContainer = () => {
  const { cart } = useShoppingCartContext();
  
  return <Cart cart={cart} />;
};

export default CartContainer;
