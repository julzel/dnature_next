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
import MessageBoxContainer from "../../components/MessageBox/MessageBoxContainer";

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
      <ModalContainer closeModal={onCloseInfoModal}>
        <MessageBoxContainer type="info" onClose={onCloseInfoModal}>
          <h3>Estimados clientes</h3>
          <p>
            En DNAture, estamos trabajando para brindarte un mejor servicio.
            Pronto habilitaremos el pago en línea con tarjeta de crédito o
            débito. Por ahora, puedes hacer tus pedidos por WhatsApp adjuntando
            la imagen de la orden de compra que hemos generado para ti.
          </p>
          <p>
            Aceptamos pagos por SINPE Móvil o transferencia bancaria. Por favor,
            adjuntar el comprobante de pago en el mensaje de WhatsApp. Para más
            información contáctanos en WhatsApp:{" "}
            <a href="https://wa.me/50671732328">+506 7173-2328</a>. ¡Gracias por
            confiar en DNAture!
          </p>
        </MessageBoxContainer>
      </ModalContainer>
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
