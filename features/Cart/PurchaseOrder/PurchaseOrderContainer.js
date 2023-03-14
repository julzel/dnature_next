import React from 'react';

// local imports
// components
import PurchaseOrder from './PurchaseOrder';

// context
import { useCartContext } from "../../../contexts/shopping-cart-context";

// utils
import { getDateDMY } from "../../../util/dates";

const PurchaseOrderContainer = () => {
  const { cart } = useCartContext();

  const currentDate = getDateDMY();

  return (
    <PurchaseOrder cart={cart} currentDate={currentDate} />
  );
};

export default PurchaseOrderContainer;