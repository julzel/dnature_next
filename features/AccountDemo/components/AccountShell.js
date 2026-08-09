'use client';

import {
  HeartHandshake,
  House,
  LogOut,
  Menu,
  PawPrint,
  ShieldCheck,
  ShoppingBasket,
  Stethoscope,
  UserRound,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '../../../components/Button';
import { useAccountDemo } from '../model/account-demo-context';
import DemoNotice from './DemoNotice';
import styles from '../AccountDemo.module.scss';

const navigationItems = [
  { href: '/cuenta', label: 'Inicio', icon: House },
  { href: '/cuenta/mascotas', label: 'Mis mascotas', icon: PawPrint },
  { href: '/cuenta/red-veterinaria', label: 'Red Veterinaria', icon: Stethoscope },
  { href: '/cuenta/carritos', label: 'Mis carritos', icon: ShoppingBasket },
  { href: '/cuenta/perfil', label: 'Mi perfil', icon: UserRound },
];

const AccountShell = ({ children, eyebrow, title, description, action }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isReady, profile, signOut } = useAccountDemo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    router.push('/cuenta/iniciar-sesion');
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
          <DemoNotice />
          <section className={styles.signedOutCard}>
            <span className={styles.roundIcon} aria-hidden='true'>
              <ShieldCheck size={32} />
            </span>
            <p className={styles.eyebrow}>Espacio personal</p>
            <h1>Iniciá sesión para ver esta sección</h1>
            <p>
              En esta demostración podés explorar perfiles de mascotas, planes
              de compra, aliados veterinarios y carritos guardados.
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

  return (
    <div className={styles.accountPage}>
      <div className={styles.accountContainer}>
        <DemoNotice compact />

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
