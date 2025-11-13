import styles from './Cart.module.scss';

// components
import CurrencyText from '../../components/Currency';
import CartActionsContainer from './CartActions';
import CartItemsContainer from './CartItems';
import CartHistory from './CartHistory';

const Cart = ({ cart, proceedToPurchase }) => (
  <div className={styles.cart}>
    <div className={styles.cartContent}>
      <div>
        <h2 className={styles.header}>Tu Carrito:</h2>

        <CartItemsContainer items={cart.items} />

        <div className={styles.total}>
          <span>Total:</span> <CurrencyText value={cart.total} />
        </div>
      </div>
      <CartActionsContainer proceedToPurchase={proceedToPurchase} />
    </div>
    <CartHistory />
  </div>
);

export default Cart;
