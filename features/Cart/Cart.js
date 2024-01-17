import { Typography } from '@mui/material';
// local imports
// styles
import styles from './Cart.module.scss';

// components
import CurrencyText from '../../components/Currency';
import CartPurchaseOrderContainer from './CartPurchaseOrder';
import CartActionsContainer from './CartActions';
import CartItemsContainer from './CartItems';
import CartNotification from './CartNotification';
import CartHistory from './CartHistory';
import ModalContainer from '../../components/Modal';
import PurchaseOrderContainer from './PurchaseOrder';
import ClientFormContainer from '../../components/ClientForm/ClientFormContainer';

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
  displayInfoModal,
  onCloseInfoModal,
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
    <CartHistory />

    {requestClientInfo && (
      <ModalContainer
        closeModal={closeClientInfoModal}
        fullScreen={window.innerWidth < 640}
      >
        <ClientFormContainer
          onSubmit={onClientInfoSubmit}
          className={styles.cartClientForm}
        />
      </ModalContainer>
    )}

    {showPurchaseOrder && !displayInfoModal && (
      <>
        <ModalContainer
          closeModal={onPurchaseCancel}
          fullScreen={window.innerWidth < 640}
        >
          <CartPurchaseOrderContainer
            onPurchaseCancel={onPurchaseCancel}
            onPurchaseConfirm={onPurchaseConfirm}
          />
        </ModalContainer>
      </>
    )}

    {displayInfoModal && (
      <CartNotification onCloseInfoModal={onCloseInfoModal} />
    )}

    <div
      ref={canvasElem}
      className={`${styles.canvas} ${
        showPurchaseOrder ? styles.visible : null
      }`}
    >
      <PurchaseOrderContainer />
    </div>
  </div>
);

export default Cart;
