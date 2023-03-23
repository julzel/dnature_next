// local imports
// styles
import styles from "./Cart.module.scss";

// components
import CurrencyText from "../../components/Currency";
import CartPurchaseOrderContainer from "./CartPurchaseOrder";
import CartActionsContainer from "./CartActions";
import CartItemsContainer from "./CartItems";
import ModalContainer from "../../components/Modal";
import PurchaseOrderContainer from "./PurchaseOrder";
import ClientFormContainer from "../../components/ClientForm/ClientFormContainer";

const Cart = ({
  cart,
  canvasElem,
  proceedToPurchase,
  showPurchaseOrder,
  requestClientInfo,
  closeClientInfoModal,
  onClientInfoSubmit,
  onPurchaseCancel,
  onPurchaseConfirm,
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

    {requestClientInfo && (
      <ModalContainer closeModal={closeClientInfoModal}>
        <ClientFormContainer
          onSubmit={onClientInfoSubmit}
          className={styles.cartClientForm}
        />
      </ModalContainer>
    )}

    {showPurchaseOrder && (
      <>
        <ModalContainer closeModal={onPurchaseCancel}>
          <CartPurchaseOrderContainer
            onPurchaseCancel={onPurchaseCancel}
            onPurchaseConfirm={onPurchaseConfirm}
          />
        </ModalContainer>
        <div ref={canvasElem} className={styles.canvas}>
          <PurchaseOrderContainer />
        </div>
      </>
    )}
  </div>
);

export default Cart;
