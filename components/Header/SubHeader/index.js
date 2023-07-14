import React from 'react';

// local imports
// components
import SubHeader from './SubHeader';

// context
import { useCartContext} from "../../../contexts/shopping-cart-context";

const SubHeaderContainer = () => {
  const { cart } = useCartContext();
  
  return (
    <SubHeader totalCartItems={cart.totalItems} />
  );
};

export default SubHeaderContainer;