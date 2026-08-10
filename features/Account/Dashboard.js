'use client';

import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  PackageCheck,
  PawPrint,
  ShoppingBasket,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import Button from '../../components/Button';
import { useCartContext } from '../Cart/state';
import { useAccount } from './state';
import AccountShell from './components/AccountShell';
import styles from './Account.module.scss';

const planDays = [7, 14, 30];

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(value || 0);

const Dashboard = () => {
  const { cart } = useCartContext();
  const {
    choosePet,
    featureFlags,
    pets,
    profile,
    savedCarts,
    selectedPet,
  } = useAccount();
  const [days, setDays] = useState(14);
  const portionEnabled = featureFlags.portionPlanning && selectedPet?.portionSize;
  const totalGrams = portionEnabled ? selectedPet.portionSize * days : 0;
  const totalKg = totalGrams / 1000;
  const oneKgPackages = Math.ceil(totalGrams / 1000);

  const shortcuts = [
    { href: '/cuenta/mascotas', label: 'Administrar mascotas', icon: PawPrint },
    { href: '/cuenta/carritos', label: 'Ver mis carritos', icon: ShoppingBasket },
    { href: '/cuenta/perfil', label: 'Completar mi perfil', icon: UserRound },
  ];

  return (
    <AccountShell
      eyebrow='Resumen personal'
      title={`¡Hola, ${profile.firstName || 'Cliente'}!`}
      description='Una vista clara de tus mascotas, tus datos y tus próximas compras.'
    >
      <div className={styles.contentStack}>
        <section className={styles.heroCard}>
          <div>
            <p className={styles.eyebrow}>Tu espacio DNAture</p>
            <h2>
              {pets.length
                ? 'Su bienestar, más fácil de organizar.'
                : 'Empecemos por su perfil.'}
            </h2>
            <p>
              {pets.length
                ? 'Mantené su información al día, prepará la compra y encontrá todo en un solo lugar.'
                : 'Agregá los datos de tu mascota para empezar a personalizar esta experiencia.'}
            </p>
            <div className={styles.buttonRow}>
              <Button
                href='/cuenta/mascotas'
                variant='secondary'
                iconEnd={<ArrowRight aria-hidden='true' size={17} />}
              >
                {pets.length ? 'Ver mascotas' : 'Agregar mascota'}
              </Button>
            </div>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <strong>{pets.length}</strong>
              <span>{pets.length === 1 ? 'mascota' : 'mascotas'}</span>
            </div>
            <div className={styles.heroStat}>
              <strong>{savedCarts.length}</strong>
              <span>carritos guardados</span>
            </div>
          </div>
        </section>

        <div className={styles.twoColumnGrid}>
          <section className={styles.card} aria-labelledby='pet-summary-title'>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <span className={styles.smallIcon} aria-hidden='true'>
                  {portionEnabled ? <CalendarDays size={21} /> : <PawPrint size={21} />}
                </span>
                <div>
                  <h2 id='pet-summary-title'>
                    {portionEnabled ? 'Plan de alimentación' : 'Perfil de mascota'}
                  </h2>
                  <p>
                    {portionEnabled
                      ? 'Una guía rápida para organizar la compra.'
                      : 'Accedé rápidamente a su perfil.'}
                  </p>
                </div>
              </div>
            </div>

            {selectedPet ? (
              <>
                {pets.length > 1 ? (
                  <div className={styles.segmentedControl} aria-label='Elegir mascota'>
                    {pets.map((pet) => (
                      <button
                        key={pet.id}
                        type='button'
                        className={pet.id === selectedPet.id ? styles.segmentActive : ''}
                        aria-pressed={pet.id === selectedPet.id}
                        onClick={() => choosePet(pet.id)}
                      >
                        {pet.name}
                      </button>
                    ))}
                  </div>
                ) : null}
                {portionEnabled ? (
                  <>
                    <div className={styles.metricRow}>
                      <div className={styles.metric}>
                        <strong>{Math.round(selectedPet.portionSize)} g</strong>
                        <span>porción diaria de {selectedPet.name}</span>
                      </div>
                      <div className={styles.metric}>
                        <strong>
                          {totalKg.toLocaleString('es-CR', {
                            maximumFractionDigits: 1,
                          })}{' '}
                          kg
                        </strong>
                        <span>alimento para {days} días</span>
                      </div>
                    </div>

                    <div className={styles.buttonRow}>
                      <div className={styles.segmentedControl} aria-label='Duración del plan'>
                        {planDays.map((option) => (
                          <button
                            key={option}
                            type='button'
                            className={days === option ? styles.segmentActive : ''}
                            aria-pressed={days === option}
                            onClick={() => setDays(option)}
                          >
                            {option} días
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className={styles.disclaimer}>
                      Equivale aproximadamente a {oneKgPackages}{' '}
                      {oneKgPackages === 1 ? 'paquete' : 'paquetes'} de 1 kg. La
                      porción es una referencia y no sustituye la recomendación
                      veterinaria.
                    </p>
                  </>
                ) : (
                  <div className={styles.metricRow}>
                    <div className={styles.metric}>
                      <strong>{selectedPet.name}</strong>
                      <span>{selectedPet.age === 'puppy' ? 'cachorro' : 'adulto'}</span>
                    </div>
                    <div className={styles.metric}>
                      <strong>{selectedPet.weight} kg</strong>
                      <span>peso registrado</span>
                    </div>
                  </div>
                )}

                <div className={styles.buttonRow}>
                  {portionEnabled ? (
                    <Button href='/productos' size='small'>
                      Explorar productos
                    </Button>
                  ) : null}
                  <Button href='/cuenta/mascotas' size='small' variant='tertiary'>
                    Revisar perfil
                  </Button>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <PawPrint aria-hidden='true' size={34} />
                <h3>Todavía no hay mascotas</h3>
                <p>Creá un perfil para reunir aquí su información.</p>
                <Button href='/cuenta/mascotas'>Agregar mascota</Button>
              </div>
            )}
          </section>

          <section className={styles.card} aria-labelledby='cart-summary-title'>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <span className={styles.smallIcon} aria-hidden='true'>
                  <ShoppingBasket size={21} />
                </span>
                <div>
                  <h2 id='cart-summary-title'>Tu carrito actual</h2>
                  <p>Continuá donde lo dejaste.</p>
                </div>
              </div>
            </div>

            {cart.items.length ? (
              <>
                <div className={styles.metricRow}>
                  <div className={styles.metric}>
                    <strong>{cart.totalItems}</strong>
                    <span>{cart.totalItems === 1 ? 'producto' : 'productos'}</span>
                  </div>
                  <div className={styles.metric}>
                    <strong>{formatCurrency(cart.subtotal)}</strong>
                    <span>subtotal</span>
                  </div>
                </div>
                <div className={styles.buttonRow}>
                  <Button href='/checkout'>Ver carrito</Button>
                  <Button href='/cuenta/carritos' variant='secondary'>
                    Guardarlo
                  </Button>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <PackageCheck aria-hidden='true' size={34} />
                <h3>Tu carrito está listo para empezar</h3>
                <p>Explorá los productos y guardá una selección frecuente.</p>
                <Button href='/productos'>Ver productos</Button>
              </div>
            )}
          </section>
        </div>

        <section aria-labelledby='shortcuts-title'>
          <div className={styles.cardHeader}>
            <div>
              <h2 id='shortcuts-title'>Accesos rápidos</h2>
              <p>Lo importante, a un toque.</p>
            </div>
          </div>
          <div className={styles.shortcutGrid}>
            {shortcuts.map(({ href, label, icon: Icon }) => (
              <Link className={styles.shortcut} href={href} key={href}>
                <Icon aria-hidden='true' size={24} />
                <span>{label}</span>
                <ChevronRight aria-hidden='true' size={19} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AccountShell>
  );
};

export default Dashboard;
