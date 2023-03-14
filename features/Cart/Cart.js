import { useRef } from "react";
// local imports
// styles
import styles from "./Cart.module.scss";

// components
import Button from "../../components/Button";
import CurrencyText from "../../components/Currency";
import CartItemController from "./CartItemController";
import CartPurchaseOrderContainer from "./CartPurchaseOrder";

const Cart = ({
  cart,
  addOneItem,
  removeOneItem,
  removeAllItems,
  removeAllItemsOfAKind,
  createPurchaseOrder,
  showPurchaseOrder,
  canvasElem,
}) => (
  <div className={styles.cart}>
    <h2 className={styles.header}>Tu Carrito:</h2>
    <div className={styles.items}>
      {cart.items.map((item) => (
        <div key={item.id} className={styles.item}>
          <div className={styles.itemInfo}>
            <h3>{item.productName}</h3>
            <p>
              <CurrencyText value={item.price * item.quantity} />{" "}
              <span className={styles.unds}>
                (<CurrencyText value={item.price} /> c/u)
              </span>
            </p>
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
    <div className={styles.total}>
      <span>Total:</span> <CurrencyText value={cart.total} />
    </div>
    <div className={styles.purchase}>
      <Button
        className={`${styles.button} ${styles.empty}`}
        onClick={() => console.log("generar orden")}
      >
        Vaciar Carrito
      </Button>
      <Button className={styles.button} onClick={() => createPurchaseOrder()}>
        Generar Orden
      </Button>
    </div>
    <div ref={canvasElem}>
      {showPurchaseOrder && <CartPurchaseOrderContainer />}
    </div>
  </div>
);

export default Cart;
