// local imports
import CurrencyText from "../../components/Currency";

// styles
import styles from "./Cart.module.scss";
import CartItemController from "./CartItemController";

const Cart = ({
  cart,
  addItems,
  addOneItem,
  removeOneItem,
  removeAllItems,
  removeAllItemsOfAKind,
}) => (
  <div className={styles.cart}>
    <div>
      <h2 className={styles.header}>Tu compra:</h2>
      <div className={styles.items}>
        {cart.items.map((item) => (
          <div key={item.id} className={styles.item}>
            <div className={styles.itemInfo}>
              <h3>{item.productName}</h3>
              <div className={styles.itemTotalPrice}>
                <CurrencyText value={item.price * item.quantity} />
              </div>
            </div>
            <div>
              <CartItemController
                item={item}
                addOneItem={addOneItem}
                removeOneItem={removeOneItem}
                removeAllItemsOfAKind={removeAllItemsOfAKind}
              />
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

export default Cart;
