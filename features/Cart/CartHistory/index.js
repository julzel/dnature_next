import { useCartContext } from '../../../contexts/shopping-cart-context';
import { formatToLocaleDate } from '../../../util/dates';
import CurrencyText from '../../../components/Currency';

import styles from './CartHistory.module.scss';

const CartHistory = () => {
  // Shopping cart context
  const { updateCurrentCart, localCarts } = useCartContext();

  if (localCarts.length === 0) {
    return <div className={styles.cartHistory}>No hay órdenes de compras anteriores</div>;
  }

  return (
    <div className={styles.cartHistory}>
      <h3>Órdenes anteriores:</h3>
      {localCarts.map((cart, ind) => (
        <div className={styles.cartHistoryItem} key={ind}>
          <div>
            <strong>Fecha: </strong><span>{formatToLocaleDate(cart.date)}</span>
            <button onClick={() => updateCurrentCart(cart)}>Seleccionar</button>
          </div>
          <div>
            <span>
              <strong>Total: </strong>
              <CurrencyText value={cart.total} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartHistory;
