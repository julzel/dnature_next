'use client';

import { createPortal } from 'react-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  X,
} from 'lucide-react';

import ContentfulImage from '../../../components/ContentfulImage';
import CurrencyText from '../../../components/Currency';
import { useCartContext } from '../state';
import styles from './CartDrawer.module.scss';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

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
  const dialogRef = useRef(null);
  const closeDrawer = useCallback(() => {
    setShowInstructions(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const focusTarget = returnFocusRef.current;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = [
        ...dialogRef.current.querySelectorAll(focusableSelector),
      ];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement) {
        event.preventDefault();
        dialogRef.current.focus();
      } else if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      requestAnimationFrame(() => focusTarget?.focus());
    };
  }, [closeDrawer, isOpen, returnFocusRef]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className={styles.backdrop}
      role='presentation'
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          closeDrawer();
        }
      }}
    >
      <section
        ref={dialogRef}
        className={styles.drawer}
        role='dialog'
        aria-modal='true'
        aria-labelledby='cart-drawer-title'
        tabIndex={-1}
      >
        <button
          type='button'
          className={styles.mobileHandle}
          aria-label='Cerrar carrito'
          onClick={closeDrawer}
        >
          <span aria-hidden='true' />
        </button>

        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Tu pedido</p>
            <h2 id='cart-drawer-title'>
              Carrito <span>({cart.totalItems})</span>
            </h2>
          </div>
          <button
            type='button'
            className={styles.closeButton}
            aria-label='Cerrar carrito'
            onClick={closeDrawer}
          >
            <X aria-hidden='true' size={22} strokeWidth={2} />
          </button>
        </header>

        {cart.totalItems > 0 && (
          <div className={styles.delivery}>
            <MessageCircleMore aria-hidden='true' size={20} strokeWidth={1.9} />
            <span>
              <strong>Coordinación personal:</strong> Confirmamos disponibilidad,
              pago y entrega por WhatsApp.
            </span>
          </div>
        )}

        <div className={styles.scrollArea}>
          {cart.items.length > 0 ? (
            <>
              <ul className={styles.items}>
                {cart.items.map((item) => (
                  <li className={styles.item} key={item.id}>
                    <div className={styles.productImage}>
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

                    <div className={styles.itemDetails}>
                      <h3>{item.productName}</h3>
                      <p className={styles.presentation}>
                        {productPresentation(item)}
                      </p>
                      <p className={styles.price}>
                        <CurrencyText value={item.price} />
                      </p>
                      <div
                        className={styles.quantity}
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
                      className={styles.removeButton}
                      aria-label={`Eliminar ${item.productName} del carrito`}
                      onClick={() => removeAllItemsOfAKind(item.id)}
                    >
                      <Trash2 aria-hidden='true' size={18} strokeWidth={1.9} />
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles.instructions}>
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
                    className={showInstructions ? styles.chevronOpen : ''}
                    size={20}
                    strokeWidth={1.9}
                  />
                </button>
                {showInstructions && (
                  <div
                    id='cart-delivery-instructions'
                    className={styles.instructionsField}
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
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>
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
          <footer className={styles.footer}>
            <div className={styles.subtotal}>
              <span>
                Subtotal ({cart.totalItems}{' '}
                {cart.totalItems === 1 ? 'producto' : 'productos'})
              </span>
              <strong>
                <CurrencyText value={cart.subtotal} />
              </strong>
            </div>
            <Link
              className={styles.checkoutButton}
              href='/checkout'
              onClick={closeDrawer}
            >
              <ShoppingBag aria-hidden='true' size={19} strokeWidth={1.9} />
              <span>Revisar solicitud</span>
            </Link>
          </footer>
        )}
      </section>
    </div>,
    document.body
  );
};

export default CartDrawer;
