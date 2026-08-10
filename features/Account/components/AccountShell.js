'use client';

import {
  HeartHandshake,
  House,
  LogOut,
  Menu,
  PawPrint,
  ShieldCheck,
  ShoppingBasket,
  UserRound,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import Button from '../../../components/Button';
import { useAccount } from '../state';
import styles from '../Account.module.scss';

const navigationItems = [
  { href: '/cuenta', label: 'Inicio', icon: House },
  { href: '/cuenta/mascotas', label: 'Mis mascotas', icon: PawPrint },
  { href: '/cuenta/carritos', label: 'Mis carritos', icon: ShoppingBasket },
  { href: '/cuenta/perfil', label: 'Mi perfil', icon: UserRound },
];

const AccountShell = ({ children, eyebrow, title, description, action }) => {
  const pathname = usePathname();
  const {
    confirmAge,
    isAuthenticated,
    isReady,
    profile,
    signOut,
  } = useAccount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmingAge, setIsConfirmingAge] = useState(false);
  const [confirmationError, setConfirmationError] = useState('');
  const [signOutError, setSignOutError] = useState('');

  const handleSignOut = async () => {
    setSignOutError('');
    const result = await signOut();
    if (!result.ok) setSignOutError(result.message);
  };

  const handleAgeConfirmation = async () => {
    setIsConfirmingAge(true);
    setConfirmationError('');
    const result = await confirmAge();
    setIsConfirmingAge(false);
    if (!result.ok) setConfirmationError(result.message);
  };

  if (!isReady) {
    return (
      <div className={styles.accountPage}>
        <div className={styles.loadingCard} role='status'>
          <span className={styles.loadingMark} aria-hidden='true' />
          Preparando tu cuenta…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.accountPage}>
        <div className={styles.signedOutWrap}>
          <section className={styles.signedOutCard}>
            <span className={styles.roundIcon} aria-hidden='true'>
              <ShieldCheck size={32} />
            </span>
            <p className={styles.eyebrow}>Espacio personal</p>
            <h1>Iniciá sesión para ver esta sección</h1>
            <p>
              Ingresá para consultar tus mascotas, tus datos y tus carritos
              guardados.
            </p>
            <div className={styles.buttonRowCentered}>
              <Button href='/cuenta/iniciar-sesion'>Iniciar sesión</Button>
              <Button href='/' variant='secondary'>
                Volver al inicio
              </Button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!profile.ageConfirmed) {
    return (
      <div className={styles.accountPage}>
        <div className={styles.signedOutWrap}>
          <section className={styles.signedOutCard}>
            <span className={styles.roundIcon} aria-hidden='true'>
              <ShieldCheck size={32} />
            </span>
            <p className={styles.eyebrow}>Un paso más</p>
            <h1>Confirmá tu edad para continuar</h1>
            <p>
              Los servicios en línea de Mi DNAture están disponibles para
              personas mayores de 18 años.
            </p>
            {confirmationError ? (
              <p className={styles.formError} role='alert'>
                {confirmationError}
              </p>
            ) : null}
            {signOutError ? (
              <p className={styles.formError} role='alert'>
                {signOutError}
              </p>
            ) : null}
            <div className={styles.buttonRowCentered}>
              <Button onClick={handleAgeConfirmation} disabled={isConfirmingAge}>
                {isConfirmingAge ? 'Guardando…' : 'Confirmo que tengo 18 años o más'}
              </Button>
              <Button variant='secondary' onClick={handleSignOut}>
                Cerrar sesión
              </Button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.accountPage}>
      <div className={styles.accountContainer}>
        <div className={styles.accountGrid}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarIdentity}>
              <span className={styles.avatar} aria-hidden='true'>
                {(profile.firstName || 'C').charAt(0).toUpperCase()}
              </span>
              <div>
                <span>Cuenta de</span>
                <strong>{profile.firstName || 'Cliente'}</strong>
              </div>
              <HeartHandshake aria-hidden='true' size={21} />
            </div>

            <button
              type='button'
              className={styles.mobileMenuButton}
              aria-expanded={isMenuOpen}
              aria-controls='account-navigation'
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X aria-hidden='true' /> : <Menu aria-hidden='true' />}
              {isMenuOpen ? 'Cerrar menú' : 'Menú de mi cuenta'}
            </button>

            <nav
              id='account-navigation'
              className={`${styles.accountNavigation} ${
                isMenuOpen ? styles.accountNavigationOpen : ''
              }`}
              aria-label='Mi cuenta'
            >
              {navigationItems.map(({ href, label, icon: Icon }) => {
                const isActive =
                  href === '/cuenta' ? pathname === href : pathname.startsWith(href);

                return (
                  <Link
                    href={href}
                    key={href}
                    className={isActive ? styles.navLinkActive : styles.navLink}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon aria-hidden='true' size={20} />
                    {label}
                  </Link>
                );
              })}
              <button type='button' className={styles.signOutLink} onClick={handleSignOut}>
                <LogOut aria-hidden='true' size={20} />
                Cerrar sesión
              </button>
              {signOutError ? (
                <p className={styles.navigationError} role='alert'>
                  {signOutError}
                </p>
              ) : null}
            </nav>
          </aside>

          <div className={styles.accountContent}>
            <header className={styles.pageHeading}>
              <div>
                {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
                <h1>{title}</h1>
                {description ? <p>{description}</p> : null}
              </div>
              {action ? <div className={styles.headingAction}>{action}</div> : null}
            </header>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountShell;
