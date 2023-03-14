// local imports
// styles
import styles from "./Cart.module.scss";

// components
import Modal from '../../components/Modal';
import ClientForm from '../../components/ClientForm';
import CurrencyText from "../../components/Currency";
import CartPurchaseOrderContainer from "./CartPurchaseOrder";
import CartActionsContainer from "./CartActions";
import CartItemsContainer from "./CartItems";
import ModalContainer from "../../components/Modal";

const Cart = ({
  cart,
  proceedToPurchase,
  showPurchaseOrder,
  canvasElem,
  requestClientInfo,
  closeClientInfoModal,
  onClientInfoSubmit,
}) => (
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
    <div ref={canvasElem}>
      {showPurchaseOrder && <CartPurchaseOrderContainer />}
    </div>
    {requestClientInfo && (
      <ModalContainer closeModal={closeClientInfoModal}>
        <ClientForm onSubmit={onClientInfoSubmit} />
      </ModalContainer>
    )}
  </div>
);

export default Cart;
