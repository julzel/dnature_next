'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';

import styles from './Cart.module.scss';
import CurrencyText from '../../components/Currency';
import CartPurchaseOrderContainer from './CartPurchaseOrder';
import CartActionsContainer from './CartActions';
import CartItemsContainer from './CartItems';
import CartNotification from './CartNotification';
import CartHistory from './CartHistory';
import ModalContainer from '../../components/Modal';
import PurchaseOrderContainer from './PurchaseOrder';
import ClientFormContainer from './ClientForm/ClientFormContainer';

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
  purchaseError,
  isCapturingPurchase,
  updateDelivery,
}) => {
  return (
    <div className={styles.checkout}>
      <div className={styles.checkoutShell}>
        <Link className={styles.backLink} href='/productos'>
          <ArrowLeft aria-hidden='true' size={18} strokeWidth={1.9} />
          Seguir comprando
        </Link>

        <header className={styles.pageHeader}>
          <p>Tu pedido DNAture</p>
          <h1>Checkout</h1>
          <span>Revisa tus productos y elige cómo recibirlos.</span>
        </header>

        <div className={styles.checkoutGrid}>
          <section className={styles.orderCard} aria-labelledby='order-title'>
            <div className={styles.orderHeading}>
              <div>
                <p>Detalle del pedido</p>
                <h2 id='order-title'>Tu carrito</h2>
              </div>
              <span className={styles.itemCount}>
                {cart.totalItems}{' '}
                {cart.totalItems === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            {cart.totalItems > 0 ? (
              <CartItemsContainer items={cart.items} />
            ) : (
              <div className={styles.emptyCart}>
                <span>
                  <ShoppingBag aria-hidden='true' size={30} strokeWidth={1.6} />
                </span>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos naturales para comenzar tu pedido.</p>
                <Link href='/productos'>Ver productos</Link>
              </div>
            )}
          </section>

          <aside className={styles.summary} aria-labelledby='summary-title'>
            <div className={styles.summaryHeading}>
              <p>Pago y entrega</p>
              <h2 id='summary-title'>Resumen de compra</h2>
            </div>

            {cart.totalItems > 0 && (
              <>
                <label className={styles.deliveryOption}>
                  <input
                    type='checkbox'
                    checked={cart.wantsDelivery}
                    onChange={(event) => updateDelivery(event.target.checked)}
                  />
                  <span className={styles.checkmark} aria-hidden='true' />
                  <span className={styles.deliveryIcon}>
                    <Truck aria-hidden='true' size={22} strokeWidth={1.8} />
                  </span>
                  <span className={styles.deliveryCopy}>
                    <strong>Quiero entrega a domicilio</strong>
                    <small>Disponible dentro del GAM</small>
                  </span>
                  <strong className={styles.deliveryPrice}>₡3,000</strong>
                </label>

                <dl className={styles.breakdown}>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>
                      <CurrencyText value={cart.subtotal} />
                    </dd>
                  </div>
                  <div>
                    <dt>
                      IVA <span>(13%)</span>
                    </dt>
                    <dd>
                      <CurrencyText value={cart.tax} />
                    </dd>
                  </div>
                  <div>
                    <dt>Entrega</dt>
                    <dd
                      className={
                        cart.wantsDelivery ? '' : styles.noDeliveryFee
                      }
                    >
                      {cart.wantsDelivery ? (
                        <CurrencyText value={cart.deliveryFee} />
                      ) : (
                        'Sin costo'
                      )}
                    </dd>
                  </div>
                  <div className={styles.grandTotal}>
                    <dt>Total</dt>
                    <dd>
                      <CurrencyText value={cart.total} />
                    </dd>
                  </div>
                </dl>
              </>
            )}

            <CartActionsContainer proceedToPurchase={proceedToPurchase} />

            {cart.totalItems > 0 && (
              <div className={styles.trustNote}>
                <ShieldCheck aria-hidden='true' size={19} strokeWidth={1.8} />
                <span>
                  <strong>Compra segura</strong>
                  Confirmaremos tu pedido y forma de pago.
                </span>
                <LockKeyhole aria-hidden='true' size={16} strokeWidth={1.8} />
              </div>
            )}
          </aside>
        </div>

        <CartHistory />
      </div>

      {requestClientInfo && (
        <ModalContainer
          ariaLabel={
            cart.wantsDelivery ? 'Detalles de entrega' : 'Datos del pedido'
          }
          closeModal={closeClientInfoModal}
          responsiveFullScreen
        >
          <ClientFormContainer
            onSubmit={onClientInfoSubmit}
            className={styles.cartClientForm}
          />
        </ModalContainer>
      )}

      {showPurchaseOrder && !displayInfoModal && (
        <ModalContainer
          ariaLabel='Orden de compra'
          closeModal={onPurchaseCancel}
          responsiveFullScreen
        >
          <CartPurchaseOrderContainer
            onPurchaseCancel={onPurchaseCancel}
            onPurchaseConfirm={onPurchaseConfirm}
            purchaseError={purchaseError}
            isCapturingPurchase={isCapturingPurchase}
          />
        </ModalContainer>
      )}

      {displayInfoModal && (
        <CartNotification onCloseInfoModal={onCloseInfoModal} />
      )}

      <div
        ref={canvasElem}
        className={`${styles.canvas} ${
          showPurchaseOrder ? styles.visible : ''
        }`}
      >
        <PurchaseOrderContainer />
      </div>
    </div>
  );
};

export default Cart;
