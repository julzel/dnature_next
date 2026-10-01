import { useRef, useState } from 'react';
import { useCartContext } from '../../../contexts/shopping-cart-context';
import { cloneCartWithCurrentPrices } from '../../../util/clone-cart';
import { formatToLocaleDate } from '../../../util/dates';
import CurrencyText from '../../../components/Currency';

import styles from './CartHistory.module.scss';

const CartHistory = () => {
  // Shopping cart context
  const { updateCurrentCart, localCarts } = useCartContext();
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [error, setError] = useState('');
  const loading = useRef(false);

  const selectCart = async (cart, index) => {
    if (loading.current) return;
    loading.current = true;
    setLoadingIndex(index);
    setError('');
    try {
      const response = await fetch('/api/product-prices', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('No se pudieron cargar los precios actuales. Intenta de nuevo.');
      }
      const products = await response.json();
      updateCurrentCart(cloneCartWithCurrentPrices(cart, products));
    } catch (error) {
      setError(error.message || 'No se pudo repetir la orden. Intenta de nuevo.');
    } finally {
      loading.current = false;
      setLoadingIndex(null);
    }
  };

  if (localCarts.length === 0) {
    return <div className={styles.cartHistory}>No hay órdenes de compras anteriores</div>;
  }

  return (
    <div className={styles.cartHistory}>
      <h3>Órdenes anteriores:</h3>
      {error && <p role='alert'>{error}</p>}
      {localCarts.map((cart, ind) => (
        <div className={styles.cartHistoryItem} key={ind}>
          <div>
            <strong>Fecha: </strong><span>{formatToLocaleDate(cart.date)}</span>
            <button disabled={loadingIndex !== null} onClick={() => selectCart(cart, ind)}>
              {loadingIndex === ind ? 'Actualizando precios…' : 'Seleccionar'}
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
