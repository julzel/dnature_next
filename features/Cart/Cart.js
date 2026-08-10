'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  BadgeDollarSign,
  LockKeyhole,
  MessageCircleMore,
  Store,
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
import { PAYMENT_METHODS } from './model/checkout';

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
  canCreateAccount,
  initialClient,
  updateDelivery,
  updatePaymentMethod,
  updateOrderNotes,
  isCheckingCart,
  checkoutMessage,
  onPurchaseEdit,
  whatsappUrl,
  onDownloadAgain,
  onStartAnotherOrder,
  handoffWarning,
  hasPurchaseArtifact,
  checkoutReturnFocusRef,
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
          <h1>Prepará tu solicitud</h1>
          <span>
            Revisá los productos y prepará el resumen que enviarás por WhatsApp.
          </span>
        </header>

        <ol className={styles.progress} aria-label='Progreso de la solicitud'>
          <li aria-current='step'><span>1</span> Carrito</li>
          <li><span>2</span> Tus datos</li>
          <li><span>3</span> Revisión</li>
        </ol>

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
                <p>Agregá productos naturales para comenzar tu solicitud.</p>
                <Link href='/productos'>Ver productos</Link>
              </div>
            )}
          </section>

          <aside className={styles.summary} aria-labelledby='summary-title'>
            <div className={styles.summaryHeading}>
              <p>Coordinación</p>
              <h2 id='summary-title'>Resumen de la solicitud</h2>
            </div>

            {cart.totalItems > 0 && (
              <>
                <fieldset className={styles.optionGroup}>
                  <legend>¿Cómo querés recibirlo?</legend>
                  <label className={styles.choiceCard}>
                    <input
                      type='radio'
                      name='fulfillment'
                      value='pickup'
                      checked={!cart.wantsDelivery}
                      onChange={() => updateDelivery(false)}
                    />
                    <span className={styles.choiceIcon}>
                      <Store aria-hidden='true' size={21} />
                    </span>
                    <span>
                      <strong>Retiro coordinado</strong>
                      <small>Confirmaremos el lugar y horario por WhatsApp.</small>
                    </span>
                    <strong>Sin costo</strong>
                  </label>
                  <label className={styles.choiceCard}>
                    <input
                      type='radio'
                      name='fulfillment'
                      value='delivery'
                      checked={cart.wantsDelivery}
                      onChange={() => updateDelivery(true)}
                    />
                    <span className={styles.choiceIcon}>
                      <Truck aria-hidden='true' size={21} />
                    </span>
                    <span>
                      <strong>Entrega a domicilio</strong>
                      <small>Cobertura sujeta a confirmación dentro del GAM.</small>
                    </span>
                    <strong>₡3,500</strong>
                  </label>
                </fieldset>

                <fieldset className={styles.optionGroup}>
                  <legend>Preferencia de pago</legend>
                  {PAYMENT_METHODS.map((method) => (
                    <label className={styles.choiceCard} key={method.id}>
                      <input
                        type='radio'
                        name='payment-method'
                        value={method.id}
                        checked={cart.paymentMethod === method.id}
                        onChange={() => updatePaymentMethod(method.id)}
                      />
                      <span className={styles.choiceIcon}>
                        <BadgeDollarSign aria-hidden='true' size={21} />
                      </span>
                      <span>
                        <strong>{method.label}</strong>
                        <small>{method.description}</small>
                      </span>
                    </label>
                  ))}
                </fieldset>

                <div className={styles.notesField}>
                  <label htmlFor='checkout-notes'>Indicaciones para el pedido</label>
                  <textarea
                    id='checkout-notes'
                    value={cart.orderNotes}
                    maxLength='300'
                    rows='3'
                    placeholder='Ej. Llamar al llegar (opcional)'
                    onChange={(event) => updateOrderNotes(event.target.value)}
                  />
                </div>

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
                    <dt>{cart.wantsDelivery ? 'Entrega estimada' : 'Modalidad'}</dt>
                    <dd
                      className={
                        cart.wantsDelivery ? '' : styles.noDeliveryFee
                      }
                    >
                      {cart.wantsDelivery ? (
                        <CurrencyText value={cart.deliveryFee} />
                      ) : (
                        'Retiro coordinado'
                      )}
                    </dd>
                  </div>
                  <div className={styles.grandTotal}>
                    <dt>Total estimado</dt>
                    <dd>
                      <CurrencyText value={cart.total} />
                    </dd>
                  </div>
                </dl>
                <p className={styles.estimateNotice}>
                  DNAture confirmará disponibilidad, monto final, pago y entrega
                  antes de procesar la solicitud.
                </p>
              </>
            )}

            {checkoutMessage ? (
              <p
                className={checkoutMessage.error ? styles.checkoutError : styles.checkoutNotice}
                role={checkoutMessage.error ? 'alert' : 'status'}
              >
                {checkoutMessage.text}
              </p>
            ) : null}

            <CartActionsContainer
              proceedToPurchase={proceedToPurchase}
              isCheckingCart={isCheckingCart}
            />

            {cart.totalItems > 0 && (
              <div className={styles.trustNote}>
                <MessageCircleMore aria-hidden='true' size={19} strokeWidth={1.8} />
                <span>
                  <strong>Compra asistida</strong>
                  Nada se cobra ni se envía hasta que continués por WhatsApp.
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
          ariaDescribedBy='checkout-client-description'
          ariaLabel={
            cart.wantsDelivery ? 'Detalles de entrega' : 'Datos del pedido'
          }
          closeModal={closeClientInfoModal}
          closeOnBackdrop={false}
          responsiveFullScreen
          returnFocusRef={checkoutReturnFocusRef}
          size='large'
        >
          <ClientFormContainer
            canCreateAccount={canCreateAccount}
            onSubmit={onClientInfoSubmit}
            className={styles.cartClientForm}
            initialClient={cart.client.firstName ? cart.client : initialClient}
            requiresAddress={cart.wantsDelivery}
          />
        </ModalContainer>
      )}

      {showPurchaseOrder && !displayInfoModal && (
        <ModalContainer
          ariaLabel='Revisión de la solicitud'
          closeModal={onPurchaseCancel}
          closeOnBackdrop={false}
          responsiveFullScreen
          returnFocusRef={checkoutReturnFocusRef}
          size='large'
        >
          <CartPurchaseOrderContainer
            onPurchaseCancel={onPurchaseCancel}
            onPurchaseConfirm={onPurchaseConfirm}
            onPurchaseEdit={onPurchaseEdit}
            purchaseError={purchaseError}
            isCapturingPurchase={isCapturingPurchase}
          />
        </ModalContainer>
      )}

      {displayInfoModal && (
        <CartNotification
          cart={cart}
          whatsappUrl={whatsappUrl}
          onCloseInfoModal={onCloseInfoModal}
          onDownloadAgain={onDownloadAgain}
          onStartAnotherOrder={onStartAnotherOrder}
          handoffWarning={handoffWarning}
          hasPurchaseArtifact={hasPurchaseArtifact}
          returnFocusRef={checkoutReturnFocusRef}
        />
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
