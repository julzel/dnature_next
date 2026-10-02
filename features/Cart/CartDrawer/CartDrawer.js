'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ClipboardPenLine,
  Minus,
  PackageOpen,
  Plus,
  ShoppingBag,
  Trash2,
  MessageCircleMore,
} from "../../../components/Icon";

import Modal from '../../../components/Modal';
import ContentfulImage from '../../../components/ContentfulImage';
import CurrencyText from '../../../components/Currency';
import { useCartContext } from '../state';

const productPresentation = (item) => {
  if (item.presentation) {
    return item.presentation;
  }

  const match = item.productName.match(
    /(\d+(?:[.,]\d+)?\s?(?:g|kg|ml|l))$/i
  );

  return match?.[1] || 'Producto natural';
};

const CartDrawer = ({ isOpen, onClose, returnFocusRef }) => {
  const {
    cart,
    addOneItem,
    removeOneItem,
    removeAllItemsOfAKind,
    updateOrderNotes,
  } = useCartContext();
  const [showInstructions, setShowInstructions] = useState(false);
  const closeDrawer = useCallback(() => {
    setShowInstructions(false);
    onClose();
  }, [onClose]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return (
    <Modal
      className='cart-dialog'
      ariaLabelledBy='cart-drawer-title'
      closeLabel='Cerrar carrito'
      closeModal={closeDrawer}
      returnFocusRef={returnFocusRef}
    >
        <header>
          <div>
            <p>Tu pedido</p>
            <h2 id='cart-drawer-title'>
              Carrito <span>({cart.totalItems})</span>
            </h2>
          </div>
        </header>

        {cart.totalItems > 0 && (
          <div>
            <MessageCircleMore aria-hidden='true' size={20} strokeWidth={1.9} />
            <span>
              <strong>Coordinación personal:</strong> Confirmamos disponibilidad,
              pago y entrega por WhatsApp.
            </span>
          </div>
        )}

        <div>
          {cart.items.length > 0 ? (
            <>
              <ul>
                {cart.items.map((item) => (
                  <li key={item.id}>
                    <div>
                      {item.image ? (
                        <ContentfulImage
                          src={item.image}
                          alt=''
                          width={120}
                          height={120}
                          sizes='96px'
                        />
                      ) : (
                        <span aria-hidden='true'>DNA</span>
                      )}
                    </div>

                    <div>
                      <h3>{item.productName}</h3>
                      <p>
                        {productPresentation(item)}
                      </p>
                      <p>
                        <CurrencyText value={item.price} />
                      </p>
                      <div
                        aria-label={`Cantidad de ${item.productName}: ${item.quantity}`}
                      >
                        <button
                          type='button'
                          aria-label={`Restar una unidad de ${item.productName}`}
                          onClick={() => removeOneItem(item.id)}
                        >
                          <Minus aria-hidden='true' size={17} strokeWidth={2.2} />
                        </button>
                        <output aria-live='polite'>{item.quantity}</output>
                        <button
                          type='button'
                          aria-label={`Agregar una unidad de ${item.productName}`}
                          onClick={() => addOneItem(item)}
                        >
                          <Plus aria-hidden='true' size={17} strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>

                    <button
                      type='button'
                      aria-label={`Eliminar ${item.productName} del carrito`}
                      onClick={() => removeAllItemsOfAKind(item.id)}
                    >
                      <Trash2 aria-hidden='true' size={18} strokeWidth={1.9} />
                    </button>
                  </li>
                ))}
              </ul>

              <div>
                <button
                  type='button'
                  aria-expanded={showInstructions}
                  aria-controls='cart-delivery-instructions'
                  onClick={() => setShowInstructions((isVisible) => !isVisible)}
                >
                  <ClipboardPenLine
                    aria-hidden='true'
                    size={20}
                    strokeWidth={1.8}
                  />
                  <span>Agregar instrucciones</span>
                  <ChevronRight
                    aria-hidden='true'
                    size={20}
                    strokeWidth={1.9}
                  />
                </button>
                {showInstructions && (
                  <div
                    id='cart-delivery-instructions'
                  >
                    <label htmlFor='cart-instructions'>
                      Instrucciones para tu pedido
                    </label>
                    <textarea
                      id='cart-instructions'
                      rows='3'
                      maxLength='300'
                      value={cart.orderNotes}
                      onChange={(event) => updateOrderNotes(event.target.value)}
                      placeholder='Ej. Llamar al llegar (opcional)'
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <span>
                <PackageOpen aria-hidden='true' size={34} strokeWidth={1.6} />
              </span>
              <h3>Tu carrito está esperando</h3>
              <p>Agrega alimentos naturales para empezar tu pedido.</p>
              <Link href='/productos' onClick={closeDrawer}>
                Explorar productos
              </Link>
            </div>
          )}
        </div>

        {cart.totalItems > 0 && (
          <footer>
            <div>
              <span>
                Subtotal ({cart.totalItems}{' '}
                {cart.totalItems === 1 ? 'producto' : 'productos'})
              </span>
              <strong>
                <CurrencyText value={cart.subtotal} />
              </strong>
            </div>
            <Link
              href='/checkout'
              onClick={closeDrawer}
            >
              <ShoppingBag aria-hidden='true' size={19} strokeWidth={1.9} />
              <span>Revisar solicitud</span>
            </Link>
          </footer>
        )}
    </Modal>
  );
};

export default CartDrawer;
