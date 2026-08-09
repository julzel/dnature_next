'use client';

import { BookmarkPlus, RotateCcw, ShoppingBasket, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '../../components/Button';
import { useCartContext } from '../Cart/state';
import AccountShell from './components/AccountShell';
import { useAccountDemo } from './model/account-demo-context';
import { MAX_DEMO_SAVED_CARTS, savedCartTotal } from './model/account-demo-state';
import styles from './AccountDemo.module.scss';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value) =>
  new Intl.DateTimeFormat('es-CR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const SavedCarts = () => {
  const router = useRouter();
  const { cart, updateCurrentCart } = useCartContext();
  const { deleteSavedCart, saveCart, savedCarts } = useAccountDemo();
  const [label, setLabel] = useState('Mi compra frecuente');
  const [message, setMessage] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const handleSave = (event) => {
    event.preventDefault();

    if (!cart.items.length) {
      setMessage('Agregá al menos un producto antes de guardar el carrito.');
      return;
    }

    saveCart(cart, label.trim() || 'Mi compra frecuente');
    setMessage('Tu carrito se guardó en esta cuenta de demostración.');
  };

  const reopenCart = (savedCart) => {
    updateCurrentCart(savedCart);
    router.push('/checkout');
  };

  const confirmDelete = (cartId) => {
    deleteSavedCart(cartId);
    setPendingDeleteId(null);
    setMessage('El carrito guardado se eliminó.');
  };

  return (
    <AccountShell
      eyebrow='Compras más rápidas'
      title='Mis carritos'
      description='Guardá combinaciones frecuentes y recuperalas cuando llegue la próxima compra.'
    >
      <div className={styles.contentStack}>
        <section className={styles.formCard} aria-labelledby='save-cart-title'>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <span className={styles.smallIcon} aria-hidden='true'>
                <BookmarkPlus size={21} />
              </span>
              <div>
                <h2 id='save-cart-title'>Guardar el carrito actual</h2>
                <p>
                  {cart.items.length
                    ? `${cart.totalItems} ${cart.totalItems === 1 ? 'producto' : 'productos'} · ${formatCurrency(cart.subtotal)}`
                    : 'Tu carrito actual está vacío.'}
                </p>
              </div>
            </div>
            <span className={styles.proposalBadge}>Integrado al carrito</span>
          </div>

          {cart.items.length ? (
            <form onSubmit={handleSave}>
              <div className={styles.field}>
                <label htmlFor='saved-cart-name'>Nombre del carrito</label>
                <input
                  id='saved-cart-name'
                  maxLength={60}
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                />
              </div>
              <div className={styles.buttonRow}>
                <Button type='submit'>Guardar selección</Button>
                <Button href='/checkout' variant='secondary'>
                  Revisar carrito
                </Button>
              </div>
            </form>
          ) : (
            <div className={styles.buttonRow}>
              <Button href='/productos'>Explorar productos</Button>
            </div>
          )}
          <p className={styles.disclaimer}>
            La demo conserva los {MAX_DEMO_SAVED_CARTS} carritos más recientes en este dispositivo.
          </p>
          {message ? (
            <p className={styles.formMessage} role='status'>
              {message}
            </p>
          ) : null}
        </section>

        {savedCarts.length ? (
          <section aria-labelledby='saved-carts-title'>
            <div className={styles.cardHeader}>
              <div>
                <h2 id='saved-carts-title'>Selecciones guardadas</h2>
                <p>Revisá el contenido antes de retomar una compra.</p>
              </div>
            </div>
            <div className={styles.cartGrid}>
              {savedCarts.map((savedCart) => {
                const pendingDelete = pendingDeleteId === savedCart.id;
                return (
                  <article className={styles.savedCartCard} key={savedCart.id}>
                    <div className={styles.savedCartHeader}>
                      <div>
                        <h3>{savedCart.label}</h3>
                        <p>Guardado el {formatDate(savedCart.savedAt)}</p>
                      </div>
                      <span className={styles.selectedBadge}>
                        {savedCart.items.reduce((total, item) => total + item.quantity, 0)} artículos
                      </span>
                    </div>
                    <ul className={styles.cartItems}>
                      {savedCart.items.slice(0, 4).map((item) => (
                        <li className={styles.cartItem} key={item.id}>
                          <span>{item.quantity} × {item.productName}</span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </li>
                      ))}
                      {savedCart.items.length > 4 ? (
                        <li className={styles.cartItem}>
                          <span>y {savedCart.items.length - 4} más…</span>
                        </li>
                      ) : null}
                    </ul>
                    <div className={styles.portionCallout}>
                      Total de referencia: <strong>{formatCurrency(savedCartTotal(savedCart))}</strong>
                    </div>
                    <div className={styles.cardActions}>
                      <Button
                        size='small'
                        iconStart={<RotateCcw aria-hidden='true' size={16} />}
                        onClick={() => reopenCart(savedCart)}
                      >
                        Usar este carrito
                      </Button>
                      <Button
                        size='small'
                        variant='tertiary'
                        iconStart={<Trash2 aria-hidden='true' size={15} />}
                        onClick={() => setPendingDeleteId(savedCart.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                    {pendingDelete ? (
                      <div className={styles.inlineConfirm} role='alert'>
                        <p>¿Eliminar “{savedCart.label}”?</p>
                        <div className={styles.cardActions}>
                          <Button size='small' variant='danger' onClick={() => confirmDelete(savedCart.id)}>
                            Sí, eliminar
                          </Button>
                          <Button size='small' variant='secondary' onClick={() => setPendingDeleteId(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <section className={styles.emptyState}>
            <ShoppingBasket aria-hidden='true' size={38} />
            <h2>Todavía no guardaste carritos</h2>
            <p>
              Armá una selección en el catálogo y volvé aquí para guardarla con el nombre que prefirás.
            </p>
            <Button href='/productos'>Ir al catálogo</Button>
          </section>
        )}
      </div>
    </AccountShell>
  );
};

export default SavedCarts;
