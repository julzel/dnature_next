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
import { STORE_GOOGLE_MAPS_URL } from '../../constants/store';

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
    <div>
      <div>
        <Link href='/productos'>
          <ArrowLeft aria-hidden='true' size={18} strokeWidth={1.9} />
          Seguir comprando
        </Link>

        <header>
          <p>Tu pedido DNAture</p>
          <h1>Prepará tu solicitud</h1>
          <span>
            Revisá los productos y prepará el resumen que enviarás por WhatsApp.
          </span>
        </header>

        <ol aria-label='Progreso de la solicitud'>
          <li aria-current='step'><span>1</span> Carrito</li>
          <li><span>2</span> Tus datos</li>
          <li><span>3</span> Revisión</li>
        </ol>

        <div>
          <section aria-labelledby='order-title'>
            <div>
              <div>
                <p>Detalle del pedido</p>
                <h2 id='order-title'>Tu carrito</h2>
              </div>
              <span>
                {cart.totalItems}{' '}
                {cart.totalItems === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            {cart.totalItems > 0 ? (
              <CartItemsContainer items={cart.items} />
            ) : (
              <div>
                <span>
                  <ShoppingBag aria-hidden='true' size={30} strokeWidth={1.6} />
                </span>
                <h3>Tu carrito está vacío</h3>
                <p>Agregá productos naturales para comenzar tu solicitud.</p>
                <Link href='/productos'>Ver productos</Link>
              </div>
            )}
          </section>

          <aside aria-labelledby='summary-title'>
            <div>
              <p>Coordinación</p>
              <h2 id='summary-title'>Resumen de la solicitud</h2>
            </div>

            {cart.totalItems > 0 && (
              <>
                <fieldset>
                  <legend>¿Cómo querés recibirlo?</legend>
                  <div>
                    <label>
                      <input
                        type='radio'
                        name='fulfillment'
                        value='pickup'
                        checked={!cart.wantsDelivery}
                        onChange={() => updateDelivery(false)}
                      />
                      <span>
                        <Store aria-hidden='true' size={21} />
                      </span>
                      <span>
                        <strong>Pasar a retirar</strong>
                        <small>Coordinamos el horario por WhatsApp.</small>
                      </span>
                      <strong>Sin costo</strong>
                    </label>
                    <a
                      href={STORE_GOOGLE_MAPS_URL}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      Ver ubicación en Google Maps
                    </a>
                  </div>
                  <label>
                    <input
                      type='radio'
                      name='fulfillment'
                      value='delivery'
                      checked={cart.wantsDelivery}
                      onChange={() => updateDelivery(true)}
                    />
                    <span>
                      <Truck aria-hidden='true' size={21} />
                    </span>
                    <span>
                      <strong>Entrega a domicilio</strong>
                      <small>Cobertura sujeta a confirmación dentro del GAM.</small>
                    </span>
                    <strong>₡3,500</strong>
                  </label>
                </fieldset>

                <fieldset>
                  <legend>Preferencia de pago</legend>
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method.id}>
                      <input
                        type='radio'
                        name='payment-method'
                        value={method.id}
                        checked={cart.paymentMethod === method.id}
                        onChange={() => updatePaymentMethod(method.id)}
                      />
                      <span>
                        <BadgeDollarSign aria-hidden='true' size={21} />
                      </span>
                      <span>
                        <strong>{method.label}</strong>
                        <small>{method.description}</small>
                      </span>
                    </label>
                  ))}
                </fieldset>

                <div>
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

                <dl>
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
                    <dd>
                      {cart.wantsDelivery ? (
                        <CurrencyText value={cart.deliveryFee} />
                      ) : (
                        'Pasar a retirar'
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Total estimado</dt>
                    <dd>
                      <CurrencyText value={cart.total} />
                    </dd>
                  </div>
                </dl>
                <p>
                  DNAture confirmará disponibilidad, monto final, pago y entrega
                  antes de procesar la solicitud.
                </p>
              </>
            )}

            {checkoutMessage ? (
              <p
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
              <div>
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
        hidden
        ref={canvasElem}
      >
        <PurchaseOrderContainer />
      </div>
    </div>
  );
};

export default Cart;
