// local imports
import CurrencyText from "../../components/Currency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

// styles
import styles from "./Cart.module.scss";

const Cart = ({
  cart,
  addItem,
  removeItem,
  removeAllItems,
  removeAllItemsOfAKind,
}) => (
  <div className={styles.cart}>
    {console.log({ cart })}
    <div>
      <h2 className={styles.header}>Tu compra:</h2>
      <div className={styles.items}>
        {cart.items.map((item) => (
          <div key={item.id} className={styles.item}>
            <h3 className={styles.itemHeader}>{item.productName}</h3>
            <div className={styles.itemInfo}>
              <span className={styles.itemTotalPrice}>
                <CurrencyText value={item.price * item.quantity} />
              </span>
              <span className={styles.itemTotalQuantity}>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={() => removeItem(item)}
                >
                  -
                </span>
                {item.quantity}
                <span role="button" tabIndex={0} onClick={() => addItem(item)}>
                  +
                </span>
                <span role="button" tabIndex={0} onClick={removeAllItemsOfAKind}>
                  <FontAwesomeIcon icon={faTrashCan} size="sm" />
                </span>
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

export default Cart;
