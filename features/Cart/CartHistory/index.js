import { useState, useEffect, useCallback } from 'react';
import { useCartContext } from '../../../contexts/shopping-cart-context';

const CartHistory = () => {
  // Shopping cart context
  const {
    getLocalCarts,
    updateCurrentCart,
  } = useCartContext();
  const [localCarts, setLocalCarts] = useState([]);

  useEffect(() => {
    setLocalCarts(getLocalCarts());
  }, [getLocalCarts]);

  if (localCarts.length === 0) {
    return <div>No hay carritos guardados</div>;
  }

  console.log(localCarts)

  return (
    <div>
      <h2>Carritos guardados:</h2>
      {localCarts.map((cart, ind) => (
        <div key={ind}>
          <span>{cart.client.firstName}</span>
          <span>{cart.total}</span>
          <button onClick={() => updateCurrentCart(cart)}>Cargar</button>
        </div>
      ))}
    </div>
  );
}
 
export default CartHistory;