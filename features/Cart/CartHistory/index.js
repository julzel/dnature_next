import { useCartContext } from '../model/shopping-cart-context';
import { formatToLocaleDate } from '../lib/dates';
import CurrencyText from '../../../components/Currency';

import styles from './CartHistory.module.scss';

const CartHistory = () => {
  // Shopping cart context
  const { clearSavedCarts, updateCurrentCart, localCarts } = useCartContext();

  if (localCarts.length === 0) {
    return null;
  }

  return (
    <div className={styles.cartHistory}>
      <h3>Solicitudes preparadas en este dispositivo</h3>
      <p>
        Son referencias locales para volver a armar un carrito; no representan
        pedidos enviados o confirmados.
      </p>
      <button type='button' onClick={clearSavedCarts}>
        Eliminar referencias guardadas
      </button>
      {localCarts.map((cart) => (
        <div className={styles.cartHistoryItem} key={cart.purchaseOrderId || cart.date}>
          <div>
            <strong>Preparada: </strong><span>{formatToLocaleDate(cart.date)}</span>
            <button type="button" onClick={() => updateCurrentCart(cart)}>
              Usar como carrito nuevo
            </button>
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
