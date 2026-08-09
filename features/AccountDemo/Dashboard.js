'use client';

import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  PackageCheck,
  PawPrint,
  ShoppingBasket,
  Sparkles,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import Button from '../../components/Button';
import { useCartContext } from '../Cart/state';
import AccountShell from './components/AccountShell';
import { useAccountDemo } from './model/account-demo-context';
import accountStyles from './AccountDemo.module.scss';
import networkStyles from './PartnerNetwork.module.scss';

const styles = { ...accountStyles, ...networkStyles };

const planDays = [7, 14, 30];

const recommendations = [
  {
    title: 'Recetas completas',
    description: 'Opciones de alimento natural para planificar la rutina diaria.',
    image: '/images/products-diet.jpg',
    href: '/productos?category=dietas',
  },
  {
    title: 'Snacks naturales',
    description: 'Premios para complementar sus momentos de juego y entrenamiento.',
    image: '/images/products-snacks.jpg',
    href: '/productos?category=snacks',
  },
  {
    title: 'Suplementos',
    description: 'Alternativas para explorar según las necesidades de cada mascota.',
    image: '/images/products-super.jpg',
    href: '/productos?category=superalimentos',
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(value || 0);

const Dashboard = () => {
  const { cart } = useCartContext();
  const {
    pets,
    profile,
    savedCarts,
    favoritePartnerIds,
    selectedPet,
    selectPet,
  } = useAccountDemo();
  const [days, setDays] = useState(14);

  const totalGrams = selectedPet ? selectedPet.portionSize * days : 0;
  const totalKg = totalGrams / 1000;
  const oneKgPackages = Math.ceil(totalGrams / 1000);

  const shortcuts = [
    { href: '/cuenta/mascotas', label: 'Administrar mascotas', icon: PawPrint },
    { href: '/cuenta/red-veterinaria', label: 'Explorar Red Veterinaria', icon: Stethoscope },
    { href: '/cuenta/carritos', label: 'Ver mis carritos', icon: ShoppingBasket },
    { href: '/cuenta/perfil', label: 'Completar mi perfil', icon: UserRound },
  ];

  return (
    <AccountShell
      eyebrow='Resumen personal'
      title={`¡Hola, ${profile.firstName || 'Cliente'}!`}
      description='Una vista clara de tus mascotas, su alimentación y tus próximas compras.'
    >
      <div className={styles.contentStack}>
        <section className={styles.heroCard}>
          <div>
            <p className={styles.eyebrow}>Tu espacio DNAture</p>
            <h2>{pets.length ? 'Su bienestar, más fácil de organizar.' : 'Empecemos por su perfil.'}</h2>
            <p>
              {pets.length
                ? 'Revisá la porción estimada, prepará la compra y mantené toda la información importante en un solo lugar.'
                : 'Agregá los datos de tu mascota para calcular una porción de referencia y personalizar esta experiencia.'}
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

        <section className={styles.networkTeaser} aria-labelledby='network-teaser-title'>
          <span className={styles.networkTeaserIcon} aria-hidden='true'>
            <Stethoscope size={30} />
          </span>
          <div>
            <div className={styles.networkTeaserTitle}>
              <p className={styles.eyebrow}>Nuevo en tu cuenta</p>
              <span className={styles.proposalBadge}>Propuesta demo</span>
            </div>
            <h2 id='network-teaser-title'>Conocé la Red Veterinaria DNAture</h2>
            <p>
              Encontrá veterinarias y pet shops asociados, guardá tus favoritos y
              descubrí beneficios para miembros.
            </p>
          </div>
          <div className={styles.networkTeaserAction}>
            {favoritePartnerIds.length ? (
              <span>{favoritePartnerIds.length} guardados</span>
            ) : null}
            <Button href='/cuenta/red-veterinaria' iconEnd={<ArrowRight aria-hidden='true' size={17} />}>
              Explorar la red
            </Button>
          </div>
        </section>

        <div className={styles.twoColumnGrid}>
          <section className={styles.card} aria-labelledby='food-plan-title'>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <span className={styles.smallIcon} aria-hidden='true'>
                  <CalendarDays size={21} />
                </span>
                <div>
                  <h2 id='food-plan-title'>Plan de alimentación</h2>
                  <p>Una guía rápida para organizar la compra.</p>
                </div>
              </div>
              <span className={styles.proposalBadge}>Propuesta demo</span>
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
                        onClick={() => selectPet(pet.id)}
                      >
                        {pet.name}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className={styles.metricRow}>
                  <div className={styles.metric}>
                    <strong>{Math.round(selectedPet.portionSize)} g</strong>
                    <span>porción diaria de {selectedPet.name}</span>
                  </div>
                  <div className={styles.metric}>
                    <strong>{totalKg.toLocaleString('es-CR', { maximumFractionDigits: 1 })} kg</strong>
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
                  {oneKgPackages === 1 ? 'paquete' : 'paquetes'} de 1 kg. La porción
                  es una referencia y no sustituye la recomendación veterinaria.
                </p>
                <div className={styles.buttonRow}>
                  <Button href='/productos' size='small'>
                    Explorar productos
                  </Button>
                  <Button href='/cuenta/mascotas' size='small' variant='tertiary'>
                    Revisar perfil
                  </Button>
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <PawPrint aria-hidden='true' size={34} />
                <h3>Todavía no hay mascotas</h3>
                <p>Creá un perfil para ver aquí una estimación personalizada.</p>
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
                <p>Explorá los productos y luego guardá una selección frecuente.</p>
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

        <section className={styles.card} aria-labelledby='recommendations-title'>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <span className={styles.smallIcon} aria-hidden='true'>
                <Sparkles size={21} />
              </span>
              <div>
                <h2 id='recommendations-title'>Ideas para {selectedPet?.name || 'tus mascotas'}</h2>
                <p>Así podrían verse recomendaciones personalizadas en una futura versión.</p>
              </div>
            </div>
            <span className={styles.proposalBadge}>Propuesta demo</span>
          </div>
          <div className={styles.recommendationGrid}>
            {recommendations.map((item) => (
              <article className={styles.recommendationCard} key={item.title}>
                <Image
                  src={item.image}
                  alt=''
                  width={420}
                  height={220}
                  sizes='(max-width: 768px) 100vw, 280px'
                />
                <div className={styles.recommendationBody}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <Button href={item.href} size='small' variant='tertiary'>
                    Conocer opciones
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AccountShell>
  );
};

export default Dashboard;
