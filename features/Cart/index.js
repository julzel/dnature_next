// local imports
import CurrencyText from '../../components/Currency';
import { useShoppingCartContext } from '../../contexts/shopping-cart-context';

// styles
import styles from './Cart.module.scss';

const Cart = () => {
  const { cart } = useShoppingCartContext();
  console.log(cart);
  return (
    <div className={styles.cart}>
      <div>
        <h2 className={styles.header}>Tu compra:</h2>
        <div className={styles.items}>
          {cart.items.map((item) => (
            <div key={item.id} className={styles.item}>
              <h3 className={styles.itemHeader}>{item.productName}</h3>
              <p className={styles.itemMedida}>Presentación: {item.medida}</p>
              <div className={styles.itemInfo}>
                <span className={styles.itemTotalPrice}>
                  <CurrencyText value={item.price * item.quantity} />
                  {/* ₡‎{item.price * item.quantity} */}
                </span>
                <span className={styles.itemTotalQuantity}>
                  <span>-</span>
                  {item.quantity}
                  <span>+</span>
                </span>
              </div>
            </div>
          ))}
        </div>
        <h3>
          Total: <CurrencyText value={cart.total} />
        </h3>
      </div>
    </div>
  );
};

export default Cart;
