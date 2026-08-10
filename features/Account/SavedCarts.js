'use client';

import { BookmarkPlus, RotateCcw, ShoppingBasket, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '../../components/Button';
import { useCartContext } from '../Cart/state';
import { useAccount } from './state';
import AccountShell from './components/AccountShell';
import styles from './Account.module.scss';

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

const savedCartTotal = (cart) =>
  cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

const SavedCarts = () => {
  const router = useRouter();
  const { cart, updateCurrentCart } = useCartContext();
  const {
    deleteSavedCart,
    maxSavedCarts,
    restoreSavedCart,
    saveCart,
    savedCarts,
  } = useAccount();
  const [label, setLabel] = useState('Mi compra frecuente');
  const [message, setMessage] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingRestoreId, setPendingRestoreId] = useState(null);
  const [busyAction, setBusyAction] = useState('');

  const handleSave = async (event) => {
    event.preventDefault();
    setBusyAction('save');
    setMessage(null);
    const result = await saveCart(cart, label.trim() || 'Mi compra frecuente');
    setBusyAction('');
    setMessage({ error: !result.ok, text: result.message });
  };

  const reopenCart = async (savedCart) => {
    setBusyAction(`restore-${savedCart.id}`);
    setMessage(null);
    const result = await restoreSavedCart(savedCart.id);
    setBusyAction('');
    setPendingRestoreId(null);
    setMessage({ error: !result.ok, text: result.message });

    if (result.ok) {
      updateCurrentCart(result.cart);
      router.push('/checkout');
    }
  };

  const requestRestore = (savedCart) => {
    if (cart.items.length) {
      setPendingRestoreId(savedCart.id);
      setPendingDeleteId(null);
      return;
    }
    reopenCart(savedCart);
  };

  const confirmDelete = async (cartId) => {
    setBusyAction(`delete-${cartId}`);
    setMessage(null);
    const result = await deleteSavedCart(cartId);
    setBusyAction('');
    if (result.ok) setPendingDeleteId(null);
    setMessage({ error: !result.ok, text: result.message });
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
                <Button type='submit' disabled={busyAction === 'save'}>
                  {busyAction === 'save' ? 'Guardando…' : 'Guardar selección'}
                </Button>
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
            Podés guardar hasta {maxSavedCarts} carritos. Al recuperarlos,
            comprobaremos que los productos sigan en el catálogo y sus precios actuales.
          </p>
          {message ? (
            <p
              className={message.error ? styles.formError : styles.formMessage}
              role={message.error ? 'alert' : 'status'}
            >
              {message.text}
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
                const pendingRestore = pendingRestoreId === savedCart.id;
                const isRestoring = busyAction === `restore-${savedCart.id}`;
                const isDeleting = busyAction === `delete-${savedCart.id}`;

                return (
                  <article className={styles.savedCartCard} key={savedCart.id}>
                    <div className={styles.savedCartHeader}>
                      <div>
                        <h3>{savedCart.label}</h3>
                        <p>Guardado el {formatDate(savedCart.savedAt)}</p>
                      </div>
                      <span className={styles.selectedBadge}>
                        {savedCart.items.reduce(
                          (total, item) => total + item.quantity,
                          0
                        )}{' '}
                        artículos
                      </span>
                    </div>
                    <ul className={styles.cartItems}>
                      {savedCart.items.slice(0, 4).map((item) => (
                        <li className={styles.cartItem} key={item.databaseId || item.id}>
                          <span>
                            {item.quantity} × {item.productName}
                          </span>
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
                      Total guardado de referencia:{' '}
                      <strong>{formatCurrency(savedCartTotal(savedCart))}</strong>
                    </div>
                    <div className={styles.cardActions}>
                      <Button
                        size='small'
                        disabled={isRestoring}
                        iconStart={<RotateCcw aria-hidden='true' size={16} />}
                        onClick={() => requestRestore(savedCart)}
                      >
                        {isRestoring ? 'Comprobando…' : 'Usar este carrito'}
                      </Button>
                      <Button
                        size='small'
                        variant='tertiary'
                        iconStart={<Trash2 aria-hidden='true' size={15} />}
                        onClick={() => {
                          setPendingDeleteId(savedCart.id);
                          setPendingRestoreId(null);
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                    {pendingRestore ? (
                      <div className={styles.inlineConfirm} role='alert'>
                        <p>
                          Esto reemplazará los productos del carrito actual.
                          Comprobaremos el catálogo y los precios antes de continuar.
                        </p>
                        <div className={styles.cardActions}>
                          <Button
                            size='small'
                            onClick={() => reopenCart(savedCart)}
                            disabled={isRestoring}
                          >
                            {isRestoring ? 'Comprobando…' : 'Sí, reemplazar'}
                          </Button>
                          <Button
                            size='small'
                            variant='secondary'
                            onClick={() => setPendingRestoreId(null)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : null}
                    {pendingDelete ? (
                      <div className={styles.inlineConfirm} role='alert'>
                        <p>¿Eliminar “{savedCart.label}”?</p>
                        <div className={styles.cardActions}>
                          <Button
                            size='small'
                            variant='danger'
                            disabled={isDeleting}
                            onClick={() => confirmDelete(savedCart.id)}
                          >
                            {isDeleting ? 'Eliminando…' : 'Sí, eliminar'}
                          </Button>
                          <Button
                            size='small'
                            variant='secondary'
                            onClick={() => setPendingDeleteId(null)}
                          >
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
              Armá una selección en el catálogo y volvé aquí para guardarla
              con el nombre que prefirás.
            </p>
            <Button href='/productos'>Ir al catálogo</Button>
          </section>
        )}
      </div>
    </AccountShell>
  );
};

export default SavedCarts;
